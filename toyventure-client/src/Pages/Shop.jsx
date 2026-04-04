import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ScrollReveal from '../components/ScrollReveal.jsx';
import { useGetProductsQuery } from '../features/api/apiSlice.js';
import { toggleFavorite } from '../features/wishlist/wishlistSlice.js'; 
import { addToCart } from '../features/cart/cartSlice'; 

const Shop = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || []); 

  const { data: responseData, isLoading, error } = useGetProductsQuery();
  
  // Safely extract products just in case the backend wraps it
  const products = responseData?.data || (Array.isArray(responseData) ? responseData : []);

  if (isLoading) {
    return (
      <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative">
        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
          <div className="w-32 h-4 bg-zinc-200/60 animate-pulse rounded mb-6"></div>
          <div className="w-64 h-12 bg-zinc-200/60 animate-pulse rounded mb-8"></div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="flex flex-col card-surface p-4 rounded-[2rem] shadow-sm">
                <div className="w-full aspect-[4/3] bg-zinc-200/80 animate-pulse rounded-[1.5rem] mb-5"></div>
                <div className="px-2 flex flex-col flex-1">
                  <div className="h-5 bg-zinc-200/80 animate-pulse rounded w-3/4 mb-3"></div>
                  <div className="h-5 bg-zinc-200/80 animate-pulse rounded w-1/2 mb-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Oops! Something went wrong.</h2>
          <p className="text-zinc-600">Failed to load products.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        <ScrollReveal className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-6">
          <Link to="/" className="hover:text-primary-container flex items-center transition-colors">
            <span className="material-symbols-outlined text-[16px] mr-1">home</span> HOME
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary-container transition-colors">SHOP</Link>
          <span>/</span>
          <span className="text-zinc-800">ALL TOYS</span>
        </ScrollReveal>

        <ScrollReveal delay={50}>
          <h1 className="text-4xl md:text-5xl font-black text-on-surface mb-8 tracking-tighter">Magical Collection</h1>
        </ScrollReveal>

        <ScrollReveal delay={100} className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 mb-4 gap-4 border-b border-white/50 pb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-bold text-sm shadow-soft border ${
                isFilterOpen ? 'bg-primary-container text-white border-primary-container' : 'card-surface text-zinc-700 hover:text-primary-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span> 
              {isFilterOpen ? 'Close Filters' : 'Show Filters'}
            </button>
            <span className="text-zinc-600 font-medium text-sm hidden sm:block bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              Showing {products.length} magical items
            </span>
          </div>
        </ScrollReveal>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8 mt-8">
          {products.map((product, index) => {
            
            const isFavorited = wishlistItems.some((wItem) => wItem._id === product._id);

            return (
              <ScrollReveal as={Link} to={`/product/${product._id}`} key={product._id} delay={index * 50} className="flex flex-col group cursor-pointer relative block card-surface p-4 rounded-[2rem] hover:-translate-y-2 transition-all duration-300">
                
                {/* FAVORITE BUTTON */}
                <button 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    dispatch(toggleFavorite(product)); 
                  }}
                  className="absolute top-6 right-16 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <span className={`material-symbols-outlined text-[20px] transition-colors ${isFavorited ? 'text-red-500 filled' : 'text-zinc-400 hover:text-red-400'}`}>
                    favorite
                  </span>
                </button>

                {/* CART BUTTON */}
                <button 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    dispatch(addToCart({ ...product, qty: 1 }));
                    alert(`${product.title} added to cart!`); 
                  }}
                  className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-md text-primary-container p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-primary-container hover:text-white"
                >
                  <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                </button>

                <div className="w-full aspect-[4/3] bg-white/50 rounded-[1.5rem] overflow-hidden relative mb-5 shadow-inner border border-white/60">
                  <img alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" src={product.img} />
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
                  
                  {/* SAFE PRICE PARSING */}
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-zinc-800 font-black text-xl tracking-tight">
                      ₹{product?.price ? Number(String(product.price).replace(/[^0-9.-]+/g, "")).toLocaleString('en-IN') : '0.00'}
                    </span>
                    {product.oldPrice && (
                      <span className="text-zinc-400 line-through text-xs font-medium">
                        ₹{Number(String(product.oldPrice).replace(/[^0-9.-]+/g, "")).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </main>
  );
};

export default Shop;