import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import toast from 'react-hot-toast';

// ==========================================
// UTILITY: HARDWARE ACCELERATED MAGNETIC BUTTON
// ==========================================
const MagneticButton = ({ children, className, variant = 'dark', onClick }) => {
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

  const reset = () => { x.set(0); y.set(0); };

  const baseStyles = "relative overflow-hidden group px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-shadow";
  const variants = {
    dark: "bg-slate-900 text-white shadow-lg hover:shadow-xl",
    light: "bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-md",
  };

  return (
    <motion.button onClick={onClick} ref={ref} onMouseMove={handleMouse} onMouseLeave={reset} style={{ x: springX, y: springY }} className={`${baseStyles} ${variants[variant]} ${className} will-change-transform transform-gpu`}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === 'dark' && <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-amber-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0"></div>}
    </motion.button>
  );
};

// ==========================================
// WAVY DIVIDER SVG COMPONENT
// ==========================================
const WavyDivider = ({ fill = "#ffffff", flip = false }) => (
  <div className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""} -mt-1`}>
    <svg className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C52.16,93.43,103.9,86.21,153,73.49,209.52,58.74,265.15,67.75,321.39,56.44Z" fill={fill}></path>
    </svg>
  </div>
);

// ==========================================
// MAIN PAGE
// ==========================================
const Home = () => {
  const containerRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    let rafId;
    function raf(time) { lenis.raf(time); rafId = requestAnimationFrame(raf); }
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const products = [
    { _id: '1', name: "Eco-Wooden Rail", title: "Eco-Wooden Rail", price: 899, originalPrice: 1199, tag: "Eco Friendly", img: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3", color: "bg-orange-50" },
    { _id: '2', name: "Diecast Metal Truck", title: "Diecast Metal Truck", price: 599, originalPrice: 699, tag: "Collectible", img: "https://images.unsplash.com/photo-1594787317666-41793740284e?ixlib=rb-4.0.3", color: "bg-blue-50" },
    { _id: '3', name: "STEM Building Set", title: "STEM Building Set", price: 1199, originalPrice: 1499, tag: "Best Seller", img: "https://images.unsplash.com/photo-1555448248-2571daf6344b?ixlib=rb-4.0.3", color: "bg-emerald-50" },
    { _id: '4', name: "Artisan Craft Kit", title: "Artisan Craft Kit", price: 699, originalPrice: 899, tag: "New", img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?ixlib=rb-4.0.3", color: "bg-purple-50" }
  ];

  const categories = [
    { name: "Imaginative Play", desc: "Let their stories unfold", size: "md:col-span-2 md:row-span-2 h-[400px] md:h-[500px]", img: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop" },
    { name: "Building & STEM", desc: "Engineer the future", size: "md:col-span-1 md:row-span-1 h-[240px]", img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop" },
    { name: "Creative Arts", desc: "Unleash inner artists", size: "md:col-span-1 md:row-span-1 h-[240px]", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop" },
  ];

  const shopByAgeData = [
    { age: "0-2 YRS", label: "Infants", color: "bg-red-100/80 text-rose-600 border-rose-200", radius: "40% 60% 70% 30% / 40% 50% 60% 50%" },
    { age: "3-4 YRS", label: "Toddlers", color: "bg-orange-100/80 text-orange-600 border-orange-200", radius: "50% 50% 30% 70% / 60% 30% 70% 40%" },
    { age: "5-7 YRS", label: "Preschool", color: "bg-teal-100/80 text-teal-600 border-teal-200", radius: "70% 30% 50% 50% / 30% 40% 60% 70%" },
    { age: "8+ YRS", label: "Grade School", color: "bg-blue-100/80 text-blue-600 border-blue-200", radius: "30% 70% 60% 40% / 50% 60% 40% 50%" },
  ];

  const reviews = [
    { text: "The wooden blocks are incredible. My daughter plays with them for hours, and they look beautiful in the living room.", author: "Sarah Jenkins" },
    { text: "Finally, toys that don't break after a week. You can feel the quality the moment you unbox them.", author: "Mark D." },
    { text: "Love the eco-friendly mission. It feels good to buy toys that are safe for my kids and the planet.", author: "Elena R." },
    { text: "The perfect gifts! The packaging is gorgeous, and the toys are durable enough to withstand my two wild toddlers.", author: "James T." },
  ];
  const infiniteReviews = [...reviews, ...reviews];

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success(`${product.name} added to bag!`, { icon: '🎒' });
  };

  return (
    <main ref={containerRef} className="bg-[#fff9f5] text-slate-900 min-h-screen font-sans overflow-x-hidden selection:bg-orange-200">
      
      {/* Background Gradients */}
      <div className="fixed top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full pointer-events-none opacity-40 z-0 will-change-transform transform-gpu" style={{ background: 'radial-gradient(circle, rgba(253,186,116,0.5) 0%, rgba(253,186,116,0) 70%)' }}></div>
      <div className="fixed bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full pointer-events-none opacity-30 z-0 will-change-transform transform-gpu" style={{ background: 'radial-gradient(circle, rgba(191,219,254,0.6) 0%, rgba(191,219,254,0) 70%)' }}></div>

      {/* ================= HERO SECTION ================= */}
      <motion.section style={{ y: heroY, opacity: heroOpacity }} className="relative min-h-[90vh] flex items-center justify-center px-6 z-10 pt-28 pb-16 max-w-[1440px] mx-auto pointer-events-auto will-change-transform transform-gpu">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }} className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left z-20">
            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="mb-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest shadow-sm">
              <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span></span>
              Fresh Arrivals
            </motion.div>
            <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[1.05] mb-6">
              Dive into the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Universe of Play.</span>
            </motion.h1>
            <motion.p variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-lg text-slate-500 font-medium max-w-lg mb-10 leading-relaxed">
              Step into a world of bubbly, sustainable, and wonderfully engaging toys designed to nurture creativity.
            </motion.p>
            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/shop" className="w-full sm:w-auto"><MagneticButton variant="dark" className="w-full justify-center">Start Exploring <span className="material-symbols-outlined text-sm">arrow_forward</span></MagneticButton></Link>
            </motion.div>
          </motion.div>
          <div className="lg:col-span-7 relative h-[500px] lg:h-[650px] w-full flex items-center justify-center">
            {/* Same Hero cards... */}
            <motion.div initial={{ opacity: 0, y: 50, rotate: -3 }} animate={{ opacity: 1, y: 0, rotate: -2 }} transition={{ duration: 0.8, delay: 0.2 }} className="absolute z-10 w-[280px] sm:w-[320px] bg-white p-4 rounded-[3rem] shadow-xl border border-slate-100 group hover:rotate-0 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
              <div className="bg-orange-50 rounded-[2.5rem] h-[280px] p-6 mb-4 flex items-center justify-center relative overflow-hidden">
                <img loading="eager" src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3" alt="Wooden Toy" className="w-full h-full object-contain mix-blend-multiply" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase shadow-sm">Eco-Friendly</div>
              </div>
              <div className="px-4 pb-2 text-center">
                <h3 className="font-bold text-lg text-slate-900">Wooden Rail Express</h3>
                <p className="text-orange-500 font-black text-xl mt-1">₹899</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ================= SHOP BY AGE ================= */}
      <WavyDivider fill="#ffffff" />
      <section className="bg-white py-16 relative z-20">
        <div className="max-w-[1440px] mx-auto px-6 text-center mb-12">
          <h2 className="text-slate-400 font-black uppercase tracking-widest text-sm mb-2">Find The Perfect Toy</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Shop by Age</h3>
          <p className="text-slate-500 mt-4 font-medium">Toys curated for every stage of childhood.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 px-6 max-w-[1440px] mx-auto">
          {shopByAgeData.map((item, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.05 }} className={`w-40 h-40 md:w-48 md:h-48 ${item.color} border-4 flex flex-col items-center justify-center p-6 shadow-sm cursor-pointer transition-transform`} style={{ borderRadius: item.radius }}>
               <h4 className="font-black text-2xl md:text-3xl tracking-tight">{item.age}</h4>
               <p className="font-bold uppercase tracking-widest text-xs mt-2 opacity-80">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <WavyDivider fill="#ffffff" flip={true} />

      {/* ================= EXPLORE POPULAR TOY SET ================= */}
      <section className="py-24 px-6 max-w-[1440px] mx-auto relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <h2 className="text-slate-500 font-black uppercase tracking-widest text-sm mb-2">Editor's Picks</h2>
            <h3 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900">Explore Popular Toy Set</h3>
          </div>
          <Link to="/shop" className="text-slate-900 font-bold uppercase tracking-widest text-sm border-b-2 border-slate-900 pb-1 hover:text-orange-500 hover:border-orange-500 transition-colors">See All Favorites</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }} className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 relative flex flex-col">
              {/* Product Image Section */}
              <div className={`relative h-64 p-8 flex items-center justify-center ${product.color} rounded-t-[3rem] opacity-90 group-hover:opacity-100 transition-opacity`}>
                <img loading="lazy" src={product.img} alt={product.title} className="w-full h-full object-contain group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 ease-out will-change-transform transform-gpu" />
                <div className="absolute top-4 left-4 bg-white/90 text-slate-900 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm border border-slate-200">
                  {product.tag}
                </div>
              </div>
              
              {/* Product Details */}
              <div className="p-8 pb-10 flex-1 flex flex-col justify-between bg-white z-10 relative">
                <h3 className="text-xl font-bold leading-tight mb-4 text-slate-900">{product.title}</h3>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-black text-slate-900">₹{product.price}</span>
                    <span className="text-sm font-medium text-slate-400 line-through">₹{product.originalPrice}</span>
                  </div>
                  <p className="text-teal-600 font-bold text-xs uppercase tracking-wider">Club Prices <span className="opacity-70">(-{Math.round((1 - product.price / product.originalPrice) * 100)}%)</span></p>
                </div>
              </div>

              {/* Hover Add To Bag Drawer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
                <button onClick={() => handleAddToCart(product)} className="w-full bg-slate-900 text-white rounded-[2rem] py-4 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-500 transition-colors shadow-lg">
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span> Add to Bag
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= MULTICOLOR WAVY DIVIDER ================= */}
      <WavyDivider fill="#f8fafc" />

      {/* ================= BENTO CATEGORIES ================= */}
      <section className="py-24 px-6 max-w-[1440px] mx-auto relative z-20 bg-slate-50 rounded-[4rem]">
        <div className="mb-12 text-center">
             <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900">Universes of Play.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }} className={`group relative rounded-[3rem] overflow-hidden bg-slate-100 cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 ${cat.size}`}>
              <img loading="lazy" src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform transform-gpu" />
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-white p-5 md:p-6 rounded-[2.5rem] flex justify-between items-center shadow-lg border border-slate-100 group-hover:-translate-y-2 transition-transform duration-300 will-change-transform">
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
      <section className="py-24 px-6 max-w-[1440px] mx-auto relative z-20 mt-12">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative h-[80vh] rounded-[4rem] overflow-hidden bg-slate-900 transform-gpu isolate border-4 border-white shadow-xl">
          <motion.div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3')] bg-cover bg-center opacity-80 will-change-transform transform-gpu" initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }}></motion.div>
          <div className="absolute inset-0 p-8 md:p-24 flex flex-col justify-end">
            <div className="bg-white/95 backdrop-blur-md p-8 md:p-14 rounded-[3rem] max-w-2xl shadow-xl border border-white/50">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight text-slate-900">
                The Art of <br /><span className="text-orange-500">Unplugged</span> Joy.
              </h2>
              <p className="text-lg text-slate-600 font-medium mb-8 leading-relaxed">
                In a world of screens, we champion the physical. Toys that demand touch, inspire storytelling, and withstand the test of time.
              </p>
              <MagneticButton variant="dark" className="w-max">Read Our Manifesto</MagneticButton>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= INFINITE MARQUEE ================= */}
      <WavyDivider fill="#fafafa" />
      <section className="py-20 relative z-20 overflow-hidden bg-[#fafafa]">
        <h2 className="text-4xl font-black tracking-tighter text-center mb-12 text-slate-900 px-6">Loved by Families</h2>
        <div className="relative w-full flex items-center">
          <div className="absolute left-0 top-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none"></div>
          <div className="flex gap-6 w-max px-6 will-change-transform transform-gpu" style={{ animation: "marquee 35s linear infinite" }}>
            <style>{`@keyframes marquee { 0% { transform: translateX(-50%); } 100% { transform: translateX(0%); } }`}</style>
            {infiniteReviews.map((review, idx) => (
              <div key={idx} className="w-[320px] md:w-[450px] shrink-0 bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex text-amber-400 mb-6">{[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}</div>
                <p className="text-lg text-slate-600 font-medium mb-8 leading-relaxed line-clamp-3">"{review.text}"</p>
                <p className="font-bold text-slate-900 tracking-wide">— {review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STAY CONNECTED NEWSLETTER ================= */}
      <section className="py-16 px-6 max-w-[1440px] mx-auto relative z-20 flex justify-center items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[800px] bg-white rounded-[3rem] p-10 md:p-14 flex flex-col items-center justify-center gap-8 shadow-2xl text-center mx-auto"
        >
          <div className="flex flex-col items-center">
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">Stay Connected</h3>
            <p className="text-sm md:text-base text-slate-500 font-bold mt-2 text-center">Get the latest toys & offers directly in your inbox.</p>
          </div>
          <form className="flex w-full max-w-[500px] bg-slate-50 rounded-full p-2 items-center mx-auto shadow-inner">
            <input 
              type="email" 
              placeholder="Your email here" 
              className="flex-1 bg-transparent px-6 py-3 outline-none font-bold text-slate-600 placeholder:text-slate-400 placeholder:font-medium"
              style={{ border: 'none', outline: 'none', boxShadow: 'none', WebkitAppearance: 'none' }}
            />
            <button type="button" className="w-12 h-12 md:w-14 md:h-14 bg-amber-400 rounded-full flex items-center justify-center text-slate-900 hover:bg-amber-500 hover:scale-105 transition-all shadow-md shrink-0">
              <span className="material-symbols-outlined text-[20px] md:text-[24px] font-bold">arrow_forward</span>
            </button>
          </form>
        </motion.div>
      </section>
      
    </main>
  );
};

export default Home;