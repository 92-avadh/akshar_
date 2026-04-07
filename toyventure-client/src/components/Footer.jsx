import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-white mt-[300px] relative pt-20">
      
      {/* ================= TOYCKER INSPIRED LANDSCAPE DOODLE ================= */}
      <div className="absolute left-0 right-0 top-0 -translate-y-full w-full h-[200px] md:h-[300px] z-10 overflow-hidden pointer-events-none flex items-end">
        {/* Sky background */}
        <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-sky-50 to-transparent"></div>
        
        {/* Playful Stars */}
        <svg className="absolute top-10 left-[15%] w-8 h-8 text-amber-300 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
           <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <svg className="absolute top-20 right-[25%] w-6 h-6 text-teal-300 animate-[pulse_3s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="currentColor">
           <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <svg className="absolute top-12 right-[45%] w-4 h-4 text-orange-300 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
           <circle cx="12" cy="12" r="10"/>
        </svg>
        
        {/* Layered Green Hills */}
        <svg className="absolute bottom-0 w-[120%] -left-[10%] h-[70%]" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60C300 -60 900 -60 1200 60V120H0V60Z" className="fill-emerald-50" />
        </svg>
        <svg className="absolute bottom-0 w-[150%] -left-[20%] h-[50%]" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 40C400 120 800 -40 1200 40V120H0V40Z" className="fill-emerald-100/80" />
        </svg>

        {/* Existing Doodle Embedded in Landscape */}
        <div className="absolute bottom-[-10px] left-[10%] md:left-[20%] w-24 md:w-32 z-20 pointer-events-auto">
          <img src="/image_8f0144.jpg" alt="" onError={(e) => e.target.style.display = 'none'} className="w-full h-full object-contain mix-blend-multiply opacity-90 transition-transform hover:scale-110 origin-bottom" />
        </div>
      </div>

      {/* ================= TOYCKER INSPIRED NEWSLETTER BOX ================= */}
      {/* Floating rounded gray box over the hills transition */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="absolute left-1/2 -top-[200px] md:-top-[240px] -translate-x-1/2 w-[90%] max-w-[800px] z-30 pointer-events-auto"
      >
         <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
           <div className="text-center md:text-left">
             <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Stay Connected</h3>
             <p className="text-sm text-slate-500 font-bold mt-1">Get the latest toys & offers directly in your inbox.</p>
           </div>
           <form className="flex w-full md:w-auto bg-white rounded-full p-2 shadow-sm">
             <input type="email" placeholder="Your email here" className="flex-1 bg-transparent px-6 py-2 outline-none font-bold text-slate-600 placeholder:text-slate-400 placeholder:font-medium min-w-[200px]" />
             <button type="button" className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-slate-900 hover:bg-amber-500 hover:scale-105 transition-all shadow-md shrink-0">
                <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
             </button>
           </form>
         </div>
      </motion.div>

      {/* ================= FOOTER CONTENT ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-12 py-16 md:py-20 w-full max-w-[1440px] mx-auto relative z-10 pb-8">
        
        <div className="space-y-6">
          <div className="flex items-center gap-2 group z-20">
             <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[24px]">toys</span>
             </div>
             <div className="text-3xl font-black text-slate-900 tracking-tighter">Toy<span className="text-orange-500">Blix</span></div>
          </div>
          
          <p className="text-slate-500 font-bold leading-relaxed text-sm">
            Making every childhood moment a magical adventure through wonderfully crafted physical play.
          </p>
          <div className="flex gap-3">
            <a className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shadow-sm hover:bg-orange-500 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined text-sm">share</span></a>
            <a className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shadow-sm hover:bg-blue-500 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined text-sm">public</span></a>
          </div>
        </div>

        <div>
          <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs bg-slate-100 inline-block px-3 py-1.5 rounded-full">Explore</h4>
          <ul className="space-y-4 font-bold text-slate-500 text-sm">
            <li><Link className="hover:text-orange-500 transition-colors" to="/shop">Action Figures</Link></li>
            <li><Link className="hover:text-teal-500 transition-colors" to="/shop">Building Blocks</Link></li>
            <li><Link className="hover:text-amber-500 transition-colors" to="/shop">Early Learning</Link></li>
            <li><Link className="hover:text-purple-500 transition-colors" to="/shop">Arts & Crafts</Link></li>
          </ul>
        </div>

        <div>
           <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs bg-slate-100 inline-block px-3 py-1.5 rounded-full">Support</h4>
          <ul className="space-y-4 font-bold text-slate-500 text-sm">
            <li><Link className="hover:text-orange-500 transition-colors" to="/safety-standards">Safety Standards</Link></li>
            <li><Link className="hover:text-teal-500 transition-colors" to="/shipping">Shipping Info</Link></li>
            <li><Link className="hover:text-amber-500 transition-colors" to="/returns">Returns</Link></li>
          </ul>
        </div>

        <div>
           <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs bg-slate-100 inline-block px-3 py-1.5 rounded-full">Legal</h4>
          <ul className="space-y-4 font-bold text-slate-500 text-sm">
            <li><Link className="hover:text-orange-500 transition-colors" to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className="hover:text-teal-500 transition-colors" to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      {/* ================= COPYRIGHT BANNER ================= */}
      {/* Red accent strip at very bottom a la Toycker */}
      <div className="bg-red-500 py-6 px-6 md:px-12 text-center text-white/90 font-bold text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} ToyBlix. Spark wonder in every play.
      </div>
    </footer>
  );
};

export default Footer;