import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-red-950 pt-28 pb-48 relative overflow-hidden mt-20">
      
      {/* ================= TOP WAVE DIVIDER ================= */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 transform -translate-y-full z-20">
        <svg
          className="relative block w-full h-[60px] md:h-[100px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-red-950"
          ></path>
        </svg>
      </div>

      {/* Background Ambient Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-900/30 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* ================= FOOTER CONTENT GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 px-6 md:px-12 py-12 w-full max-w-[1440px] mx-auto relative z-20 pb-20">
        
        {/* Brand */}
        <div className="md:col-span-5 flex flex-col items-start pr-0 md:pr-12">
          <div className="flex items-center gap-3 mb-6 bg-red-900/40 p-3 rounded-2xl backdrop-blur-sm border border-red-800/50 shadow-xl">
            <Logo className="w-8 h-8 text-white drop-shadow-md" />
            <div className="text-2xl font-black text-white tracking-tight">ToyBlix</div>
          </div>
          
          <p className="text-sm font-medium text-red-200/80 mb-8 leading-relaxed max-w-sm">
            Making every childhood moment an adventure through wonderfully crafted, minimalist physical play. Designed to last, built to inspire.
          </p>

          <div className="flex gap-4">
            <a className="w-12 h-12 bg-red-900/50 border border-red-800 rounded-full flex items-center justify-center text-red-200 hover:bg-white hover:text-red-950 hover:border-white hover:scale-110 shadow-lg transition-all duration-300" href="#">
              <span className="material-symbols-outlined text-[20px]">share</span>
            </a>
            <a className="w-12 h-12 bg-red-900/50 border border-red-800 rounded-full flex items-center justify-center text-red-200 hover:bg-white hover:text-red-950 hover:border-white hover:scale-110 shadow-lg transition-all duration-300" href="#">
              <span className="material-symbols-outlined text-[20px]">public</span>
            </a>
          </div>
        </div>

        {/* Explore */}
        <div className="md:col-span-2">
          <h4 className="font-bold text-white mb-6 text-sm tracking-widest uppercase opacity-90">Explore</h4>
          <ul className="space-y-4 font-medium text-red-200/70 text-sm">
            {['Action Figures', 'Building Blocks', 'Early Learning', 'Arts & Crafts'].map((item) => (
              <li key={item} className="group flex items-center">
                <span className="w-0 h-[2px] bg-red-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2 opacity-0 group-hover:opacity-100"></span>
                <Link className="group-hover:text-white transition-colors" to="/shop">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="md:col-span-2">
          <h4 className="font-bold text-white mb-6 text-sm tracking-widest uppercase opacity-90">Support</h4>
          <ul className="space-y-4 font-medium text-red-200/70 text-sm">
            {[
              { name: 'Safety Standards', path: '/safety-standards' },
              { name: 'Shipping Info', path: '/shipping' },
              { name: 'Returns', path: '/returns' }
            ].map((item) => (
              <li key={item.name} className="group flex items-center">
                <span className="w-0 h-[2px] bg-red-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2 opacity-0 group-hover:opacity-100"></span>
                <Link className="group-hover:text-white transition-colors" to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="md:col-span-3">
          <h4 className="font-bold text-white mb-6 text-sm tracking-widest uppercase opacity-90">Legal</h4>
          <ul className="space-y-4 font-medium text-red-200/70 text-sm">
            {[
              { name: 'Privacy Policy', path: '/privacy-policy' },
              { name: 'Terms of Service', path: '/terms' }
            ].map((item) => (
              <li key={item.name} className="group flex items-center">
                <span className="w-0 h-[2px] bg-red-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2 opacity-0 group-hover:opacity-100"></span>
                <Link className="group-hover:text-white transition-colors" to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ================= LAYERED ILLUSTRATION SCENE ================= */}
      <div className="absolute bottom-0 left-0 w-full h-[320px] pointer-events-none z-10 flex items-end">
        
        {/* Layer 1: Back Hill (Darker Green) */}
        <div className="absolute bottom-0 w-full">
           <svg viewBox="0 0 1440 320" className="w-full h-auto drop-shadow-2xl opacity-80" preserveAspectRatio="none">
             <path fill="#22c55e" fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,229.3C960,245,1056,235,1152,213.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
           </svg>
        </div>

        {/* Layer 2: Front Hill (Lighter Green) */}
        <div className="absolute bottom-0 w-full">
           <svg viewBox="0 0 1440 320" className="w-full h-[180px] drop-shadow-xl" preserveAspectRatio="none">
             <path fill="#4ade80" fillOpacity="1" d="M0,256L60,245.3C120,235,240,213,360,218.7C480,224,600,256,720,250.7C840,245,960,203,1080,197.3C1200,192,1320,224,1380,240L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
           </svg>
        </div>

        {/* Characters & Toys */}
        <div className="w-full max-w-[1440px] mx-auto relative h-full">
          
          {/* Spotlight Behind Center Kids */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-80 h-40 bg-yellow-300/40 blur-[60px] rounded-full"></div>

          {/* LEFT - Puzzle (Floating) */}
          <img
            src="/assets/Puzzle-amico.svg"
            alt="puzzle"
            className="absolute bottom-10 left-4 md:left-24 w-32 md:w-48 opacity-95 animate-[bounce_4s_ease-in-out_infinite] drop-shadow-xl"
          />

          {/* CENTER - Kids (Main Hero - Anchored) */}
          <img
            src="/assets/Kids playing with dolls-amico.svg"
            alt="kids"
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-56 md:w-80 drop-shadow-2xl z-10"
          />

          {/* RIGHT - Baby (Floating) */}
          <img
            src="/assets/Happy baby-rafiki.svg"
            alt="baby"
            className="absolute bottom-12 right-4 md:right-24 w-32 md:w-48 opacity-95 animate-[bounce_5s_ease-in-out_infinite] drop-shadow-xl delay-300"
          />

          {/* Floating Playful Particles */}
          <div className="absolute left-1/3 bottom-40 w-4 h-4 bg-yellow-400 rounded-full opacity-80 animate-ping shadow-[0_0_15px_rgba(250,204,21,0.8)]"></div>
          <div className="absolute right-1/3 bottom-32 w-3 h-3 bg-blue-400 rounded-full opacity-80 animate-pulse delay-200 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
          <div className="absolute right-1/4 bottom-48 w-5 h-5 bg-purple-400 rounded-sm rotate-45 opacity-60 animate-bounce delay-500"></div>
        </div>

      </div>

      {/* ================= COPYRIGHT BAR ================= */}
      <div className="absolute bottom-0 w-full bg-red-950/80 backdrop-blur-md border-t border-white/10 py-6 px-6 md:px-12 z-30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 max-w-[1440px] mx-auto">
          <p className="text-white/60 font-medium text-xs tracking-wide">
            © {new Date().getFullYear()} ToyBlix. All rights reserved.
          </p>
          <p className="text-white/80 font-bold text-xs flex items-center gap-2">
            Spark wonder in every play <span className="text-yellow-400 text-lg leading-none">✨</span>
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;