import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="bg-red-950 pt-28 pb-48 relative overflow-hidden mt-20">

      {/* ================= PREMIUM BACKGROUND ================= */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-red-900/90 to-red-800/40 z-0"></div>

      {/* Soft Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-900/30 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* ================= TOP WAVE ================= */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 transform -translate-y-full z-20">
        <svg
          className="relative block w-full h-[80px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-red-950"
          />
        </svg>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 px-6 md:px-12 py-12 w-full max-w-[1440px] mx-auto relative z-20 pb-20">

        {/* BRAND */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-6 bg-red-900/40 p-3 rounded-2xl backdrop-blur-sm border border-red-800/50 shadow-xl">
            <Logo className="w-8 h-8 text-white" />
            <div className="text-2xl font-black text-white">ToyBlix</div>
          </div>

          <p className="text-sm text-red-200/80 mb-6 max-w-sm">
            Making every childhood moment magical through playful and creative toys.
          </p>
        </div>

        {/* LINKS */}
        <div className="md:col-span-2">
          <h4 className="text-white font-bold mb-4">Explore</h4>
          <ul className="space-y-3 text-red-200/70 text-sm">
            <li><Link to="/shop">Toys</Link></li>
            <li><Link to="/shop">Educational</Link></li>
            <li><Link to="/shop">Creative</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-white font-bold mb-4">Support</h4>
          <ul className="space-y-3 text-red-200/70 text-sm">
            <li><Link to="/shipping">Shipping</Link></li>
            <li><Link to="/returns">Returns</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-white font-bold mb-4">Legal</h4>
          <ul className="space-y-3 text-red-200/70 text-sm">
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>

      {/* ================= PREMIUM SVG SCENE ================= */}
      <div className="absolute bottom-0 left-0 w-full h-[340px] z-10 overflow-hidden">
        <svg viewBox="0 0 1440 400" className="w-full h-full">

          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fca5a5" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>

            <radialGradient id="sunGlow">
              <stop offset="0%" stopColor="#fde68a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* SKY */}
          <rect width="1440" height="400" fill="url(#sky)" />

          {/* SUN */}
          <circle cx="720" cy={120 + offset * 0.05} r="100" fill="url(#sunGlow)" />

          {/* BACK HILL */}
          <path
            d="M0,220 C300,180 600,260 900,200 C1200,140 1440,220 1440,220 L1440,400 L0,400 Z"
            fill="#166534"
            style={{ transform: `translateY(${offset * 0.05}px)` }}
          />

          {/* FRONT HILL */}
          <path
            d="M0,280 C300,240 600,300 900,260 C1200,220 1440,300 1440,300 L1440,400 L0,400 Z"
            fill="#22c55e"
            style={{ transform: `translateY(${offset * 0.1}px)` }}
          />

          {/* KIDS */}
          <g transform={`translate(300, ${260 - offset * 0.1})`}>
            <circle r="20" fill="#fde68a" />
            <rect y="20" width="30" height="40" rx="10" fill="#f97316" />
          </g>

          <g transform={`translate(720, ${240 - offset * 0.15})`}>
            <circle r="22" fill="#fca5a5" />
            <rect y="20" width="35" height="50" rx="10" fill="#a78bfa" />
          </g>

          <g transform={`translate(1100, ${260 - offset * 0.1})`}>
            <circle r="20" fill="#fde68a" />
            <rect y="20" width="30" height="40" rx="10" fill="#3b82f6" />
          </g>

          {/* FLOATING ELEMENTS */}
          <circle cx="500" cy={200 - offset * 0.2} r="8" fill="#facc15" />
          <circle cx="950" cy={180 - offset * 0.25} r="6" fill="#38bdf8" />

        </svg>
      </div>

      {/* ================= COPYRIGHT ================= */}
      <div className="absolute bottom-0 w-full bg-red-950/80 backdrop-blur-md border-t border-white/10 py-4 text-center text-white/60 text-xs z-30">
        © {new Date().getFullYear()} ToyBlix. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;