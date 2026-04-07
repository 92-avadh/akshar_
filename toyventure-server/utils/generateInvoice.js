const PDFDocument = require('pdfkit');

const generateInvoice = (order, user) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Header
            doc.fillColor('#444444')
                .fontSize(20)
                .text('ToyBlix', 50, 57)
                .fontSize(10)
                .text('Invoice Number: ' + String(order._id).slice(-8).toUpperCase(), 200, 50, { align: 'right' })
                .text('Date: ' + new Date(order.createdAt || Date.now()).toLocaleDateString(), 200, 65, { align: 'right' })
                .text('Payment Status: ' + (order.paymentStatus || 'Paid').toUpperCase(), 200, 80, { align: 'right' })
                .moveDown();

            doc.moveTo(50, 100).lineTo(550, 100).stroke();

            // Customer Details
            const shipping = order.shippingDetails || {};
            doc.fillColor('#333333')
                .fontSize(14)
                .text('Billed To', 50, 120)
                .fontSize(10)
                .text(user.name || shipping.fullName || 'Customer', 50, 140)
                .text(`${shipping.flatNumber}, ${shipping.street}`, 50, 155)
                .text(shipping.landmark ? `${shipping.landmark}` : '', 50, 170)
                .text(`${shipping.city} - ${shipping.pincode}`, 50, 185)
                .text(`Phone: ${shipping.phone || user.mobileNumber || ''}`, 50, 200)
                .moveDown();
            
            doc.moveTo(50, 230).lineTo(550, 230).stroke();

            // Table Header
            let y = 250;
            doc.fontSize(10).font('Helvetica-Bold');
            doc.text('Item', 50, y);
            doc.text('Qty', 350, y, { width: 50, align: 'center' });
            doc.text('Price', 400, y, { width: 50, align: 'right' });
            doc.text('Total', 480, y, { width: 70, align: 'right' });
            
            doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();
            doc.font('Helvetica');
            y += 25;

            // Order Items
            (order.orderItems || []).forEach(item => {
                const title = (item.title || 'Product').substring(0, 30);
                const qty = item.qty || 1;
                const price = parseFloat(item.price) || 0;
                const total = price * qty;

                doc.text(title, 50, y);
                doc.text(qty.toString(), 350, y, { width: 50, align: 'center' });
                doc.text(`Rs ${price.toFixed(2)}`, 400, y, { width: 50, align: 'right' });
                doc.text(`Rs ${total.toFixed(2)}`, 480, y, { width: 70, align: 'right' });
                y += 20;
            });

            doc.moveTo(50, y).lineTo(550, y).stroke();
            y += 15;

            // Totals
            const subtotal = order.orderItems.reduce((acc, item) => acc + (parseFloat(item.price) * (item.qty || 1)), 0);
            if (subtotal !== order.totalPrice) {
                const discount = subtotal - order.totalPrice;
                doc.font('Helvetica-Bold').text('Total Discount:', 350, y, { width: 100, align: 'right' });
                doc.text(`-Rs ${discount.toFixed(2)}`, 450, y, { width: 100, align: 'right' });
                y += 20;
            }

            doc.font('Helvetica-Bold').fontSize(12);
            doc.text('Final Amount:', 350, y, { width: 100, align: 'right' });
            doc.text(`Rs ${order.totalPrice.toFixed(2)}`, 450, y, { width: 100, align: 'right' });

            // Footer
            doc.fontSize(10).font('Helvetica').text(
                'Thank you for shopping with ToyBlix - Where Imagination Comes to Life!',
                50,
                700,
                { align: 'center', width: 500 }
            );

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = generateInvoice;
