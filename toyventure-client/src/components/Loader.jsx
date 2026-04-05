import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    // Fixed full-screen overlay with the highest z-index
    <div className="fixed inset-0 z-[200] bg-surface flex flex-col items-center justify-center overflow-hidden">
      
      {/* Subtle doodle background to match the rest of your site */}
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none"></div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Floating & Rotating Toy Block */}
        <motion.div
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2.5, 
            ease: "easeInOut", 
            repeat: Infinity 
          }}
          className="w-24 h-24 bg-primary-container text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary-container/40 mb-2 relative"
        >
          {/* Inner glow/reflection line for a premium 3D feel */}
          <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full blur-sm"></div>
          <span className="material-symbols-outlined text-[48px]">toys</span>
        </motion.div>

        {/* Dynamic Shadow underneath the floating block */}
        <motion.div
          animate={{ 
            scale: [1, 0.6, 1],
            opacity: [0.6, 0.2, 0.6]
          }}
          transition={{ 
            duration: 2.5, 
            ease: "easeInOut", 
            repeat: Infinity 
          }}
          className="w-16 h-2 bg-zinc-300 rounded-[100%] blur-[2px] mb-8"
        ></motion.div>

        {/* Animated Loading Text */}
        <h2 className="text-2xl font-black text-zinc-800 tracking-tight flex items-center">
          Unboxing Magic
          <span className="flex w-6 ml-1">
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>.</motion.span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}>.</motion.span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}>.</motion.span>
          </span>
        </h2>
        <p className="text-zinc-500 font-bold mt-2 text-sm">Just a moment...</p>
      </motion.div>
    </div>
  );
};

export default Loader;