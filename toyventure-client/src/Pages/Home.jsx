import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';

// ==========================================
// 1. UTILITY: HARDWARE ACCELERATED MAGNETIC BUTTON
// ==========================================
const MagneticButton = ({ children, className, variant = 'dark' }) => {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    x.set((clientX - (left + width / 2)) * 0.3);
    y.set((clientY - (top + height / 2)) * 0.3);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const baseStyles = "relative overflow-hidden group px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-shadow";
  const variants = {
    dark: "bg-slate-900 text-white shadow-lg hover:shadow-xl",
    light: "bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-md",
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={`${baseStyles} ${variants[variant]} ${className} will-change-transform`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === 'dark' && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-amber-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0"></div>
      )}
    </motion.button>
  );
};

// ==========================================
// MAIN PAGE
// ==========================================
const Home = () => {
  const containerRef = useRef(null);

  // Smooth Scrolling setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Parallax Setup
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Data Arrays
  const products = [
    { title: "Eco-Wooden Rail", price: "₹899", tag: "Eco Friendly", img: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3", color: "bg-orange-50" },
    { title: "Diecast Metal Truck", price: "₹599", tag: "Collectible", img: "https://images.unsplash.com/photo-1594787317666-41793740284e?ixlib=rb-4.0.3", color: "bg-blue-50" },
    { title: "STEM Building Set", price: "₹1,199", tag: "Best Seller", img: "https://images.unsplash.com/photo-1555448248-2571daf6344b?ixlib=rb-4.0.3", color: "bg-emerald-50" },
    { title: "Artisan Craft Kit", price: "₹699", tag: "New", img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?ixlib=rb-4.0.3", color: "bg-purple-50" }
  ];

  const features = [
    { title: "Sustainably Sourced", text: "FSC-certified woods and recycled materials.", icon: "nature" },
    { title: "Non-Toxic Paints", text: "Water-based colors safe for all ages.", icon: "palette" },
    { title: "Heirloom Quality", text: "Built sturdy to pass down generations.", icon: "diamond" },
  ];

  const categories = [
    { name: "Imaginative Play", desc: "Let their stories unfold", size: "md:col-span-2 md:row-span-2 h-[400px] md:h-[500px]", img: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop" },
    { name: "Building & STEM", desc: "Engineer the future", size: "md:col-span-1 md:row-span-1 h-[240px]", img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop" },
    { name: "Creative Arts", desc: "Unleash inner artists", size: "md:col-span-1 md:row-span-1 h-[240px]", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop" },
  ];

  const reviews = [
    { text: "The wooden blocks are incredible. My daughter plays with them for hours, and they look beautiful in the living room.", author: "Sarah Jenkins" },
    { text: "Finally, toys that don't break after a week. You can feel the quality the moment you unbox them.", author: "Mark D." },
    { text: "Love the eco-friendly mission. It feels good to buy toys that are safe for my kids and the planet.", author: "Elena R." },
    { text: "The perfect gifts! The packaging is gorgeous, and the toys are durable enough to withstand my two wild toddlers.", author: "James T." },
  ];

  const infiniteReviews = [...reviews, ...reviews, ...reviews, ...reviews];

  return (
    <main ref={containerRef} className="bg-[#fafafa] text-slate-900 min-h-screen font-sans overflow-x-hidden selection:bg-orange-200">
      
      {/* Optimized Background Gradients */}
      <div className="fixed top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full pointer-events-none opacity-40 z-0" style={{ background: 'radial-gradient(circle, rgba(253,186,116,0.5) 0%, rgba(253,186,116,0) 70%)' }}></div>
      <div className="fixed bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full pointer-events-none opacity-30 z-0" style={{ background: 'radial-gradient(circle, rgba(191,219,254,0.6) 0%, rgba(191,219,254,0) 70%)' }}></div>

      {/* ================= HERO SECTION ================= */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-[90vh] flex items-center justify-center px-6 z-10 pt-28 pb-16 max-w-[1440px] mx-auto pointer-events-auto will-change-transform"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          
          <motion.div
            initial="hidden" animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
            }}
            className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left z-20"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="mb-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest shadow-sm">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span></span>
              Discover the New Collection
            </motion.div>

            <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[1.05] mb-6">
              Unleash the Power of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Meaningful Play.</span>
            </motion.h1>

            <motion.p variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-lg text-slate-500 font-medium max-w-lg mb-10 leading-relaxed">
              Step into a world of thoughtfully crafted, sustainable toys designed to nurture creativity, spark joy, and build memories that last a lifetime.
            </motion.p>

            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/shop" className="w-full sm:w-auto">
                <MagneticButton variant="dark" className="w-full justify-center">Shop Collection <span className="material-symbols-outlined text-sm">arrow_forward</span></MagneticButton>
              </Link>
              <MagneticButton variant="light" className="w-full sm:w-auto justify-center">Our Philosophy</MagneticButton>
            </motion.div>
          </motion.div>

          <div className="lg:col-span-7 relative h-[500px] lg:h-[650px] w-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute z-10 w-[280px] sm:w-[320px] bg-white p-4 rounded-[2rem] shadow-xl border border-slate-100 group hover:rotate-0 hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="bg-orange-50 rounded-2xl h-[280px] p-6 mb-4 flex items-center justify-center relative overflow-hidden">
                <img loading="eager" src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3" alt="Wooden Toy" className="w-full h-full object-contain mix-blend-multiply" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase shadow-sm">Eco-Friendly</div>
              </div>
              <div className="px-2 pb-2">
                <h3 className="font-bold text-lg text-slate-900">Wooden Rail Express</h3>
                <p className="text-orange-500 font-black text-xl mt-1">₹899</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, y: 50, rotate: 6 }}
              animate={{ opacity: 1, x: 120, y: -80, rotate: 6 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden sm:block absolute z-0 w-[220px] bg-white p-3 rounded-[1.5rem] shadow-lg border border-slate-100 group hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-300 cursor-pointer"
            >
              <div className="bg-blue-50 rounded-xl h-[180px] p-4 flex items-center justify-center overflow-hidden">
                <img loading="eager" src="https://images.unsplash.com/photo-1594787317666-41793740284e?ixlib=rb-4.0.3" alt="Toy Car" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, x: -140, y: 120 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute z-20 bg-slate-900 text-white p-5 rounded-[2rem] shadow-xl border border-slate-700 flex items-center gap-4 hover:scale-110 hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>kid_star</span>
              </div>
              <div>
                <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">Top Rated</p>
                <p className="text-lg font-black">4.9 / 5.0</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ================= FEATURES STRIP ================= */}
      <section className="py-12 border-y border-slate-200/60 bg-white relative z-20">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {features.map((feat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col md:flex-row items-center md:items-start gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">{feat.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{feat.title}</h3>
                <p className="text-slate-500 text-sm font-medium">{feat.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= BENTO CATEGORIES ================= */}
      <section className="py-24 px-6 max-w-[1440px] mx-auto relative z-20">
        <div className="mb-12">
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900">Universes of Play.</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`group relative rounded-[2rem] overflow-hidden bg-slate-100 cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 ${cat.size}`}
            >
              <img loading="lazy" src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-white/95 backdrop-blur-sm p-5 md:p-6 rounded-2xl flex justify-between items-center shadow-lg border border-slate-100 group-hover:-translate-y-1 transition-transform duration-300">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900">{cat.name}</h3>
                  <p className="text-slate-500 font-medium text-xs md:text-sm mt-1">{cat.desc}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shrink-0">
                  <span className="material-symbols-outlined -rotate-45">arrow_forward</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= EDITORIAL PARALLAX ================= */}
      <section className="py-20 px-6 max-w-[1440px] mx-auto relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="relative h-[80vh] rounded-[3rem] overflow-hidden bg-slate-900"
        >
          <motion.div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3')] bg-cover bg-center opacity-80"
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          ></motion.div>
          
          <div className="absolute inset-0 p-8 md:p-24 flex flex-col justify-end">
            <div className="bg-white/95 p-8 md:p-16 rounded-[2.5rem] max-w-2xl shadow-xl border border-white/50">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight text-slate-900">
                The Art of <br/><span className="text-orange-500">Unplugged</span> Joy.
              </h2>
              <p className="text-lg text-slate-600 font-medium mb-8 leading-relaxed">
                In a world of screens, we champion the physical. Toys that demand touch, inspire storytelling, and withstand the test of time.
              </p>
              <MagneticButton variant="dark" className="w-max">Read Our Manifesto</MagneticButton>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= PRODUCT SHOWCASE ================= */}
      <section className="py-24 px-6 max-w-[1440px] mx-auto relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900">
            Fresh off the <br/><span className="text-slate-400">Workbench.</span>
          </h2>
          
          {/* Shop Redirect Button */}
          <Link to="/shop" className="text-slate-900 font-bold uppercase tracking-widest text-sm border-b-2 border-slate-900 pb-1 hover:text-orange-500 hover:border-orange-500 transition-colors">
            View All Toys
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className={`relative h-72 p-8 flex items-center justify-center ${product.color}`}>
                <img loading="lazy" src={product.img} alt={product.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500 ease-out" />
                <div className="absolute top-4 left-4 bg-white/90 text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                  {product.tag}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold leading-tight mb-2 text-slate-900">{product.title}</h3>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-2xl font-black text-slate-900">{product.price}</span>
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-sm">add</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= INFINITE MARQUEE TESTIMONIALS (Left to Right) ================= */}
      <section className="py-20 relative z-20 overflow-hidden bg-[#fafafa]">
        <h2 className="text-4xl font-black tracking-tighter text-center mb-12 text-slate-900 px-6">Loved by Families</h2>
        
        <div className="relative w-full flex items-center">
          <div className="absolute left-0 top-0 w-16 md:w-48 h-full bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-16 md:w-48 h-full bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none"></div>

          <motion.div
            className="flex gap-6 w-max px-6"
            // Starts off-screen to the left (-50%) and smoothly moves to 0% (Left to Right)
            animate={{ x: ["-50%", "0%"] }} 
            transition={{ ease: "linear", duration: 35, repeat: Infinity }}
          >
            {infiniteReviews.map((review, idx) => (
              <div 
                key={idx} 
                className="w-[320px] md:w-[450px] shrink-0 bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex text-orange-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-lg text-slate-600 font-medium mb-8 leading-relaxed line-clamp-3">"{review.text}"</p>
                <p className="font-bold text-slate-900 tracking-wide">— {review.author}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="py-24 px-6 max-w-[1440px] mx-auto relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4 opacity-20 bg-gradient-to-br from-orange-400 to-transparent"></div>
          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white">Join the <br/><span className="text-orange-400">Playground.</span></h2>
            <p className="text-xl text-slate-400 font-medium max-w-xl mx-auto mb-10">
              Subscribe for early access to new drops, exclusive discounts, and thoughtful articles on child development.
            </p>
            
            {/* Border removed from the form wrapping the input */}
            <form className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto bg-white/10 p-2 rounded-full">
              <input 
                className="bg-transparent text-white px-8 py-4 outline-none border-none ring-0 w-full font-medium placeholder:text-slate-400 focus:ring-0 focus:outline-none" 
                placeholder="Enter your email address" 
                type="email" 
              />
              <button className="bg-white text-slate-900 px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-orange-500 hover:text-white transition-colors shadow-md shrink-0">
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>
      </section>

    </main>
  );
};

export default Home;