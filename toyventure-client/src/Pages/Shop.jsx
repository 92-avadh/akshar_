import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal.jsx';
import { useGetProductsQuery } from '../features/api/apiSlice.js';

const Shop = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch the real products from your backend
  const { data: products, isLoading, error } = useGetProductsQuery();

  // ========================================================
  // LOADING STATE: Skeleton Animation
  // ========================================================
  if (isLoading) {
    return (
      <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative">
        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
          
          {/* Skeleton for Title & Breadcrumbs */}
          <div className="w-32 h-4 bg-zinc-200/60 animate-pulse rounded mb-6"></div>
          <div className="w-64 h-12 bg-zinc-200/60 animate-pulse rounded mb-8"></div>
          
          {/* Skeleton for Toolbar */}
          <div className="flex justify-between items-center mb-8 border-b border-white/50 pb-6">
            <div className="w-32 h-10 bg-zinc-200/60 animate-pulse rounded-full"></div>
            <div className="w-48 h-10 bg-zinc-200/60 animate-pulse rounded-full"></div>
          </div>

          {/* Skeleton Product Grid (Renders 8 empty pulsing cards) */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="flex flex-col card-surface p-4 rounded-[2rem] shadow-sm">
                <div className="w-full aspect-[4/3] bg-zinc-200/80 animate-pulse rounded-[1.5rem] mb-5"></div>
                <div className="px-2 flex flex-col flex-1">
                  <div className="h-5 bg-zinc-200/80 animate-pulse rounded w-3/4 mb-3"></div>
                  <div className="h-5 bg-zinc-200/80 animate-pulse rounded w-1/2 mb-4"></div>
                  <div className="flex gap-2 items-center mb-2 mt-auto">
                     <div className="h-6 bg-zinc-200/80 animate-pulse rounded w-16"></div>
                     <div className="h-4 bg-zinc-200/80 animate-pulse rounded w-10"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </main>
    );
  }

  // ========================================================
  // ERROR STATE
  // ========================================================
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Oops! Something went wrong.</h2>
          <p className="text-zinc-600">Failed to load products. Please check your server connection.</p>
        </div>
      </div>
    );
  }

  // ========================================================
  // SUCCESS STATE: Render Real Data
  // ========================================================
  const productsToDisplay = products || [];

  return (
    <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* Breadcrumbs */}
        <ScrollReveal className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-6">
          <Link to="/" className="hover:text-primary-container flex items-center transition-colors">
            <span className="material-symbols-outlined text-[16px] mr-1">home</span> HOME
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary-container transition-colors">SHOP</Link>
          <span>/</span>
          <span className="text-zinc-800">ALL TOYS</span>
        </ScrollReveal>

        {/* Page Title */}
        <ScrollReveal delay={50}>
          <h1 className="text-4xl md:text-5xl font-black text-on-surface mb-8 tracking-tighter">Magical Collection</h1>
        </ScrollReveal>

        {/* Top Toolbar */}
        <ScrollReveal delay={100} className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 mb-4 gap-4 border-b border-white/50 pb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-bold text-sm shadow-soft border ${
                isFilterOpen 
                  ? 'bg-primary-container text-white border-primary-container' 
                  : 'card-surface text-zinc-700 hover:text-primary-container hover:-translate-y-0.5'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span> 
              {isFilterOpen ? 'Close Filters' : 'Show Filters'}
            </button>
            <span className="text-zinc-600 font-medium text-sm hidden sm:block bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              Showing {productsToDisplay.length} magical items
            </span>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="hidden lg:flex items-center card-surface rounded-full p-1 border-white/80">
              <button className="bg-zinc-800 text-white px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-md">
                <span className="material-symbols-outlined text-[16px]">grid_view</span> 4
              </button>
              <button className="text-zinc-500 hover:text-zinc-800 px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-colors">
                <span className="material-symbols-outlined text-[16px]">view_comfy</span> 5
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm card-surface px-4 py-2.5 rounded-full hover:shadow-soft transition-all cursor-pointer">
              <span className="text-zinc-600 font-bold hidden sm:block">Sort:</span>
              <select className="border-none bg-transparent font-bold text-zinc-800 cursor-pointer focus:ring-0 p-0 pr-6 outline-none">
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>
        </ScrollReveal>

        {/* Expandable Filter Panel */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isFilterOpen ? 'max-h-[600px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}`}>
          <div className="card-surface p-8 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-black text-sm text-zinc-800 uppercase tracking-wider mb-4 border-b border-white pb-2">Shop By Age</h4>
              <div className="space-y-3">
                {['0-3 Years', '3-5 Years', '5-8 Years', '8+ Years'].map(age => (
                  <label key={age} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded text-primary-container focus:ring-primary-container border-zinc-300 shadow-sm cursor-pointer" />
                    <span className="text-sm font-medium text-zinc-700 group-hover:text-primary-container transition-colors">{age}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-black text-sm text-zinc-800 uppercase tracking-wider mb-4 border-b border-white pb-2">Price Range</h4>
              <div className="space-y-3">
                {['Under ₹499', '₹500 - ₹999', '₹1000 - ₹1999', 'Above ₹2000'].map(price => (
                  <label key={price} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded text-primary-container focus:ring-primary-container border-zinc-300 shadow-sm cursor-pointer" />
                    <span className="text-sm font-medium text-zinc-700 group-hover:text-primary-container transition-colors">{price}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-black text-sm text-zinc-800 uppercase tracking-wider mb-4 border-b border-white pb-2">Vehicle Type</h4>
              <div className="space-y-3">
                {['Sports Cars', 'Off-Road / SUVs', 'Classic / Vintage', 'Construction'].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded text-primary-container focus:ring-primary-container border-zinc-300 shadow-sm cursor-pointer" />
                    <span className="text-sm font-medium text-zinc-700 group-hover:text-primary-container transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-end gap-3">
               <button className="w-full py-3.5 bg-primary-container text-white font-black rounded-2xl hover:bg-orange-600 transition-colors shadow-lg hover:shadow-orange-500/30">
                 Apply Filters
               </button>
               <button onClick={() => setIsFilterOpen(false)} className="w-full py-3.5 bg-white/50 backdrop-blur border border-white/60 text-zinc-700 font-bold rounded-2xl hover:bg-white transition-colors shadow-sm">
                 Clear All
               </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8">
          {productsToDisplay.map((product, index) => (
            <ScrollReveal as={Link} to={`/product/${product._id}`} key={product._id} delay={index * 50} className="flex flex-col group cursor-pointer relative block card-surface p-4 rounded-[2rem] hover:-translate-y-2 transition-all duration-300">
              
              <button 
                onClick={(e) => { e.preventDefault(); alert("Added to cart!"); }}
                className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-md text-primary-container p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-primary-container hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
              </button>

              <div className="w-full aspect-[4/3] bg-white/50 rounded-[1.5rem] overflow-hidden relative mb-5 shadow-inner border border-white/60">
                <img 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" 
                  src={product.img}
                />
                {product.tag && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                    {product.tag}
                  </div>
                )}
              </div>

              <div className="px-2 flex flex-col flex-1">
                <h3 className="font-bold text-zinc-800 text-[15px] leading-snug group-hover:text-primary-container transition-colors line-clamp-2 h-11 mb-3">
                  {product.title}
                </h3>
                
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-zinc-800 font-black text-xl tracking-tight">₹{product.price}</span>
                  {product.oldPrice && <span className="text-zinc-400 line-through text-xs font-medium">₹{product.oldPrice}</span>}
                  {product.discount && <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[10px] font-black tracking-wider">{product.discount}</span>}
                </div>
                
                {product.clubPrice && (
                  <div className="mt-auto pt-3 border-t border-zinc-200/50 flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Members</span>
                    <p className="text-teal-700 font-black text-sm tracking-tight">
                      ₹{product.clubPrice}
                    </p>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Load More Button */}
        {productsToDisplay.length > 0 && (
          <ScrollReveal delay={200} className="mt-16 mb-8 flex justify-center">
            <button className="card-surface text-zinc-800 font-black px-10 py-4 rounded-full hover:-translate-y-1 hover:shadow-soft transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">autorenew</span>
                Load More Products
            </button>
          </ScrollReveal>
        )}

      </div>
    </main>
  );
};

export default Shop;