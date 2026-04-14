import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="relative bg-red-950 pt-16 pb-48 overflow-hidden mt-auto w-full group flex-shrink-0">

      {/* ================= PREMIUM BACKGROUND ================= */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-red-900 to-red-800/40 z-0"></div>

      {/* Soft Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-red-900/30 blur-[140px] rounded-full"></div>

      {/* ================= CONTENT WRAPPER ================= */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* ================= STAY CONNECTED (Moved from Home) ================= */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          {/* Subtle accent glow behind the newsletter box */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/20 blur-3xl rounded-full"></div>
          
          <div className="max-w-md relative z-10 text-center md:text-left">
            <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Stay Connected</h3>
            <p className="text-red-100/80 text-sm leading-relaxed">
              Join our newsletter for the latest toy drops, exclusive educational kits, and playful updates directly to your inbox.
            </p>
          </div>
          
          <form className="flex w-full md:w-auto bg-white/20 backdrop-blur-sm rounded-full p-1.5 flex-grow max-w-md shadow-inner relative z-10" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address..." 
              className="w-full bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-white placeholder:text-red-200 px-5 py-3 text-sm"
              required
            />
            <button 
              type="submit" 
              className="bg-white text-red-700 font-bold px-6 py-3 rounded-full hover:bg-red-50 transition-colors shadow-md shrink-0 text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* ================= FOOTER LINKS ================= */}
        <div className="grid md:grid-cols-12 gap-12 pb-12">
          <div className="md:col-span-5 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-6 bg-red-900/40 p-3 rounded-2xl backdrop-blur border border-red-800 shadow-xl w-max hover:scale-105 transition-transform duration-300">
              <Logo className="w-8 h-8 text-white" />
              <span className="text-white font-black text-2xl">ToyBlix</span>
            </div>
            <p className="text-red-200/80 text-sm max-w-sm leading-relaxed">
              Premium playful experiences crafted to inspire imagination and joy.
            </p>
          </div>

          <div className="md:col-span-2 text-center md:text-left">
            <h4 className="text-white font-bold mb-4 tracking-wide uppercase text-xs opacity-90">Explore</h4>
            <ul className="space-y-3 text-red-200/70 text-sm">
              <li className="hover:text-white hover:translate-x-1 transition-all"><Link to="/shop">Toys</Link></li>
              <li className="hover:text-white hover:translate-x-1 transition-all"><Link to="/shop">STEM</Link></li>
              <li className="hover:text-white hover:translate-x-1 transition-all"><Link to="/shop">Creative</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 text-center md:text-left">
            <h4 className="text-white font-bold mb-4 tracking-wide uppercase text-xs opacity-90">Support</h4>
            <ul className="space-y-3 text-red-200/70 text-sm">
              <li className="hover:text-white hover:translate-x-1 transition-all"><Link to="/shipping">Shipping</Link></li>
              <li className="hover:text-white hover:translate-x-1 transition-all"><Link to="/returns">Returns</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 text-center md:text-left">
            <h4 className="text-white font-bold mb-4 tracking-wide uppercase text-xs opacity-90">Legal</h4>
            <ul className="space-y-3 text-red-200/70 text-sm">
              <li className="hover:text-white hover:translate-x-1 transition-all"><Link to="/privacy">Privacy</Link></li>
              <li className="hover:text-white hover:translate-x-1 transition-all"><Link to="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================= CLEAN SVG SCENE ================= */}
      <div className="absolute bottom-0 w-full h-[280px] z-10 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="w-full h-full">

          {/* BACK HILL */}
          <path
            d="M0,260 C300,200 600,300 900,240 C1200,180 1440,260 1440,260 L1440,400 L0,400 Z"
            fill="#14532d"
            style={{ transform: `translateY(${offset * 0.05}px)` }}
          />

          {/* FRONT HILL */}
          <path
            d="M0,300 C300,260 600,320 900,280 C1200,240 1440,320 1440,320 L1440,400 L0,400 Z"
            fill="#22c55e"
            style={{ transform: `translateY(${offset * 0.1}px)` }}
          />

          {/* LEFT KID */}
          <g transform={`translate(300, ${250 - offset * 0.12})`}>
            <circle cy="-40" r="22" fill="#fde68a"/>
            <rect x="-20" y="-10" width="40" height="60" rx="14" fill="#f97316"/>
            <circle cx="-8" cy="-45" r="3" fill="#000"/>
            <circle cx="8" cy="-45" r="3" fill="#000"/>
            <path d="M-8 -35 Q0 -30 8 -35" stroke="#000" strokeWidth="2"/>
          </g>

          {/* CENTER KID */}
          <g transform={`translate(720, ${230 - offset * 0.18})`}>
            <circle cy="-50" r="24" fill="#fca5a5"/>
            <rect x="-22" y="-10" width="44" height="70" rx="16" fill="#a78bfa"/>
            <circle cx="-8" cy="-55" r="3" fill="#000"/>
            <circle cx="8" cy="-55" r="3" fill="#000"/>
            <path d="M-10 -45 Q0 -38 10 -45" stroke="#000" strokeWidth="2"/>
          </g>

          {/* RIGHT KID */}
          <g transform={`translate(1100, ${250 - offset * 0.12})`}>
            <circle cy="-40" r="22" fill="#fde68a"/>
            <rect x="-20" y="-10" width="40" height="60" rx="14" fill="#3b82f6"/>
            <circle cx="-8" cy="-45" r="3" fill="#000"/>
            <circle cx="8" cy="-45" r="3" fill="#000"/>
            <path d="M-8 -35 Q0 -30 8 -35" stroke="#000" strokeWidth="2"/>
          </g>

        </svg>
      </div>

      {/* ================= COPYRIGHT ================= */}
      <div className="absolute bottom-0 w-full text-center text-white/70 text-xs py-4 border-t border-white/10 backdrop-blur-md z-30 font-medium">
        © {new Date().getFullYear()} ToyBlix — Designed for joyful play ✨
      </div>

    </footer>
  );
};

export default Footer;