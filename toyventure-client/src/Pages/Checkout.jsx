import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useGetUserProfileQuery,
} from '../features/api/apiSlice';
import { clearCart } from '../features/cart/cartSlice';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Razorpay SDK.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK.'));
    document.body.appendChild(script);
  });

const createCheckoutRequestKey = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `checkout-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [createRazorpayOrder, { isLoading: isCreatingOrder }] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment, { isLoading: isVerifyingPayment }] = useVerifyRazorpayPaymentMutation();
  const { data: profile } = useGetUserProfileQuery();

  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    phone: '',
    flatNumber: '',
    street: '',
    landmark: '',
    city: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [checkoutRequestKey] = useState(() => createCheckoutRequestKey());

  const totalPrice = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseInt(item.qty, 10) || 1;
    return acc + price * qty;
  }, 0);

  const isBusy = isCreatingOrder || isVerifyingPayment;

  const handleInputChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const handleSelectSavedAddress = (addressObj) => {
    setShippingDetails({
      fullName: profile?.name || '',
      phone: profile?.mobileNumber || '',
      flatNumber: addressObj.flatNumber,
      street: addressObj.street,
      landmark: addressObj.landmark || '',
      city: addressObj.city,
      pincode: addressObj.pincode,
    });
  };

  const launchRazorpayCheckout = async ({ order, razorpayOrder, razorpayKeyId }) => {
    await loadRazorpayScript();

    const keyId = razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!keyId) {
      throw new Error('Missing Razorpay key. Set VITE_RAZORPAY_KEY_ID or return it from the backend.');
    }

    const prefillPhone = shippingDetails.phone || profile?.mobileNumber || '';
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || 'null');

    const razorpay = new window.Razorpay({
      key: keyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'ToyBlix',
      description: `Order #${String(order._id).slice(-8)}`,
      order_id: razorpayOrder.id,
      image: '/favicon.svg',
      prefill: {
        name: shippingDetails.fullName || profile?.name || '',
        contact: prefillPhone,
        email: userInfo?.email || profile?.email || '',
      },
      notes: {
        localOrderId: order._id,
        paymentPreference: paymentMethod,
      },
      theme: {
        color: '#18181b',
      },
      handler: async (response) => {
        try {
          const verification = await verifyRazorpayPayment({
            localOrderId: order._id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }).unwrap();

          dispatch(clearCart());
          toast.success(verification.message || 'Payment verified successfully!');
          navigate('/profile');
        } catch (error) {
          toast.error(error?.data?.message || 'Payment captured, but verification failed. Please contact support.');
        }
      },
      modal: {
        confirm_close: true,
        ondismiss: () => {
          toast('Checkout closed. You can retry payment from this page.', { icon: 'i' });
        },
      },
    });

    razorpay.on('payment.failed', (event) => {
      const failureMessage =
        event?.error?.description || event?.error?.reason || 'Payment failed. Please try again.';
      toast.error(failureMessage);
    });

    razorpay.open();
  };

  const placeOrderHandler = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Add items before checking out.');
      navigate('/shop');
      return;
    }

    try {
      const checkoutSession = await createRazorpayOrder({
        orderItems: cartItems,
        shippingDetails,
        totalPrice,
        paymentMethod: 'razorpay',
        idempotencyKey: checkoutRequestKey,
      }).unwrap();

      if (checkoutSession.order?.isPaid) {
        dispatch(clearCart());
        toast.success('This checkout is already paid.');
        navigate('/profile');
        return;
      }

      await launchRazorpayCheckout(checkoutSession);
    } catch (error) {
      toast.error(error?.data?.message || error.message || 'Unable to start Razorpay checkout.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-surface flex flex-col items-center justify-center px-6">
        <span className="material-symbols-outlined text-[80px] text-zinc-300 mb-6">shopping_bag</span>
        <h2 className="text-3xl font-black text-zinc-800 mb-4">Your cart is empty</h2>
        <p className="text-zinc-500 mb-8 text-center max-w-md">Looks like you haven't added any magical toys to your cart yet.</p>
        <Link to="/shop" className="px-8 py-4 bg-primary-container text-white font-black rounded-full hover:-translate-y-1 hover:shadow-lg transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1100px] mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="card-surface p-8 rounded-[2.5rem] shadow-soft">
            <div className="flex items-center gap-3 mb-6 border-b border-white pb-4">
              <span className="material-symbols-outlined text-primary-container text-[28px]">local_shipping</span>
              <h1 className="text-2xl font-black text-zinc-800">Shipping Details</h1>
            </div>

            {profile?.addresses && profile.addresses.length > 0 && (
              <div className="mb-8 p-4 bg-white/40 rounded-2xl border border-white shadow-sm">
                <p className="text-sm font-bold text-zinc-500 mb-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">bolt</span> Quick Select Saved Address:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.addresses.map((addr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSavedAddress(addr)}
                      className="text-left p-3 rounded-xl border-2 border-transparent bg-white hover:border-primary-container/30 hover:shadow-md transition-all"
                    >
                      <p className="font-bold text-zinc-800 text-sm line-clamp-1">{addr.flatNumber}, {addr.street}</p>
                      <p className="text-xs text-zinc-500 mt-1">{addr.city} - {addr.pincode}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form id="checkout-form" onSubmit={placeOrderHandler} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-600 ml-1">Full Name</label>
                  <input required type="text" name="fullName" value={shippingDetails.fullName} onChange={handleInputChange} className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800" placeholder="John Doe" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-600 ml-1">Phone Number</label>
                  <input required type="tel" name="phone" value={shippingDetails.phone} onChange={handleInputChange} className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800" placeholder="+91 99999 00000" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-600 ml-1">Flat / Block No.</label>
                  <input required type="text" name="flatNumber" value={shippingDetails.flatNumber} onChange={handleInputChange} className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800" placeholder="A-404, Sunshine Apts" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-600 ml-1">Street / Locality</label>
                  <input required type="text" name="street" value={shippingDetails.street} onChange={handleInputChange} className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800" placeholder="M.G. Road" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-zinc-600 ml-1">Landmark (Optional)</label>
                  <input type="text" name="landmark" value={shippingDetails.landmark} onChange={handleInputChange} className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800" placeholder="Near City Mall" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-600 ml-1">City</label>
                  <input required type="text" name="city" value={shippingDetails.city} onChange={handleInputChange} className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800" placeholder="Mumbai" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-600 ml-1">Pincode</label>
                  <input required type="text" name="pincode" value={shippingDetails.pincode} onChange={handleInputChange} className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800" placeholder="400001" />
                </div>
              </div>
            </form>
          </div>

          <div className="card-surface p-8 rounded-[2.5rem] shadow-soft">
            <div className="flex items-center gap-3 mb-6 border-b border-white pb-4">
              <span className="material-symbols-outlined text-primary-container text-[28px]">payments</span>
              <h1 className="text-2xl font-black text-zinc-800">Secure Payment</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <label className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-2 shadow-sm hover:shadow-md ${paymentMethod === 'card' ? 'border-primary-container bg-primary-container/5' : 'border-white bg-white/60'}`}>
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-primary-container text-[28px]">credit_card</span>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 text-primary-container focus:ring-primary-container" />
                </div>
                <span className="font-black text-zinc-800 text-lg">Card</span>
                <span className="text-xs text-zinc-500 font-medium">Open Razorpay Checkout with cards enabled.</span>
              </label>

              <label className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-2 shadow-sm hover:shadow-md ${paymentMethod === 'upi' ? 'border-primary-container bg-primary-container/5' : 'border-white bg-white/60'}`}>
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-primary-container text-[28px]">qr_code_scanner</span>
                  <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-5 h-5 text-primary-container focus:ring-primary-container" />
                </div>
                <span className="font-black text-zinc-800 text-lg">UPI</span>
                <span className="text-xs text-zinc-500 font-medium">Use GPay, PhonePe, Paytm, or any UPI app inside Razorpay.</span>
              </label>
            </div>

            <div className="bg-white/50 border border-white rounded-[2rem] p-6 shadow-inner">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary-container text-[26px]">shield_lock</span>
                <div>
                  <p className="font-black text-zinc-800">ToyBlix does not collect card numbers or CVV.</p>
                  <p className="text-sm text-zinc-500 font-medium mt-2">
                    When you click pay, Razorpay opens its secure hosted checkout so payment details stay inside the payment gateway.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="card-surface p-8 rounded-[2.5rem] shadow-soft sticky top-32">
            <h2 className="text-xl font-black text-zinc-800 mb-6 border-b border-white pb-4">Order Summary</h2>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-4 items-center bg-white/40 p-3 rounded-2xl border border-white">
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-zinc-800 line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Qty: {item.qty}</p>
                  </div>
                  <div className="font-black text-zinc-800">
                    Rs {(parseFloat(item.price) || 0) * (parseInt(item.qty, 10) || 1)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white mt-6 pt-6 space-y-3">
              <div className="flex justify-between text-sm font-bold text-zinc-600">
                <span>Subtotal</span>
                <span>Rs {totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-zinc-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-lg font-bold text-zinc-800">Total Due</span>
                <span className="text-3xl font-black text-primary-container">Rs {totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isBusy}
              className="w-full py-4 mt-8 bg-zinc-900 text-white font-black text-lg rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 group"
            >
              {isBusy ? 'Opening Secure Checkout...' : `Pay Rs ${totalPrice.toLocaleString('en-IN')}`}
              {!isBusy && <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">lock</span>}
            </button>
            <p className="text-center text-[10px] text-zinc-400 font-bold mt-4 uppercase tracking-wider flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified_user</span> Razorpay Hosted Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
