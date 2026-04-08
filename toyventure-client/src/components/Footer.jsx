import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-red-950 pt-20 relative overflow-hidden">
      {/* Deep Dark Red Background to anchor the page */}
      
      {/* Subtle background glow effect to match Home page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-900/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* ================= FOOTER CONTENT ================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 px-6 md:px-12 py-16 md:py-20 w-full max-w-[1440px] mx-auto relative z-10 pb-16">
        
        <div className="md:col-span-5 flex flex-col items-start pr-0 md:pr-12">
          <div className="flex items-center gap-2 mb-6">
            <Logo className="w-8 h-8 text-white" />
            <div className="text-2xl font-black text-white tracking-tight">ToyBlix</div>
          </div>
          
          <p className="text-sm font-medium text-red-200/70 mb-8 leading-relaxed max-w-sm">
            Making every childhood moment a magical adventure through wonderfully crafted, minimalist physical play. Designed to last.
          </p>
          <div className="flex gap-3">
            <a className="w-10 h-10 border border-red-800/50 rounded-full flex items-center justify-center text-red-200 hover:bg-red-900 hover:text-white hover:border-red-700 transition-all" href="#" aria-label="Share">
              <span className="material-symbols-outlined text-[18px]">share</span>
            </a>
            <a className="w-10 h-10 border border-red-800/50 rounded-full flex items-center justify-center text-red-200 hover:bg-red-900 hover:text-white hover:border-red-700 transition-all" href="#" aria-label="Social">
              <span className="material-symbols-outlined text-[18px]">public</span>
            </a>
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-bold text-white mb-6 text-sm tracking-wide">Explore</h4>
          <ul className="space-y-4 font-medium text-red-200/70 text-sm">
            <li><Link className="hover:text-white transition-colors" to="/shop">Action Figures</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/shop">Building Blocks</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/shop">Early Learning</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/shop">Arts & Crafts</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
           <h4 className="font-bold text-white mb-6 text-sm tracking-wide">Support</h4>
          <ul className="space-y-4 font-medium text-red-200/70 text-sm">
            <li><Link className="hover:text-white transition-colors" to="/safety-standards">Safety Standards</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/shipping">Shipping Info</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/returns">Returns</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
           <h4 className="font-bold text-white mb-6 text-sm tracking-wide">Legal</h4>
          <ul className="space-y-4 font-medium text-red-200/70 text-sm">
            <li><Link className="hover:text-white transition-colors" to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className="hover:text-white transition-colors" to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      {/* ================= COPYRIGHT BANNER ================= */}
      <div className="border-t border-red-900/50 py-8 px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-[1440px] mx-auto w-full text-center md:text-left">
          <p className="text-red-200/50 font-medium text-xs tracking-wide">
            © {new Date().getFullYear()} ToyBlix. All rights reserved.
          </p>
          <p className="text-red-200/50 font-medium text-xs tracking-wide">
            Spark wonder in every play.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;