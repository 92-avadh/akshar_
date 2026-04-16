import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Fixed relative import paths from ../ to ./
import { useGetProductsQuery } from './features/api/apiSlice';
import Hero from './assets/hero.png';
import SkeletonCard from './components/SkeletonCard';

const Home = () => {
  // Fetch real products from your backend
  const { data: productsData, isLoading, isError } = useGetProductsQuery();

  // Get the first 4 products to show in "Popular Sets"
  const popularProducts = productsData?.products?.slice(0, 4) || [];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-hero-glow">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-red-950 tracking-tighter leading-[0.9] mb-6">
              PLAY WITHOUT <span className="text-red-600">LIMITS.</span>
            </h1>
            <p className="text-xl text-red-900/70 mb-10 max-w-md font-medium leading-relaxed">
              Premium wooden toys and creative sets designed to spark imagination in every child.
            </p>
            <Link 
              to="/shop" 
              className="inline-block bg-red-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-200"
            >
              SHOP COLLECTION
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <img src={Hero} alt="Premium Toy" className="w-full h-auto drop-shadow-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Dynamic Popular Sets Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-black text-red-950 tracking-tight mb-4">EXPLORE POPULAR SETS</h2>
            <div className="h-1.5 w-24 bg-red-600 rounded-full"></div>
          </div>
          <Link to="/shop" className="text-red-600 font-bold hover:underline">View All →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            // Show skeletons while loading
            [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          ) : isError ? (
            <p className="col-span-full text-center text-red-500 font-bold">Failed to load popular products.</p>
          ) : (
            popularProducts.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ y: -10 }}
                className="group relative bg-red-50/50 rounded-[2rem] p-6 transition-all border border-transparent hover:border-red-100"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-white shadow-inner">
                    <img 
                      src={product.images[0] || 'https://via.placeholder.com/400'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <h3 className="font-black text-red-950 text-xl mb-2">{product.name}</h3>
                  <p className="text-red-600 font-black text-lg">₹{product.price}</p>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* NEW: Safety Standards Preview Section */}
      <section className="py-24 bg-red-950 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-16 items-center">
           <div>
              <h2 className="text-5xl font-black mb-6 tracking-tighter">OUR SAFETY <br/>STANDARDS</h2>
              <p className="text-red-100/70 text-lg mb-8 leading-relaxed">
                Every ToyBlix product undergoes rigorous testing to exceed international safety norms. 
                We use non-toxic paints and sustainable materials because your child's health is our priority.
              </p>
              <Link to="/safety-standards" className="bg-white text-red-950 px-8 py-4 rounded-xl font-bold hover:bg-red-50 transition-colors">
                Read Safety Commitment
              </Link>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
                <span className="text-3xl mb-4 block">🛡️</span>
                <h4 className="font-bold mb-2">Non-Toxic</h4>
                <p className="text-xs text-red-100/60">100% Lead-free and BPA-free materials.</p>
              </div>
              <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
                <span className="text-3xl mb-4 block">🪵</span>
                <h4 className="font-bold mb-2">Sustainable</h4>
                <p className="text-xs text-red-100/60">FSC Certified natural wood sources.</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;