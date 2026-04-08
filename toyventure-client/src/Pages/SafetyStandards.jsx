import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const SafetyStandards = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-40 pb-32 min-h-screen bg-white bg-hero-glow relative fade-in selection:bg-red-200 px-6 overflow-hidden">
      {/* Unified Background Pattern */}
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      {/* Red-tinted ambient glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none opacity-30 bg-[radial-gradient(circle,rgba(220,38,38,0.1)_0%,rgba(220,38,38,0)_70%)] z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-red-100 text-red-600 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
          <span className="material-symbols-outlined text-[16px]">verified_user</span> Uncompromising Safety
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-8 text-red-950">
          Safe for them. <br/><span className="text-red-950/40">Peace of mind for you.</span>
        </h1>
        <p className="text-xl text-red-950/70 font-medium mb-16 leading-relaxed">
          At ToyBlix, we believe play should be completely worry-free. Every toy we curate goes through rigorous testing to exceed global safety standards.
        </p>

        <div className="space-y-12">
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-red-50 hover:bg-red-50/30 transition-colors">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-red-950">
              <span className="material-symbols-outlined text-red-600">eco</span> Non-Toxic Materials
            </h3>
            <p className="text-red-950/70 leading-relaxed font-medium">All our wooden toys are painted with 100% water-based, lead-free, and heavy-metal-free paints. If it ends up in a mouth, you don't have to panic.</p>
          </div>
          
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-red-50 hover:bg-red-50/30 transition-colors">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-red-950">
              <span className="material-symbols-outlined text-red-600">carpenter</span> Choke-Hazard Tested
            </h3>
            <p className="text-red-950/70 leading-relaxed font-medium">Toys designated for children under 3 years old undergo strict dimensional testing to ensure no small parts can detach and pose a choking risk during rigorous play.</p>
          </div>
          
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-red-50 hover:bg-red-50/30 transition-colors">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-red-950">
              <span className="material-symbols-outlined text-red-600">public</span> Global Certifications
            </h3>
            <p className="text-red-950/70 leading-relaxed font-medium">Our products meet and frequently exceed ASTM F963 (USA), EN71 (Europe), and ISO 8124 international toy safety standards.</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default SafetyStandards;