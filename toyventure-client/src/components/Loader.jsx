import React from 'react';

const Loader = ({ fullScreen = true, text = "Loading" }) => {
  // Smooth, modern animations for the ToyBlix brand
  const customStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.8; filter: drop-shadow(0 4px 6px rgba(249, 115, 22, 0.3)); }
      50% { opacity: 1; filter: drop-shadow(0 8px 15px rgba(249, 115, 22, 0.6)); }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
    .animate-spin-slow { animation: spin-slow 3s linear infinite; }
  `;

  const content = (
    <div className="flex flex-col items-center justify-center space-y-10 animate-[fadeIn_0.5s_ease-in-out]">
      <style>{customStyles}</style>

      {/* 🚀 ToyBlix Logo Display */}
      <div className="relative flex flex-col items-center justify-center animate-float mt-4">
        
        {/* Ambient Orange Background Glow */}
        <div className="absolute w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>

        {/* The Brand Name & Icon */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[42px] text-orange-500 animate-spin-slow">
            toys
          </span>
          <h1 className="text-5xl font-black tracking-tight text-orange-500 animate-pulse-glow">
            ToyBlix
          </h1>
        </div>
        
      </div>

      {/* 🏷️ Loading Text & Bouncing Dots */}
      <div className="flex flex-col items-center space-y-4">
        <span className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs">
          {text}
        </span>
        
        <div className="flex space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-300 animate-bounce shadow-sm" style={{ animationDelay: '0s' }}></div>
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-bounce shadow-sm" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-bounce shadow-sm" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>

    </div>
  );

  // Frosted Glass Overlay for full screen
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-500">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-12">
      {content}
    </div>
  );
};

export default Loader;