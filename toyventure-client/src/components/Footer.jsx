// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

// 1. Import your image from the assets folder
import footerBg from "../assets/footer-bg.png";

const Footer = () => {
  return (
    <footer className="relative pt-24 pb-16 overflow-hidden mt-auto w-full flex-shrink-0 border-t border-red-900/30">

      {/* ================= BACKGROUND IMAGE ================= */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${footerBg})` }}
      ></div>

      {/* Overlay: Darkens the image slightly and adds a tiny blur so white text pops */}
      <div className="absolute inset-0 bg-red-950/70 z-[1] backdrop-blur-[2px]"></div>

      {/* Glow Effect */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-red-600/20 blur-[140px] rounded-full pointer-events-none z-[2]"></div>

      {/* ================= CLOUDS ================= */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">

        <svg className="cloud cloud1" viewBox="0 0 120 60">
          <g fill="#ffffff">
            <circle cx="30" cy="35" r="20" />
            <circle cx="55" cy="25" r="25" />
            <circle cx="85" cy="35" r="20" />
            <rect x="30" y="35" width="55" height="20" />
          </g>
        </svg>

        <svg className="cloud cloud2" viewBox="0 0 100 50">
          <g fill="#ffffff">
            <circle cx="25" cy="30" r="15" />
            <circle cx="50" cy="20" r="20" />
            <circle cx="75" cy="30" r="15" />
            <rect x="25" y="30" width="50" height="15" />
          </g>
        </svg>

        <svg className="cloud cloud3" viewBox="0 0 140 70">
          <g fill="#ffffff">
            <circle cx="35" cy="40" r="22" />
            <circle cx="70" cy="28" r="28" />
            <circle cx="105" cy="40" r="22" />
            <rect x="35" y="40" width="70" height="20" />
          </g>
        </svg>

      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* NEWSLETTER */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 mb-20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/20 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="max-w-md relative z-10 text-center md:text-left">
            <h3 className="text-3xl font-black text-white mb-2 tracking-tight">
              Stay Connected
            </h3>
            <p className="text-red-100/90 text-sm leading-relaxed">
              Join our newsletter for the latest toy drops and updates.
            </p>
          </div>
          
          <form className="flex w-full md:w-auto bg-white/20 backdrop-blur-sm rounded-full p-1.5 flex-grow max-w-md shadow-inner relative z-10">
            <input
              type="email"
              placeholder="Enter your email..."
              className="w-full bg-transparent text-white placeholder:text-red-100 px-5 py-3 text-sm outline-none"
            />
            <button className="bg-white text-red-900 font-bold px-6 py-3 rounded-full hover:bg-red-50 transition">
              Subscribe
            </button>
          </form>
        </div>

        {/* LINKS */}
        <div className="grid md:grid-cols-12 gap-12 pb-12">
          
          <div className="md:col-span-4 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-6 bg-red-950/60 p-3 rounded-2xl border border-red-800 shadow-xl hover:scale-105 transition backdrop-blur-sm">
              <Logo className="w-8 h-8 text-white" />
              <span className="text-white font-black text-2xl">ToyBlix</span>
            </div>
            <p className="text-red-100/80 text-sm max-w-sm text-center md:text-left">
              Premium playful experiences crafted to inspire imagination and joy.
            </p>
          </div>

          <div className="md:col-span-2 text-center md:text-left">
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wide">Explore</h4>
            <ul className="space-y-3 text-red-100/70 text-sm">
              <li><Link to="/shop" className="hover:text-white transition">Toys</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 text-center md:text-left">
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wide">Support</h4>
            <ul className="space-y-3 text-red-100/70 text-sm">
              <li><Link to="/shipping" className="hover:text-white transition">Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-white transition">Returns</Link></li>
              <li><Link to="/safety-standards" className="hover:text-white transition">Safety</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 text-center md:text-left">
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wide">Legal</h4>
            <ul className="space-y-3 text-red-100/70 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="relative z-30 w-full text-center text-white/70 text-xs py-6 border-t border-white/10 backdrop-blur-md">
        © {new Date().getFullYear()} ToyBlix — Designed for joyful play ✨
      </div>

    </footer>
  );
};

export default Footer;