import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <main className="bg-[#fafafa] text-slate-900 min-h-screen pt-40 pb-32 px-6 selection:bg-orange-200">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6">Terms of Service</h1>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-16">Last Updated: October 2024</p>

        <div className="prose prose-slate max-w-none text-slate-600 font-medium space-y-8">
          <p>Welcome to ToyBlix. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully.</p>

          <h2 className="text-2xl font-bold text-slate-900 pt-8 border-t border-slate-200">1. Online Store Terms</h2>
          <p>By agreeing to these Terms, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose.</p>

          <h2 className="text-2xl font-bold text-slate-900 pt-8">2. Products and Pricing</h2>
          <p>Prices for our products are subject to change without notice. We reserve the right to modify or discontinue a product without notice at any time. We have made every effort to display as accurately as possible the colors and images of our products.</p>

          <h2 className="text-2xl font-bold text-slate-900 pt-8">3. Accuracy of Billing</h2>
          <p>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. In the event that we make a change to or cancel an order, we will attempt to notify you.</p>

          <h2 className="text-2xl font-bold text-slate-900 pt-8">4. Intellectual Property</h2>
          <p>All content included on this site, such as text, graphics, logos, images, and software, is the property of ToyBlix or its content suppliers and protected by international copyright laws.</p>
        </div>
      </motion.div>
    </main>
  );
};

export default Terms;