const crypto = require('crypto');
const Order = require('../models/Order');
const PaymentEvent = require('../models/PaymentEvent');
const {
  normalizeOrderItems,
  validateOrderPayload,
  assertInventoryAvailable,
  commitInventoryForOrder,
} = require('../utils/orderInventory');
const { getRazorpayClient } = require('../utils/razorpay');

const formatBadRequest = (message, res) => res.status(400).json({ message });

const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(left || '', 'utf8');
  const rightBuffer = Buffer.from(right || '', 'utf8');

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const buildReceipt = (userId) => `tv_${String(userId).slice(-6)}_${Date.now().toString().slice(-8)}`;

const logPaymentEvent = (payload) => {
  console.log(
    JSON.stringify({
      level: 'info',
      type: 'payment',
      ...payload,
    })
  );
};

const serializeRazorpayOrder = (razorpayOrder) => ({
  id: razorpayOrder.id,
  amount: razorpayOrder.amount,
  currency: razorpayOrder.currency,
  receipt: razorpayOrder.receipt,
  status: razorpayOrder.status,
});

const markOrderPaid = async (order, paymentDetails) => {
  if (order.isPaid && order.paymentStatus === 'paid') {
    order.razorpay = {
      ...order.razorpay,
      paymentId: order.razorpay?.paymentId || paymentDetails.paymentId,
      signature: order.razorpay?.signature || paymentDetails.signature || null,
      lastWebhookEvent: paymentDetails.eventType || order.razorpay?.lastWebhookEvent,
      lastWebhookAt: paymentDetails.eventType ? new Date() : order.razorpay?.lastWebhookAt,
    };
    await order.save();

    return {
      order,
      paymentReviewed: order.orderStatus === 'payment_review',
    };
  }

  if (!order.isPaid) {
    const inventoryResult = await commitInventoryForOrder(order.orderItems);

    if (!inventoryResult.committed) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentStatus = 'paid';
      order.orderStatus = 'payment_review';
      order.inventoryIssue = inventoryResult.reason;
      order.paymentFailureReason = null;
      order.razorpay = {
        ...order.razorpay,
        paymentId: paymentDetails.paymentId,
        signature: paymentDetails.signature || order.razorpay?.signature,
        lastWebhookEvent: paymentDetails.eventType || order.razorpay?.lastWebhookEvent,
        lastWebhookAt: paymentDetails.eventType ? new Date() : order.razorpay?.lastWebhookAt,
      };
      await order.save();

      return {
        order,
        paymentReviewed: true,
      };
    }
  }

  order.isPaid = true;
  order.paidAt = order.paidAt || new Date();
  order.paymentStatus = 'paid';
  order.orderStatus = order.isDelivered ? 'fulfilled' : 'paid';
  order.inventoryCommitted = true;
  order.inventoryIssue = null;
  order.paymentFailureReason = null;
  order.razorpay = {
    ...order.razorpay,
    paymentId: paymentDetails.paymentId,
    signature: paymentDetails.signature || order.razorpay?.signature,
    lastWebhookEvent: paymentDetails.eventType || order.razorpay?.lastWebhookEvent,
    lastWebhookAt: paymentDetails.eventType ? new Date() : order.razorpay?.lastWebhookAt,
  };

  await order.save();

  return {
    order,
    paymentReviewed: false,
  };
};

const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingDetails, totalPrice } = req.body;
    const idempotencyKey = req.get('Idempotency-Key') || req.body.idempotencyKey;

    validateOrderPayload({ orderItems, shippingDetails, totalPrice });

    if (!idempotencyKey) {
      return formatBadRequest('Missing Idempotency-Key for Razorpay checkout.', res);
    }

    const existingOrder = await Order.findOne({ user: req.user._id, idempotencyKey }).sort({ createdAt: -1 });
    if (existingOrder?.razorpay?.orderId) {
      return res.status(existingOrder.isPaid ? 200 : 201).json({
        message: existingOrder.isPaid ? 'Payment already verified for this checkout.' : 'Existing checkout session found.',
        order: existingOrder,
        razorpayOrder: {
          id: existingOrder.razorpay.orderId,
          amount: existingOrder.razorpay.amount,
          currency: existingOrder.currency,
          receipt: existingOrder.razorpay.receipt,
          status: existingOrder.isPaid ? 'paid' : 'created',
        },
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      });
    }

    const normalizedOrderItems = normalizeOrderItems(orderItems);
    await assertInventoryAvailable(normalizedOrderItems);

    const razorpay = getRazorpayClient();
    const receipt = buildReceipt(req.user._id);
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(totalPrice) * 100),
      currency: 'INR',
      receipt,
      notes: {
        userId: String(req.user._id),
        requestId: req.requestId,
      },
    });

    const localOrder = await Order.create({
      user: req.user._id,
      orderItems: normalizedOrderItems,
      shippingDetails,
      totalPrice: Number(totalPrice),
      currency: 'INR',
      paymentMethod: 'razorpay',
      orderStatus: 'pending_payment',
      paymentStatus: 'pending',
      idempotencyKey,
      razorpay: {
        orderId: razorpayOrder.id,
        receipt: razorpayOrder.receipt,
        amount: razorpayOrder.amount,
      },
    });

    logPaymentEvent({
      requestId: req.requestId,
      action: 'create_razorpay_order',
      localOrderId: localOrder._id,
      razorpayOrderId: razorpayOrder.id,
    });

    res.status(201).json({
      message: 'Razorpay order created successfully.',
      order: localOrder,
      razorpayOrder: serializeRazorpayOrder(razorpayOrder),
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    if (error.message.includes('stock') || error.message.includes('quantity') || error.message.includes('Missing')) {
      return formatBadRequest(error.message, res);
    }

    next(error);
  }
};

const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      localOrderId,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    } = req.body;

    if (!localOrderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return formatBadRequest('Missing Razorpay verification fields.', res);
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Missing RAZORPAY_KEY_SECRET environment variable');
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (!safeEqual(expectedSignature, razorpaySignature)) {
      logPaymentEvent({
        requestId: req.requestId,
        action: 'signature_mismatch',
        localOrderId,
        razorpayOrderId,
      });

      return res.status(400).json({ message: 'Invalid Razorpay signature.' });
    }

    const order = await Order.findOne({
      _id: localOrderId,
      user: req.user._id,
      'razorpay.orderId': razorpayOrderId,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found for verification.' });
    }

    const paymentResult = await markOrderPaid(order, {
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    logPaymentEvent({
      requestId: req.requestId,
      action: 'verify_razorpay_payment',
      localOrderId: order._id,
      razorpayOrderId,
      razorpayPaymentId,
      paymentReviewed: paymentResult.paymentReviewed,
    });

    res.status(200).json({
      message: paymentResult.paymentReviewed
        ? 'Payment captured, but inventory needs manual review.'
        : 'Payment verified successfully.',
      order: paymentResult.order,
    });
  } catch (error) {
    next(error);
  }
};

const handleRazorpayWebhook = async (req, res, next) => {
  try {
    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      throw new Error('Missing RAZORPAY_WEBHOOK_SECRET environment variable');
    }

    const signature = req.get('x-razorpay-signature');
    const rawBody = req.rawBody;

    if (!rawBody || !signature) {
      return res.status(400).json({ message: 'Missing webhook signature or payload.' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (!safeEqual(expectedSignature, signature)) {
      return res.status(400).json({ message: 'Invalid webhook signature.' });
    }

    const webhookEventId =
      req.get('x-razorpay-event-id') ||
      crypto.createHash('sha256').update(rawBody).digest('hex');

    const existingEvent = await PaymentEvent.findOne({ provider: 'razorpay', eventId: webhookEventId });
    if (existingEvent) {
      return res.status(200).json({ received: true, duplicate: true });
    }

    const eventType = req.body.event;
    const paymentEntity = req.body.payload?.payment?.entity;
    const refundEntity = req.body.payload?.refund?.entity;

    let order = null;

    if (paymentEntity?.order_id) {
      order = await Order.findOne({ 'razorpay.orderId': paymentEntity.order_id });
    } else if (refundEntity?.payment_id) {
      order = await Order.findOne({ 'razorpay.paymentId': refundEntity.payment_id });
    }

    if (order) {
      if (eventType === 'payment.captured') {
        await markOrderPaid(order, {
          paymentId: paymentEntity.id,
          eventType,
        });
      }

      if (eventType === 'payment.failed') {
        if (order.isPaid) {
          await PaymentEvent.create({
            provider: 'razorpay',
            eventId: webhookEventId,
            eventType,
            order: order._id,
            payloadHash: crypto.createHash('sha256').update(rawBody).digest('hex'),
          });

          return res.status(200).json({ received: true, ignored: true });
        }

        order.paymentStatus = 'failed';
        order.orderStatus = 'pending_payment';
        order.paymentFailureReason = paymentEntity?.error_description || paymentEntity?.error_reason || 'Payment failed';
        order.razorpay = {
          ...order.razorpay,
          paymentId: paymentEntity?.id || order.razorpay?.paymentId,
          lastWebhookEvent: eventType,
          lastWebhookAt: new Date(),
        };
        await order.save();
      }

      if (eventType === 'refund.processed') {
        order.paymentStatus = 'refunded';
        order.orderStatus = 'refunded';
        order.razorpay = {
          ...order.razorpay,
          refundId: refundEntity?.id || order.razorpay?.refundId,
          lastWebhookEvent: eventType,
          lastWebhookAt: new Date(),
        };
        await order.save();
      }
    }

    await PaymentEvent.create({
      provider: 'razorpay',
      eventId: webhookEventId,
      eventType,
      order: order?._id || null,
      payloadHash: crypto.createHash('sha256').update(rawBody).digest('hex'),
    });

    logPaymentEvent({
      requestId: req.requestId,
      action: 'webhook_processed',
      eventType,
      eventId: webhookEventId,
      localOrderId: order?._id || null,
    });

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
};
