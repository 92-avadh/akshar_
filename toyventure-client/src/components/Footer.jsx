import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-red-950 pt-20 pb-40 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-900/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* ================= FOOTER CONTENT ================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 px-6 md:px-12 py-16 md:py-20 w-full max-w-[1440px] mx-auto relative z-10 pb-16">
        
        {/* Brand */}
        <div className="md:col-span-5 flex flex-col items-start pr-0 md:pr-12">
          <div className="flex items-center gap-2 mb-6">
            <Logo className="w-8 h-8 text-white" />
            <div className="text-2xl font-black text-white tracking-tight">ToyBlix</div>
          </div>
          
          <p className="text-sm font-medium text-red-200/70 mb-8 leading-relaxed max-w-sm">
            Making every childhood moment an adventure through wonderfully crafted, minimalist physical play. Designed to last.
          </p>

          <div className="flex gap-3">
            <a className="w-10 h-10 border border-red-800/50 rounded-full flex items-center justify-center text-red-200 hover:bg-red-900 hover:text-white hover:border-red-700 transition-all" href="#">
              <span className="material-symbols-outlined text-[18px]">share</span>
            </a>
            <a className="w-10 h-10 border border-red-800/50 rounded-full flex items-center justify-center text-red-200 hover:bg-red-900 hover:text-white hover:border-red-700 transition-all" href="#">
              <span className="material-symbols-outlined text-[18px]">public</span>
            </a>
          </div>
        </div>

        {/* Explore */}
        <div className="md:col-span-2">
          <h4 className="font-bold text-white mb-6 text-sm tracking-wide">Explore</h4>
          <ul className="space-y-4 font-medium text-red-200/70 text-sm">
            <li><Link className="hover:text-white" to="/shop">Action Figures</Link></li>
            <li><Link className="hover:text-white" to="/shop">Building Blocks</Link></li>
            <li><Link className="hover:text-white" to="/shop">Early Learning</Link></li>
            <li><Link className="hover:text-white" to="/shop">Arts & Crafts</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="md:col-span-2">
          <h4 className="font-bold text-white mb-6 text-sm tracking-wide">Support</h4>
          <ul className="space-y-4 font-medium text-red-200/70 text-sm">
            <li><Link className="hover:text-white" to="/safety-standards">Safety Standards</Link></li>
            <li><Link className="hover:text-white" to="/shipping">Shipping Info</Link></li>
            <li><Link className="hover:text-white" to="/returns">Returns</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="md:col-span-3">
          <h4 className="font-bold text-white mb-6 text-sm tracking-wide">Legal</h4>
          <ul className="space-y-4 font-medium text-red-200/70 text-sm">
            <li><Link className="hover:text-white" to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className="hover:text-white" to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      {/* ================= ILLUSTRATION SCENE ================= */}
      <div className="absolute bottom-0 left-0 w-full h-[260px] pointer-events-none">

        {/* Glow Behind Center */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-40 bg-yellow-300/20 blur-3xl rounded-full"></div>

        {/* Ground */}
        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-green-500/90 to-green-400/40 rounded-t-[100px]" />

        {/* LEFT - Puzzle */}
        <img
          src="/assets/Puzzle-amico.svg"
          alt="puzzle"
          className="absolute bottom-6 left-6 w-32 md:w-44 opacity-90 animate-floatSlow"
        />

        {/* CENTER - Kids (Main Hero) */}
        <img
          src="/assets/Kids playing with dolls-amico.svg"
          alt="kids"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 md:w-72 drop-shadow-xl"
        />

        {/* RIGHT - Baby */}
        <img
          src="/assets/Happy baby-rafiki.svg"
          alt="baby"
          className="absolute bottom-6 right-6 w-32 md:w-44 opacity-90 animate-floatSlow delay-200"
        />

        {/* Floating Elements */}
        <div className="absolute left-1/4 bottom-32 w-3 h-3 bg-yellow-400 rounded-full opacity-70 animate-bounce"></div>
        <div className="absolute right-1/4 bottom-28 w-2 h-2 bg-blue-400 rounded-full opacity-70 animate-bounce delay-200"></div>

      </div>

      {/* ================= COPYRIGHT ================= */}
      <div className="border-t border-red-900/50 py-8 px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-[1440px] mx-auto">
          <p className="text-red-200/50 text-xs">
            © {new Date().getFullYear()} ToyBlix. All rights reserved.
          </p>
          <p className="text-red-200/50 text-xs">
            Spark wonder in every play.
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;