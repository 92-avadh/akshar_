import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, setPendingItem } from '../features/cart/cartSlice';
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

  const baseStyles = "relative overflow-hidden group px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-2";
  const variants = {
    dark: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-xl hover:shadow-red-600/30",
    light: "bg-white text-red-600 border border-red-100 hover:border-red-300 hover:bg-red-50 shadow-sm",
  };

  return (
    <motion.button onClick={onClick} ref={ref} onMouseMove={handleMouse} onMouseLeave={reset} style={{ x: springX, y: springY }} className={`${baseStyles} ${variants[variant]} ${className} will-change-transform transform-gpu`}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};

// ==========================================
// MAIN PAGE
// ==========================================
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // OPTIMIZATION: Default window scroll is heavily optimized by Framer Motion
  const { scrollYProgress } = useScroll(); 
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const products = [
    { _id: '1', name: "Eco-Wooden Rail", title: "Eco-Wooden Rail", price: 899, originalPrice: 1199, tag: "Eco Friendly", img: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3" },
    { _id: '2', name: "Diecast Metal Truck", title: "Diecast Metal Truck", price: 599, originalPrice: 699, tag: "Collectible", img: "https://images.unsplash.com/photo-1594787317666-41793740284e?ixlib=rb-4.0.3" },
    { _id: '3', name: "STEM Building Set", title: "STEM Building Set", price: 1199, originalPrice: 1499, tag: "Best Seller", img: "https://images.unsplash.com/photo-1555448248-2571daf6344b?ixlib=rb-4.0.3" },
    { _id: '4', name: "Artisan Craft Kit", title: "Artisan Craft Kit", price: 699, originalPrice: 899, tag: "New", img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?ixlib=rb-4.0.3" }
  ];

  const categories = [
    { name: "Imaginative Play", desc: "Let their stories unfold", size: "md:col-span-2 md:row-span-2 h-[400px] md:h-[500px]", img: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop" },
    { name: "Building & STEM", desc: "Engineer the future", size: "md:col-span-1 md:row-span-1 h-[240px]", img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop" },
    { name: "Creative Arts", desc: "Unleash inner artists", size: "md:col-span-1 md:row-span-1 h-[240px]", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop" },
  ];

  const shopByAgeData = [
    {
      age: "0-12 MO",
      label: "Infants",
      sublabel: "Newborn to First Steps",
      section: "Infants",
      color: "text-red-400",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      radius: "40% 60% 70% 30% / 40% 50% 60% 50%",
      icon: "🍼",
      subcategories: ["Onesies", "Sleepwear", "Swaddles", "Rompers", "Booties", "Bibs"],
      sizes: ["NB", "0-3M", "3-6M", "6-9M", "9-12M"],
      genderFilters: ["Boy", "Girl", "Neutral"],
      highlights: ["Ultra-soft fabrics", "Snap closures", "Hypoallergenic"],
      productCount: 120,
    },
    {
      age: "12-36 MO",
      label: "Toddlers",
      sublabel: "Walking & Exploring",
      section: "Infants",
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      radius: "50% 50% 30% 70% / 60% 30% 70% 40%",
      icon: "🧸",
      subcategories: ["T-Shirts", "Leggings", "Shorts", "Dresses", "PJs", "First Shoes"],
      sizes: ["12-18M", "18-24M", "2T"],
      genderFilters: ["Boy", "Girl", "Neutral"],
      highlights: ["Elastic waistbands", "Easy pull-on", "Durable knees"],
      productCount: 110,
    },
    {
      age: "2-5 YRS",
      label: "Preschool",
      sublabel: "Creative & Curious",
      section: "Little Kids",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      radius: "70% 30% 50% 50% / 30% 40% 60% 70%",
      icon: "🎨",
      subcategories: ["Tops", "Bottoms", "Dresses", "Activewear", "Outerwear", "Swimwear"],
      sizes: ["2T", "3T", "4T", "5T"],
      genderFilters: ["Boy", "Girl", "Neutral"],
      highlights: ["Art-friendly", "Washable prints", "Play-proof"],
      productCount: 130,
    },
    {
      age: "5-7 YRS",
      label: "Kindergarten",
      sublabel: "School Ready",
      section: "Little Kids",
      color: "text-red-700",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
      radius: "30% 70% 60% 40% / 50% 60% 40% 50%",
      icon: "🎒",
      subcategories: ["Uniforms", "Tops", "Bottoms", "Activewear", "Rainwear", "Sneakers"],
      sizes: ["XS (4-5)", "S (6-7)"],
      genderFilters: ["Boy", "Girl", "Neutral"],
      highlights: ["School-ready", "Active-friendly", "Stain resistant"],
      productCount: 115,
    },
    {
      age: "7-10 YRS",
      label: "Grade School",
      sublabel: "Full of Energy",
      section: "Big Kids",
      color: "text-red-700",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
      radius: "60% 40% 40% 60% / 40% 60% 50% 50%",
      icon: "⚽",
      subcategories: ["Graphic Tees", "Jeans", "Hoodies", "Activewear", "Shorts", "Sneakers"],
      sizes: ["S (7-8)", "M (9-10)"],
      genderFilters: ["Boy", "Girl", "Neutral"],
      highlights: ["Sporty styles", "Reinforced knees", "Weekend looks"],
      productCount: 135,
    },
    {
      age: "10-14 YRS",
      label: "Tweens",
      sublabel: "Finding Their Style",
      section: "Big Kids",
      color: "text-red-800",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
      radius: "45% 55% 55% 45% / 55% 45% 55% 45%",
      icon: "🎧",
      subcategories: ["Streetwear", "Denim", "Hoodies", "Joggers", "Layer Pieces", "Accessories"],
      sizes: ["L (11-12)", "XL (12-13)", "XXL (13-14)"],
      genderFilters: ["Boy", "Girl", "Unisex"],
      highlights: ["Trend-forward", "Self-expression", "Casual & cool"],
      productCount: 150,
    },
    {
      age: "14+ YRS",
      label: "Teens",
      sublabel: "Young Adults",
      section: "Teens",
      color: "text-rose-800",
      bgColor: "bg-rose-100",
      borderColor: "border-rose-400",
      radius: "50% 50% 40% 60% / 40% 50% 60% 50%",
      icon: "🛍️",
      subcategories: ["Premium Basics", "Outerwear", "Formal", "Athleisure", "Denim", "Accessories"],
      sizes: ["XS", "S", "M", "L", "XL"],
      genderFilters: ["Male", "Female", "Unisex"],
      highlights: ["Adult sizing", "Fashion-forward", "Occasion wear"],
      productCount: 160,
    },
  ];

  const reviews = [
    { text: "The wooden blocks are incredible. My daughter plays with them for hours, and they look beautiful in the living room.", author: "Sarah Jenkins" },
    { text: "Finally, toys that don't break after a week. You can feel the quality the moment you unbox them.", author: "Mark D." },
    { text: "Love the mission. It feels good to buy toys that are safe for my kids and the planet.", author: "Elena R." },
    { text: "The perfect gifts! The packaging is gorgeous, and the toys are durable enough to withstand my two wild toddlers.", author: "James T." },
  ];
  const infiniteReviews = [...reviews, ...reviews];

  const runningCategories = [ 
    "Soft Toys", "Wooden Wonders", "Remote controles Cars", "Arts & Crafts", 
    "Mind Puzzles", "Metal Machines", "Outdoor Adventures", "Educational Games", "Building & STEM" 
  ];
  const infiniteCategories = [...runningCategories, ...runningCategories];

  // ================= NEW ADD TO CART LOGIC =================
  const handleAddToCart = (product) => {
    const userInfoData = sessionStorage.getItem('userInfo');
    const userInfo = (userInfoData && userInfoData !== 'null' && userInfoData !== 'undefined') ? JSON.parse(userInfoData) : null;

    if (!userInfo) {
      dispatch(setPendingItem({ ...product, qty: 1 }));
      navigate('/cart');
    } else {
      dispatch(addToCart({ ...product, qty: 1 }));
      toast.success(`${product.name || product.title} added to Cart!`, { icon: '🎒', style: { border: '1px solid #fecaca', color: '#450a0a' } });
    }
  };

  return (
    <main className="bg-white text-red-950 min-h-screen font-sans overflow-x-hidden selection:bg-red-100 relative fade-in">
      
      {/* ================= HERO SECTION ================= */}
      <motion.section style={{ y: heroY, opacity: heroOpacity }} className="relative min-h-[90vh] flex items-center justify-center px-6 z-10 pt-28 pb-16 max-w-[1440px] mx-auto pointer-events-auto will-change-transform transform-gpu">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }} className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left z-20">
            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="mb-8 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-widest">
              <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span></span>
              Fresh Arrivals
            </motion.div>
            <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-5xl md:text-7xl font-black tracking-tighter text-red-950 leading-[1.05] mb-6">
              Dive into the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Universe of Play.</span>
            </motion.h1>
            <motion.p variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="text-lg text-red-950/60 font-medium max-w-lg mb-10 leading-relaxed">
              Step into a world of minimal, sustainable, and wonderfully engaging toys designed to nurture creativity.
            </motion.p>
            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/shop" className="w-full sm:w-auto"><MagneticButton variant="dark" className="w-full justify-center">Start Exploring <span className="material-symbols-outlined text-sm">arrow_forward</span></MagneticButton></Link>
            </motion.div>
          </motion.div>

          <div className="lg:col-span-6 relative h-[500px] lg:h-[650px] w-full flex items-center justify-center">
            <motion.div initial={{ opacity: 0, y: 50, rotate: -3 }} animate={{ opacity: 1, y: 0, rotate: -2 }} transition={{ duration: 0.8, delay: 0.2 }} className="absolute z-10 w-[280px] sm:w-[320px] bg-white p-5 rounded-[2rem] border border-red-50 shadow-2xl shadow-red-900/10 group hover:rotate-0 hover:scale-[1.02] transition-all duration-500">
              <div className="bg-red-50/50 rounded-2xl h-[280px] p-6 mb-5 flex items-center justify-center relative overflow-hidden group-hover:bg-red-50 transition-colors duration-500">
                <img loading="eager" decoding="async" src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3" alt="Wooden Toy" className="w-full h-full object-contain mix-blend-multiply" />
                <div className="absolute top-4 left-4 bg-white shadow-sm border border-red-50 text-red-600 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">Eco-Friendly</div>
              </div>
              <div className="px-2 pb-2 text-center">
                <h3 className="font-bold text-lg text-red-950 mb-1">Wooden Rail Express</h3>
                <p className="text-red-950/60 font-medium">₹899</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ================= INFINITE CATEGORY STRIP ================= */}
      <section className="py-5 bg-red-600 border-y border-red-700 overflow-hidden relative z-20 flex">
        <div className="flex gap-8 w-max px-4 will-change-transform transform-gpu" style={{ animation: "marquee-fast 20s linear infinite" }}>
          <style>{`@keyframes marquee-fast { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }`}</style>
          {infiniteCategories.map((cat, idx) => (
            <div key={idx} className="flex items-center gap-8 shrink-0">
              <span className="text-white font-black uppercase tracking-widest text-sm md:text-base whitespace-nowrap">{cat}</span>
              <span className="material-symbols-outlined text-red-300 text-sm">star</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SHOP BY AGE ================= */}
      <section className="bg-red-50/30 py-24 relative z-20 border-y border-red-50">
        <div className="max-w-[1440px] mx-auto px-6 text-center mb-16">
          <h2 className="text-red-600 font-bold uppercase tracking-widest text-xs mb-3">Find The Perfect Toy</h2>
          <h3 className="text-4xl md:text-5xl font-black text-red-950 tracking-tighter">Shop by Age</h3>
        </div>
        
        {/* Scrollable Container */}
        <div className="flex overflow-x-auto gap-8 px-6 pb-12 pt-4 max-w-[1440px] mx-auto snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
          
          {shopByAgeData.map((item, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ scale: 1.05 }} 
              className={`shrink-0 snap-center w-56 h-56 md:w-64 md:h-64 ${item.bgColor} border ${item.borderColor} shadow-sm hover:shadow-xl hover:shadow-red-900/10 flex flex-col items-center justify-center p-6 cursor-pointer transition-all duration-300 ${item.color}`} 
              style={{ borderRadius: item.radius }}
            >
               <span className="text-4xl md:text-5xl mb-3">{item.icon}</span>
               <h4 className="font-black text-2xl md:text-3xl tracking-tight leading-none text-center">{item.age}</h4>
               <p className="font-bold text-red-950/60 text-sm mt-2 uppercase tracking-wider">{item.label}</p>
               <p className="font-medium text-red-950/40 text-xs mt-1 text-center">{item.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= EXPLORE POPULAR TOY SET ================= */}
      <section className="py-24 px-6 max-w-[1440px] mx-auto relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-red-600 font-bold uppercase tracking-widest text-xs mb-3">Editor's Picks</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-red-950">Explore Popular Sets</h3>
          </div>
          <Link to="/shop" className="text-red-600 font-bold uppercase tracking-widest text-xs border border-red-100 hover:border-red-300 hover:bg-red-50 px-6 py-3 rounded-full transition-all duration-300">See All Favorites</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }} className="group bg-white border border-red-100 rounded-[2rem] overflow-hidden hover:shadow-xl hover:shadow-red-900/10 transition-all duration-500 relative flex flex-col">
              
              <div className="p-3">
                <div className="relative h-60 p-6 flex items-center justify-center bg-red-50/50 rounded-3xl overflow-hidden group-hover:bg-red-50 transition-colors duration-500">
                  <img loading="lazy" decoding="async" src={product.img} alt={product.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute top-4 left-4 bg-white shadow-sm border border-red-50 text-red-600 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                    {product.tag}
                  </div>
                </div>
              </div>
              
              <div className="px-6 pb-8 pt-4 flex-1 flex flex-col justify-between relative z-10">
                <h3 className="text-lg font-bold leading-tight mb-4 text-red-950">{product.title}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-red-950">₹{product.price}</span>
                  <span className="text-sm font-medium text-red-950/40 line-through">₹{product.originalPrice}</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
                <button onClick={() => handleAddToCart(product)} className="w-full bg-red-600 text-white rounded-2xl py-4 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30">
                  <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span> Add to Bag
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= BENTO CATEGORIES ================= */}
      <section className="py-24 px-6 max-w-[1440px] mx-auto relative z-20">
        <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-red-950">Universes of Play.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }} className={`group relative rounded-[2rem] overflow-hidden bg-red-50 cursor-pointer ${cat.size}`}>
              <img loading="lazy" decoding="async" src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 to-transparent opacity-80"></div>
              
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-black text-white">{cat.name}</h3>
                  <p className="text-red-50 font-medium text-sm mt-1 opacity-90">{cat.desc}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-red-600 transition-all duration-300">
                  <span className="material-symbols-outlined -rotate-45">arrow_forward</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= EDITORIAL PARALLAX ================= */}
      <section className="py-24 px-6 max-w-[1440px] mx-auto relative z-20">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative h-[70vh] rounded-[3rem] overflow-hidden">
          <motion.div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3')] bg-cover bg-center" initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }}></motion.div>
          <div className="absolute inset-0 bg-red-950/10"></div>
          
          <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end items-start">
            <div className="bg-white/95 backdrop-blur-xl border border-white p-10 md:p-14 rounded-[2rem] max-w-xl shadow-2xl shadow-red-950/20">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 leading-tight text-red-950">
                The Art of <br /><span className="text-red-600">Unplugged</span> Joy.
              </h2>
              <p className="text-red-950/70 font-medium mb-8 leading-relaxed">
                In a world of screens, we champion the physical. Toys that demand touch, inspire storytelling, and withstand the test of time.
              </p>
              <MagneticButton variant="dark" className="w-max">Read Our Manifesto</MagneticButton>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= INFINITE MARQUEE ================= */}
      <section className="py-24 relative z-20 overflow-hidden bg-white border-t border-red-50">
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-center mb-16 text-red-950 px-6">Loved by Families</h2>
        <div className="relative w-full flex items-center">
          <div className="absolute left-0 top-0 w-24 md:w-48 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-24 md:w-48 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          <div className="flex gap-6 w-max px-6 will-change-transform transform-gpu py-4" style={{ animation: "marquee 40s linear infinite" }}>
            <style>{`@keyframes marquee { 0% { transform: translateX(-50%); } 100% { transform: translateX(0%); } }`}</style>
            {infiniteReviews.map((review, idx) => (
              <div key={idx} className="w-[300px] md:w-[400px] shrink-0 bg-red-50/30 border border-red-100 p-8 md:p-10 rounded-[2rem]">
                <div className="flex text-red-500 mb-6">{[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}</div>
                <p className="text-red-950/70 font-medium mb-8 leading-relaxed line-clamp-4">"{review.text}"</p>
                <p className="font-bold text-red-950 text-sm tracking-wide">{review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STORE FEATURES ================= */}
      <section className="py-20 bg-white relative z-20 border-t border-red-50">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: 'local_shipping', title: 'Free Delivery', subtitle: 'On orders over ₹999' },
              { icon: 'shield_lock', title: '100% Secure Payment', subtitle: 'Encrypted transactions' },
              { icon: 'sell', title: 'Daily Offer', subtitle: 'Explore fresh deals' },
              { icon: 'workspace_premium', title: 'Quality Guarantee', subtitle: 'Premium toy materials' }
            ].map((feature, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-red-50/50 transition-colors duration-300 group"
              >
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 group-hover:bg-red-100 group-hover:shadow-lg group-hover:shadow-red-600/10 transition-all duration-300">
                  <span className="material-symbols-outlined text-4xl">{feature.icon}</span>
                </div>
                <h4 className="font-black text-red-950 text-xl tracking-tight mb-2">{feature.title}</h4>
                <p className="text-red-950/60 font-medium">{feature.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STAY CONNECTED ================= */}
      <section className="py-24 px-6 max-w-[1440px] mx-auto relative z-20 flex justify-center items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[900px] bg-gradient-to-br from-red-600 via-red-800 to-red-950 rounded-[3rem] p-12 md:p-20 flex flex-col items-center justify-center gap-10 text-center mx-auto relative overflow-hidden shadow-2xl shadow-red-900/20"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-500 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
          <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_center,_white_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none"></div>
          
          <div className="flex flex-col items-center relative z-10">
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Stay Connected</h3>
            <p className="text-red-100 font-medium mt-4 max-w-md opacity-90">Get the latest minimalist toys & exclusive offers directly in your inbox.</p>
          </div>
          
          <form className="flex w-full max-w-[500px] bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 items-center mx-auto relative z-10 transition-all focus-within:bg-white/15 focus-within:border-white/30">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-transparent px-6 py-3 outline-none text-white placeholder:text-red-200 font-medium"
            />
            <button type="button" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-700 hover:bg-red-50 hover:scale-105 transition-all shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
            </button>
          </form>
        </motion.div>
      </section>
      
    </main>
  );
};

export default Home;