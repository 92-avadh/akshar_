import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1000px] mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-zinc-800 mb-6 tracking-tight">
            The Story Behind <span className="text-primary-container italic">Akshar Toys</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 font-medium max-w-2xl mx-auto">
            We believe that every child deserves a world filled with imagination, creativity, and joy. We don't just sell toys; we deliver memories.
          </p>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="card-surface p-10 rounded-[3rem] shadow-soft border border-white hover:-translate-y-2 transition-transform">
            <span className="material-symbols-outlined text-[48px] text-primary-container mb-6 block">visibility</span>
            <h3 className="text-2xl font-black text-zinc-800 mb-4">Our Vision</h3>
            <p className="text-zinc-600 font-medium leading-relaxed">
              To become the most trusted destination for parents and children alike, offering educational, safe, and wildly fun toys that help children discover their true potential while having the time of their lives.
            </p>
          </div>

          <div className="card-surface p-10 rounded-[3rem] shadow-soft border border-white hover:-translate-y-2 transition-transform">
            <span className="material-symbols-outlined text-[48px] text-purple-500 mb-6 block">favorite</span>
            <h3 className="text-2xl font-black text-zinc-800 mb-4">Our Promise</h3>
            <p className="text-zinc-600 font-medium leading-relaxed">
              Every toy in our catalog is handpicked for quality, safety, and engagement. If a toy doesn't inspire a smile or a moment of wonder, it simply doesn't belong in the Akshar Toys Creation family.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-zinc-900 text-white p-12 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
          <h2 className="text-3xl font-black mb-4 relative z-10">Ready to explore the magic?</h2>
          <p className="text-zinc-400 font-medium mb-8 max-w-lg mx-auto relative z-10">Browse our carefully curated collection of toys and find the perfect gift today.</p>
          <Link to="/shop" className="inline-block bg-primary-container text-white font-black px-10 py-4 rounded-full hover:bg-orange-600 hover:shadow-lg hover:-translate-y-1 transition-all relative z-10">
            Start Shopping Now
          </Link>
        </div>

      </div>
    </main>
  );
};

export default About;