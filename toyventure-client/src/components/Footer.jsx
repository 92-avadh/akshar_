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
    <footer className="relative bg-red-950 pt-28 pb-52 overflow-hidden mt-20 group">

      {/* ================= PREMIUM BACKGROUND ================= */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-red-900/90 to-red-800/50 z-0"></div>

      {/* Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-red-900/30 blur-[140px] rounded-full"></div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-20 grid md:grid-cols-12 gap-12 px-6 md:px-12 max-w-[1400px] mx-auto">

        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-6 bg-red-900/40 p-3 rounded-2xl backdrop-blur border border-red-800 shadow-xl hover:scale-105 transition">
            <Logo className="w-8 h-8 text-white" />
            <span className="text-white font-black text-2xl">ToyBlix</span>
          </div>

          <p className="text-red-200/80 text-sm max-w-sm leading-relaxed">
            Premium playful experiences crafted to inspire imagination and joy.
          </p>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-white font-bold mb-4">Explore</h4>
          <ul className="space-y-3 text-red-200/70 text-sm">
            <li className="hover:text-white hover:translate-x-1 transition"><Link to="/shop">Toys</Link></li>
            <li className="hover:text-white hover:translate-x-1 transition"><Link to="/shop">STEM</Link></li>
            <li className="hover:text-white hover:translate-x-1 transition"><Link to="/shop">Creative</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-white font-bold mb-4">Support</h4>
          <ul className="space-y-3 text-red-200/70 text-sm">
            <li className="hover:text-white hover:translate-x-1 transition"><Link to="/shipping">Shipping</Link></li>
            <li className="hover:text-white hover:translate-x-1 transition"><Link to="/returns">Returns</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-white font-bold mb-4">Legal</h4>
          <ul className="space-y-3 text-red-200/70 text-sm">
            <li className="hover:text-white hover:translate-x-1 transition"><Link to="/privacy">Privacy</Link></li>
            <li className="hover:text-white hover:translate-x-1 transition"><Link to="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>

      {/* ================= PREMIUM SVG SCENE ================= */}
      <div className="absolute bottom-0 w-full h-[360px] z-10">

        <svg viewBox="0 0 1440 400" className="w-full h-full">

          {/* SKY */}
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fecaca"/>
              <stop offset="100%" stopColor="#7f1d1d"/>
            </linearGradient>
          </defs>

          <rect width="1440" height="400" fill="url(#sky)" />

          {/* HILLS */}
          <path
            d="M0,260 C300,200 600,300 900,240 C1200,180 1440,260 1440,260 L1440,400 L0,400 Z"
            fill="#15803d"
            style={{ transform: `translateY(${offset * 0.05}px)` }}
          />

          <path
            d="M0,300 C300,260 600,320 900,280 C1200,240 1440,320 1440,320 L1440,400 L0,400 Z"
            fill="#22c55e"
            style={{ transform: `translateY(${offset * 0.1}px)` }}
          />

          {/* ================= CARTOON KIDS ================= */}

          {/* LEFT BOY */}
          <g transform={`translate(300, ${250 - offset * 0.12})`}>
            <circle cx="0" cy="-40" r="22" fill="#fde68a"/>
            <rect x="-20" y="-10" width="40" height="60" rx="14" fill="#f97316"/>
            <circle cx="-8" cy="-45" r="3" fill="#000"/>
            <circle cx="8" cy="-45" r="3" fill="#000"/>
            <path d="M-8 -35 Q0 -30 8 -35" stroke="#000" strokeWidth="2" fill="none"/>
          </g>

          {/* CENTER GIRL */}
          <g transform={`translate(720, ${230 - offset * 0.18})`}>
            <circle cx="0" cy="-50" r="24" fill="#fca5a5"/>
            <rect x="-22" y="-10" width="44" height="70" rx="16" fill="#a78bfa"/>
            <circle cx="-8" cy="-55" r="3" fill="#000"/>
            <circle cx="8" cy="-55" r="3" fill="#000"/>
            <path d="M-10 -45 Q0 -38 10 -45" stroke="#000" strokeWidth="2" fill="none"/>
          </g>

          {/* RIGHT BOY */}
          <g transform={`translate(1100, ${250 - offset * 0.12})`}>
            <circle cx="0" cy="-40" r="22" fill="#fde68a"/>
            <rect x="-20" y="-10" width="40" height="60" rx="14" fill="#3b82f6"/>
            <circle cx="-8" cy="-45" r="3" fill="#000"/>
            <circle cx="8" cy="-45" r="3" fill="#000"/>
            <path d="M-8 -35 Q0 -30 8 -35" stroke="#000" strokeWidth="2" fill="none"/>
          </g>

          {/* ================= FLOATING TOYS ================= */}

          {/* Floating Cube */}
          <rect
            x="500"
            y={180 - offset * 0.25}
            width="20"
            height="20"
            rx="4"
            fill="#facc15"
          >
            <animate attributeName="y" values="180;160;180" dur="4s" repeatCount="indefinite"/>
          </rect>

          {/* Ball */}
          <circle
            cx="950"
            cy={170 - offset * 0.3}
            r="10"
            fill="#38bdf8"
          >
            <animate attributeName="cy" values="170;150;170" dur="3s" repeatCount="indefinite"/>
          </circle>

        </svg>
      </div>

      {/* ================= COPYRIGHT ================= */}
      <div className="absolute bottom-0 w-full text-center text-white/60 text-xs py-4 border-t border-white/10 backdrop-blur z-30">
        © {new Date().getFullYear()} ToyBlix — Designed for joyful play ✨
      </div>

    </footer>
  );
};

export default Footer;