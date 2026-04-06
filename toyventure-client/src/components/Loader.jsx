import React from 'react';

const Loader = ({ fullScreen = true, text = "Loading" }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-8 animate-[fadeIn_0.5s_ease-in-out]">
      
      {/* 🔮 Premium Geometric Animation */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        
        {/* Soft background glow */}
        <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-xl animate-pulse"></div>

        {/* Outer Ring - Slow clockwise spin */}
        <div className="absolute w-full h-full rounded-full border-[1px] border-zinc-200 border-t-zinc-800 animate-[spin_3s_linear_infinite]"></div>

        {/* Middle Ring - Medium counter-clockwise spin */}
        <div className="absolute w-14 h-14 rounded-full border-[1.5px] border-transparent border-b-primary-container border-l-primary-container animate-[spin_2s_ease-in-out_infinite_reverse]"></div>

        {/* Inner Core - Diamond shape with a breathing pulse */}
        <div className="relative w-6 h-6 bg-zinc-800 rotate-45 shadow-[0_0_15px_rgba(0,0,0,0.2)] rounded-sm animate-pulse duration-1000">
          {/* Inner reflection detail */}
          <div className="absolute inset-[2px] border border-white/20 rounded-sm"></div>
        </div>

      </div>

      {/* 🏷️ Elegant Typography */}
      <div className="flex flex-col items-center space-y-2">
        <span className="text-zinc-800 font-bold uppercase tracking-[0.4em] text-xs">
          {text}
        </span>
        
        {/* Elegant fading dots */}
        <div className="flex space-x-1.5">
          <div className="w-1 h-1 rounded-full bg-zinc-400 animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-1 h-1 rounded-full bg-zinc-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-1 rounded-full bg-zinc-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

    </div>
  );

  // If fullScreen is true, wrap it in a luxurious frosted glass overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-surface/70 backdrop-blur-md flex items-center justify-center transition-all duration-500">
        {content}
      </div>
    );
  }

  // Otherwise, render inline (useful for inside buttons, cards, or specific sections)
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      {content}
    </div>
  );
};

export default Loader;