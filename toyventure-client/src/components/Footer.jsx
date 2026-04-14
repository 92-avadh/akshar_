import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import toast from "react-hot-toast";
// Import the correct contact mutation from apiSlice
import { useSubmitContactMessageMutation } from '../features/api/apiSlice';

const Footer = () => {
  const [offset, setOffset] = React.useState(0);
  const [email, setEmail] = useState("");
  
  // Hooking up the correct mutation your contact page uses
  const [submitMessage, { isLoading }] = useSubmitContactMessageMutation();

  React.useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      // Send the subscription as a contact message so the Admin sees it in the bell icon!
      await submitMessage({
        name: "Newsletter Subscriber",
        email: email,
        message: `Please add ${email} to the newsletter mailing list.`,
      }).unwrap();
      
      toast.success("Successfully subscribed! 🎉", {
        style: { borderRadius: '16px', background: '#333', color: '#fff' }
      });
      setEmail(""); // Clear the input
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
      console.error(error);
    }
  };

  return (
    <footer className="relative bg-red-950 pt-16 pb-48 overflow-hidden mt-auto w-full flex-shrink-0 group">

      {/* ================= PREMIUM BACKGROUND ================= */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-red-900 to-red-800/40 z-0"></div>

      {/* Soft Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-red-900/30 blur-[140px] rounded-full pointer-events-none"></div>

      {/* ================= CONTENT WRAPPER ================= */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* ================= STAY CONNECTED ================= */}
        <div className="w-full max-w-[900px] bg-gradient-to-br from-red-600 via-red-800 to-red-950 rounded-[3rem] p-12 md:p-20 flex flex-col items-center justify-center gap-10 text-center mx-auto relative overflow-hidden shadow-2xl shadow-red-900/20 mb-20 border border-white/5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-500 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
          <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_center,_white_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none"></div>
          
          <div className="flex flex-col items-center relative z-10">
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Stay Connected</h3>
            <p className="text-red-100 font-medium mt-4 max-w-md opacity-90">Get the latest minimalist toys & exclusive offers directly in your inbox.</p>
          </div>
          
          <form 
            onSubmit={handleSubscribe}
            className="flex w-full max-w-[500px] bg-white/10 backdrop-blur-md rounded-full p-2 items-center mx-auto relative z-10 transition-all focus-within:bg-white/15" 
          >
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address" 
              className="flex-1 bg-transparent px-6 py-3 border-none outline-none focus:ring-0 focus:outline-none text-white placeholder:text-red-200 font-medium"
              required
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-700 hover:bg-red-50 hover:scale-105 transition-all shrink-0 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="material-symbols-outlined text-[20px] font-bold animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
              )}
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
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="w-full h-full block">

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