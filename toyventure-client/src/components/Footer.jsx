import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

// Ensure this path matches where you saved your background image
import footerBg from "../assets/footer-bg.png";

const Footer = () => {
  return (
    // Removed pb-12 here so the copyright bar sits flush at the bottom
    <footer className="relative pt-32 pb-0 overflow-hidden mt-auto w-full flex-shrink-0 border-t border-red-900/30">

      {/* ================= BACKGROUND IMAGE ================= */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${footerBg})` }}
      ></div>

      {/* Overlay: Changed from heavy red to a subtle neutral dark tint so the image shows clearly */}
      <div className="absolute inset-0 bg-black/30 z-[1] backdrop-blur-[1px]"></div>

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
      <div className="relative z-20 max-w-[1200px] mx-auto px-8 md:px-12">
        
        {/* NEWSLETTER SECTION */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-10 md:p-14 mb-24 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-red-500/20 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="max-w-lg relative z-10 text-center lg:text-left">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Stay Connected
            </h3>
            <p className="text-white/90 text-base leading-relaxed">
              Join our newsletter for the latest toy drops, exclusive offers, and playful updates directly to your inbox.
            </p>
          </div>
          
          <form className="flex w-full lg:w-auto bg-white/10 backdrop-blur-md rounded-full p-2 flex-grow max-w-md shadow-inner relative z-10 border border-white/10">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-transparent text-white placeholder:text-white/60 px-6 py-4 text-base outline-none"
            />
            <button className="bg-white text-zinc-900 font-bold px-8 py-4 rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-lg">
              Subscribe
            </button>
          </form>
        </div>

        {/* SPACIOUS LINKS GRID */}
        {/* Increased padding-bottom to pb-32 to create more space under the links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-12 gap-y-16 pb-32">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-4 mb-8 bg-black/20 p-4 rounded-2xl border border-white/5 shadow-xl backdrop-blur-sm inline-flex">
              <Logo className="w-10 h-10 text-white" />
              <span className="text-white font-black text-3xl tracking-tight">ToyBlix</span>
            </div>
            <p className="text-white/80 text-base max-w-sm text-center md:text-left leading-relaxed">
              Premium playful experiences crafted to inspire imagination, creativity, and boundless joy in every child.
            </p>
          </div>

          {/* Explore Column */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-black mb-8 uppercase text-sm tracking-widest opacity-100 drop-shadow-md">Explore</h4>
            <ul className="space-y-5 text-white/80 text-base font-medium">
              <li><Link to="/shop" className="hover:text-white hover:translate-x-1 inline-block transition-all">All Toys</Link></li>
              <li><Link to="/about" className="hover:text-white hover:translate-x-1 inline-block transition-all">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-all">Contact Us</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-black mb-8 uppercase text-sm tracking-widest opacity-100 drop-shadow-md">Support</h4>
            <ul className="space-y-5 text-white/80 text-base font-medium">
              <li><Link to="/shipping" className="hover:text-white hover:translate-x-1 inline-block transition-all">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-white hover:translate-x-1 inline-block transition-all">Easy Returns</Link></li>
              <li><Link to="/safety-standards" className="hover:text-white hover:translate-x-1 inline-block transition-all">Safety Standards</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-black mb-8 uppercase text-sm tracking-widest opacity-100 drop-shadow-md">Legal</h4>
            <ul className="space-y-5 text-white/80 text-base font-medium">
              <li><Link to="/privacy-policy" className="hover:text-white hover:translate-x-1 inline-block transition-all">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white hover:translate-x-1 inline-block transition-all">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-white hover:translate-x-1 inline-block transition-all">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* COPYRIGHT - Reduced size with py-4 and added bg-black/30 for clean separation */}
      <div className="relative z-30 w-full text-center text-white/70 text-sm py-4 border-t border-white/10 bg-black/30 backdrop-blur-md">
        <p>© {new Date().getFullYear()} ToyBlix. Designed for joyful play ✨</p>
      </div>

    </footer>
  );
};

export default Footer;