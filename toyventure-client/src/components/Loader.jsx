import React from 'react';

const Loader = ({ fullScreen = true, text = "Unpacking Magic" }) => {
  // Bespoke CSS animations specifically designed for ToyBlix
  const customStyles = `
    @keyframes split-tl {
      0%, 100% { transform: translate(0, 0) rotate(0deg); border-radius: 2px; }
      25% { transform: translate(-20px, -20px) rotate(-90deg); border-radius: 50%; background-color: #fca5a5; }
      50% { transform: translate(0, -30px) rotate(-180deg); border-radius: 8px; }
      75% { transform: translate(20px, -20px) rotate(-270deg); border-radius: 50%; background-color: #ef4444; }
    }
    @keyframes split-tr {
      0%, 100% { transform: translate(0, 0) rotate(0deg); border-radius: 2px; }
      25% { transform: translate(20px, -20px) rotate(90deg); border-radius: 50%; background-color: #f87171; }
      50% { transform: translate(30px, 0) rotate(180deg); border-radius: 8px; }
      75% { transform: translate(20px, 20px) rotate(270deg); border-radius: 50%; background-color: #dc2626; }
    }
    @keyframes split-bl {
      0%, 100% { transform: translate(0, 0) rotate(0deg); border-radius: 2px; }
      25% { transform: translate(-20px, 20px) rotate(-90deg); border-radius: 50%; background-color: #dc2626; }
      50% { transform: translate(-30px, 0) rotate(-180deg); border-radius: 8px; }
      75% { transform: translate(-20px, -20px) rotate(-270deg); border-radius: 50%; background-color: #f87171; }
    }
    @keyframes split-br {
      0%, 100% { transform: translate(0, 0) rotate(0deg); border-radius: 2px; }
      25% { transform: translate(20px, 20px) rotate(90deg); border-radius: 50%; background-color: #ef4444; }
      50% { transform: translate(0, 30px) rotate(180deg); border-radius: 8px; }
      75% { transform: translate(-20px, 20px) rotate(270deg); border-radius: 50%; background-color: #fca5a5; }
    }
    @keyframes ping-sparkle {
      0%, 15%, 85%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
      40%, 60% { transform: scale(1.2) rotate(180deg); opacity: 1; }
      50% { transform: scale(1.8) rotate(225deg); opacity: 1; }
    }
    
    .magical-block-tl { animation: split-tl 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite; }
    .magical-block-tr { animation: split-tr 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite; }
    .magical-block-bl { animation: split-bl 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite; }
    .magical-block-br { animation: split-br 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite; }
    .sparkle-ping { animation: ping-sparkle 3s ease-in-out infinite; }
  `;

  const content = (
    <div className="flex flex-col items-center justify-center space-y-12 animate-[fadeIn_0.5s_ease-in-out]">
      <style>{customStyles}</style>

      {/* 🧊 Dancing Blocks Animation */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        
        {/* Soft pulsing background glow */}
        <div className="absolute w-24 h-24 bg-red-600/20 rounded-full blur-2xl animate-pulse"></div>

        {/* The 4 Interlocking Toy Blocks */}
        <div className="relative w-12 h-12 flex flex-wrap shadow-[0_0_20px_rgba(220,38,38,0.3)] rounded-sm z-20">
          <div className="w-6 h-6 bg-red-600 magical-block-tl shadow-sm border border-red-500/20"></div>
          <div className="w-6 h-6 bg-red-700 magical-block-tr shadow-sm border border-red-600/20"></div>
          <div className="w-6 h-6 bg-red-800 magical-block-bl shadow-sm border border-red-700/20"></div>
          <div className="w-6 h-6 bg-red-950 magical-block-br shadow-sm border border-red-800/20"></div>
        </div>

        {/* 🌟 Center Magic Sparkle (Appears when blocks detach) */}
        <div className="absolute inset-0 m-auto w-6 h-6 text-red-400 sparkle-ping z-10 flex items-center justify-center drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]">
          <span className="material-symbols-outlined text-[24px] filled">auto_awesome</span>
        </div>
      </div>

      {/* 🏷️ Typography & Bouncing Dots */}
      <div className="flex flex-col items-center space-y-3">
        <span className="text-red-950 font-black uppercase tracking-[0.3em] text-xs">
          {text === "Loading" ? "Unpacking Magic" : text}
        </span>
        
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-red-300 animate-bounce shadow-sm" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce shadow-sm" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 rounded-full bg-red-700 animate-bounce shadow-sm" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

    </div>
  );

  // Frosted Glass Overlay for full screen
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex items-center justify-center transition-all duration-500">
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