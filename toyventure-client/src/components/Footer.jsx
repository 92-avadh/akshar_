import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="relative bg-red-950 pt-16 pb-12 overflow-hidden mt-auto w-full flex-shrink-0">

      {/* ================= PREMIUM RED BACKGROUND ================= */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-red-900 to-red-800/60 z-0"></div>

      {/* Soft Glow (center highlight) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-red-900/30 blur-[140px] rounded-full pointer-events-none"></div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* ================= NEWSLETTER ================= */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/20 blur-3xl rounded-full"></div>
          
          <div className="max-w-md relative z-10 text-center md:text-left">
            <h3 className="text-3xl font-black text-white mb-2 tracking-tight">
              Stay Connected
            </h3>
            <p className="text-red-100/80 text-sm leading-relaxed">
              Join our newsletter for the latest toy drops and updates.
            </p>
          </div>
          
          <form className="flex w-full md:w-auto bg-white/20 backdrop-blur-sm rounded-full p-1.5 flex-grow max-w-md shadow-inner">
            <input
              type="email"
              placeholder="Enter your email..."
              className="w-full bg-transparent text-white placeholder:text-red-200 px-5 py-3 text-sm outline-none"
            />
            <button className="bg-white text-red-700 font-bold px-6 py-3 rounded-full hover:bg-red-50 transition">
              Subscribe
            </button>
          </form>
        </div>

        {/* ================= LINKS ================= */}
        <div className="grid md:grid-cols-12 gap-12 pb-8">
          
          {/* BRAND */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-6 bg-red-900/40 p-3 rounded-2xl border border-red-800 shadow-xl hover:scale-105 transition">
              <Logo className="w-8 h-8 text-white" />
              <span className="text-white font-black text-2xl">ToyBlix</span>
            </div>
            <p className="text-red-200/80 text-sm max-w-sm text-center md:text-left">
              Premium playful experiences crafted to inspire imagination and joy.
            </p>
          </div>

          {/* EXPLORE */}
          <div className="md:col-span-2 text-center md:text-left">
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wide">
              Explore
            </h4>
            <ul className="space-y-3 text-red-200/70 text-sm">
              <li className="hover:text-white transition"><Link to="/shop">Toys</Link></li>
              <li className="hover:text-white transition"><Link to="/shop">STEM</Link></li>
              <li className="hover:text-white transition"><Link to="/shop">Creative</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div className="md:col-span-2 text-center md:text-left">
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wide">
              Support
            </h4>
            <ul className="space-y-3 text-red-200/70 text-sm">
              <li className="hover:text-white transition"><Link to="/shippingInfo">Shipping</Link></li>
              <li className="hover:text-white transition"><Link to="/returns">Returns</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div className="md:col-span-3 text-center md:text-left">
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wide">
              Legal
            </h4>
            <ul className="space-y-3 text-red-200/70 text-sm">
              <li className="hover:text-white transition"><Link to="/privacyPolicy">Privacy</Link></li>
              <li className="hover:text-white transition"><Link to="/terms">Terms</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* ================= COPYRIGHT ================= */}
      <div className="relative z-30 w-full text-center text-white/60 text-xs py-4 border-t border-white/10 backdrop-blur-md">
        © {new Date().getFullYear()} ToyBlix — Designed for joyful play ✨
      </div>

    </footer>
  );
};

export default Footer;