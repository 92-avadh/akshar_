import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
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


      {/* ================= FOOTER CONTENT ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-12 py-16 md:py-20 w-full max-w-[1440px] mx-auto relative z-10 pb-8">
        
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Logo className="w-10 h-10" />
            <div className="text-3xl font-black text-slate-900 tracking-tighter">Toy<span className="text-orange-500">Blix</span></div>
          </div>
          
          <p className="text-sm font-bold text-slate-500 mb-6 leading-relaxed">
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