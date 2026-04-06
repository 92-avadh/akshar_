import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-32 relative">
      
      {/* ================= PEEKING DOODLE ================= */}
      {/* This positions the doodle sitting on the top right edge of the footer */}
      <div className="absolute right-10 md:right-32 top-0 -translate-y-[65%] w-32 md:w-48 z-20 pointer-events-none group">
        <img 
          src="/image_8f0144.jpg" 
          alt="" 
          /* If the image is missing, this stops the ugly text from showing */
          onError={(e) => e.target.style.display = 'none'}
          className="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:-translate-y-4 group-hover:rotate-6 transition-all duration-500 ease-out pointer-events-auto cursor-pointer"
        />
      </div>

      {/* ================= FOOTER CONTENT ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-12 py-16 md:py-20 w-full max-w-[1440px] mx-auto relative z-10">
        
        <div className="space-y-6">
          <div className="text-3xl font-black text-slate-900 tracking-tighter">ToyVenture</div>
          <p className="text-slate-500 font-medium leading-relaxed">
            Making every childhood moment a magical adventure through play.
          </p>
          <div className="flex gap-4">
            <a className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 shadow-sm border border-slate-200 hover:bg-orange-500 hover:text-white hover:scale-110 hover:border-orange-500 transition-all" href="#">
              <span className="material-symbols-outlined text-lg">share</span>
            </a>
            <a className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 shadow-sm border border-slate-200 hover:bg-orange-500 hover:text-white hover:scale-110 hover:border-orange-500 transition-all" href="#">
              <span className="material-symbols-outlined text-lg">public</span>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-black text-slate-900 mb-6 uppercase tracking-wider text-sm">Shop</h4>
          <ul className="space-y-4">
            <li><Link className="text-slate-500 font-medium hover:text-orange-500 transition-colors block" to="/shop">Action Figures</Link></li>
            <li><Link className="text-slate-500 font-medium hover:text-orange-500 transition-colors block" to="/shop">Building Blocks</Link></li>
            <li><Link className="text-slate-500 font-medium hover:text-orange-500 transition-colors block" to="/shop">Early Learning</Link></li>
            <li><Link className="text-slate-500 font-medium hover:text-orange-500 transition-colors block" to="/shop">Arts & Crafts</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-slate-900 mb-6 uppercase tracking-wider text-sm">Support</h4>
          <ul className="space-y-4">
            <li><Link className="text-slate-500 font-medium hover:text-orange-500 transition-colors block" to="/safety-standards">Safety Standards</Link></li>
            <li><Link className="text-slate-500 font-medium hover:text-orange-500 transition-colors block" to="/shipping">Shipping Info</Link></li>
            <li><Link className="text-slate-500 font-medium hover:text-orange-500 transition-colors block" to="/returns">Returns</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-slate-900 mb-6 uppercase tracking-wider text-sm">Legal</h4>
          <ul className="space-y-4">
            <li><Link className="text-slate-500 font-medium hover:text-orange-500 transition-colors block" to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className="text-slate-500 font-medium hover:text-orange-500 transition-colors block" to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      {/* ================= COPYRIGHT ================= */}
      <div className="border-t border-slate-100 py-8 px-6 md:px-12 text-center text-slate-400 font-medium text-sm">
        © {new Date().getFullYear()} ToyVenture. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;