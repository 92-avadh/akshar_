import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Returns = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <main className="bg-[#fafafa] text-slate-900 min-h-screen pt-40 pb-32 px-6 selection:bg-orange-200">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-8">Returns & Exchanges</h1>
        <p className="text-xl text-slate-600 font-medium mb-12 leading-relaxed">
          Not exactly what you expected? No problem. We offer a hassle-free 30-day return policy.
        </p>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Our 30-Day Guarantee</h2>
          <p className="text-slate-600 font-medium mb-6">
            If you or your child are not completely satisfied with your purchase, you may return the item within 30 days of receipt for a full refund to the original payment method.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 font-medium mb-8">
            <li>Items must be unused and in their original packaging.</li>
            <li>Gift cards and personalized items are final sale and non-refundable.</li>
            <li>Return shipping costs are the responsibility of the customer unless the item is defective.</li>
          </ul>
          
          <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-orange-500 transition-colors shadow-lg">
            Start a Return
          </button>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-4">Damaged or Defective Items</h2>
        <p className="text-slate-600 font-medium">
          If your toy arrives damaged or breaks prematurely, please contact our support team immediately at <span className="font-bold text-orange-500">support@toyblix.com</span> with photos of the defect. We will issue a replacement at no cost to you.
        </p>
      </motion.div>
    </main>
  );
};

export default Returns;