import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <main className="bg-[#fafafa] text-slate-900 min-h-screen pt-40 pb-32 px-6 selection:bg-orange-200">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6">Privacy Policy</h1>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-16">Last Updated: October 2024</p>

        <div className="prose prose-slate max-w-none text-slate-600 font-medium space-y-8">
          <p>At ToyBlix, we take your privacy and your family's privacy very seriously. This policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our store.</p>

          <h2 className="text-2xl font-bold text-slate-900 pt-8 border-t border-slate-200">1. Information We Collect</h2>
          <p>When you make a purchase, we collect certain information from you, including your name, billing address, shipping address, payment information, email address, and phone number. We refer to this as "Order Information."</p>

          <h2 className="text-2xl font-bold text-slate-900 pt-8">2. Children's Privacy</h2>
          <p>Our website is designed for parents and adults. We do not knowingly collect personal information from children under the age of 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us to request deletion.</p>

          <h2 className="text-2xl font-bold text-slate-900 pt-8">3. How We Use Your Information</h2>
          <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment, arranging for shipping, and providing invoices). Additionally, we use this info to communicate with you and screen our orders for potential risk or fraud.</p>

          <h2 className="text-2xl font-bold text-slate-900 pt-8">4. Data Retention</h2>
          <p>When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.</p>
        </div>
      </motion.div>
    </main>
  );
};

export default PrivacyPolicy;