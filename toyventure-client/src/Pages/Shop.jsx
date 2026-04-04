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
  const products = responseData?.data || (Array.isArray(responseData) ? responseData : []);

  // Safely display the price directly from your database
  const displayPrice = (price) => {
    if (price === undefined || price === null) return '0';
    const str = String(price);
    return str.includes('₹') ? str : `₹${str}`;
  };

  if (isLoading) {
    return (
      <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative">
        <div className="max-w-[1440px] mx-auto px-6 relative z-10 flex justify-center">
          <div className="w-16 h-16 border-4 border-primary-container border-t-transparent rounded-full animate-spin mt-20"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <h2 className="text-2xl font-bold text-red-500">Failed to load products.</h2>
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
          <span className="text-zinc-800">SHOP</span>
        </ScrollReveal>

        <ScrollReveal delay={50}>
          <h1 className="text-4xl md:text-5xl font-black text-on-surface mb-8 tracking-tighter">Magical Collection</h1>
        </ScrollReveal>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8 mt-8">
          {products.map((product, index) => {
            
            const isFavorited = wishlistItems.some((wItem) => wItem._id === product._id);

            return (
              // FIX: This is now a <div> instead of a <Link> to stop click bugs
              <ScrollReveal as="div" key={product._id} delay={index * 50} className="flex flex-col group relative block card-surface p-4 rounded-[2rem] hover:-translate-y-2 transition-all duration-300">
                
                {/* FAVORITE BUTTON */}
                <button 
                  onClick={() => dispatch(toggleFavorite(product))}
                  className="absolute top-6 right-16 z-20 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <span className={`material-symbols-outlined text-[20px] transition-colors ${isFavorited ? 'text-red-500 filled' : 'text-zinc-400 hover:text-red-400'}`}>
                    favorite
                  </span>
                </button>

                {/* CART BUTTON */}
                <button 
                  onClick={() => { 
                    dispatch(addToCart({ ...product, qty: 1 }));
                    alert(`${product.title} added to cart!`); 
                  }}
                  className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-md text-primary-container p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-primary-container hover:text-white"
                >
                  <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                </button>

                <Link to={`/product/${product._id}`} className="w-full aspect-[4/3] bg-white/50 rounded-[1.5rem] overflow-hidden relative mb-5 shadow-inner border border-white/60 block z-10">
                  <img alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" src={product.img} />
                  {product.tag && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                      {product.tag}
                    </div>
                  )}
                </Link>

                <div className="px-2 flex flex-col flex-1">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-bold text-zinc-800 text-[15px] leading-snug hover:text-primary-container transition-colors line-clamp-2 h-11 mb-3">
                      {product.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-zinc-800 font-black text-xl tracking-tight">
                      {displayPrice(product.price)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-zinc-400 line-through text-xs font-medium">
                        {displayPrice(product.oldPrice)}
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