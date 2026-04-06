import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const ShippingInfo = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <main className="bg-[#fafafa] text-slate-900 min-h-screen pt-40 pb-32 px-6 selection:bg-orange-200">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-8">Shipping Information</h1>
        <p className="text-xl text-slate-600 font-medium mb-16 leading-relaxed">
          We know they can't wait to play. We pack and ship all orders with care and speed.
        </p>

        <div className="prose prose-lg prose-slate max-w-none font-medium">
          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Processing Time</h2>
          <p className="text-slate-600 mb-8">Orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed on the next business day.</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Shipping Rates & Estimates</h2>
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-8">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-6 font-bold text-slate-900">Shipping Method</th>
                  <th className="p-6 font-bold text-slate-900">Estimated Delivery</th>
                  <th className="p-6 font-bold text-slate-900">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="p-6">Standard Shipping</td>
                  <td className="p-6">3-5 Business Days</td>
                  <td className="p-6 font-bold">Free over ₹999 (else ₹99)</td>
                </tr>
                <tr>
                  <td className="p-6">Express Shipping</td>
                  <td className="p-6">1-2 Business Days</td>
                  <td className="p-6 font-bold">₹199</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Order Tracking</h2>
          <p className="text-slate-600">Once your order ships, you will receive a confirmation email containing your tracking number(s). The tracking link will be active within 24 hours.</p>
        </div>
      </motion.div>
    </main>
  );
};

export default ShippingInfo;