import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal.jsx';
import { useGetProductByIdQuery } from '../features/api/apiSlice.js';

const ProductDetail = () => {
  // 1. Get the exact product ID from the URL (e.g., /product/64f1a2...)
  const { id } = useParams();
  
  // 2. Fetch the specific product from your backend!
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);

  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  // When the product loads, set the main image
  useEffect(() => {
    if (product) setActiveImage(product.img);
  }, [product]);

  // Handle Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28 pb-24 bg-surface">
        <div className="w-16 h-16 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle Error State
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-28 pb-24 bg-surface">
        <h2 className="text-3xl font-black text-zinc-800 mb-4">Toy Not Found</h2>
        <Link to="/store" className="text-primary-container font-bold hover:underline">Go back to Store</Link>
      </div>
    );
  }

  // For the premium UI, we'll duplicate the main image to mock a gallery 
  // (until you add an images array to your MongoDB schema later!)
  const thumbnails = [product.img, product.img, product.img];

  return (
    <main className="pt-32 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* BREADCRUMBS */}
        <ScrollReveal className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-8">
          <Link to="/" className="hover:text-primary-container flex items-center transition-colors">
            <span className="material-symbols-outlined text-[16px] mr-1">home</span> HOME
          </Link>
          <span>/</span>
          <Link to="/store" className="hover:text-primary-container transition-colors">{product.category || "STORE"}</Link>
          <span>/</span>
          <span className="text-zinc-800 truncate max-w-[200px]">{product.title}</span>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="w-full lg:w-1/2 flex flex-col gap-5">
            <ScrollReveal delay={50} className="w-full aspect-square card-surface rounded-[3rem] overflow-hidden flex items-center justify-center p-8 relative hover:-translate-y-1 transition-transform duration-500">
              <img src={activeImage} alt={product.title} className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" />
              {product.tag && (
                <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md border border-red-400">
                  {product.tag}
                </div>
              )}
              <button className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-soft text-zinc-400 hover:text-red-500 hover:scale-110 transition-all border border-white">
                 <span className="material-symbols-outlined text-[24px]">favorite</span>
              </button>
            </ScrollReveal>

            {/* Thumbnails */}
            <ScrollReveal delay={100} className="grid grid-cols-3 gap-5">
              {thumbnails.map((thumb, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveImage(thumb)}
                  className={`aspect-square rounded-[1.5rem] overflow-hidden bg-white/50 backdrop-blur-sm border-2 transition-all duration-300 p-2 ${
                    activeImage === thumb ? 'border-primary-container shadow-soft scale-[1.02]' : 'border-white/60 hover:border-white hover:shadow-sm hover:-translate-y-1'
                  }`}
                >
                  <img src={thumb} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </ScrollReveal>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="w-full lg:w-1/2 flex flex-col pt-4">
            <ScrollReveal delay={150}>
              <h1 className="text-3xl md:text-5xl font-black text-on-surface leading-tight mb-4 tracking-tighter drop-shadow-sm">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="flex text-orange-400 drop-shadow-sm">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0.5" }}>star_half</span>
                </div>
                <span className="text-sm font-bold text-zinc-500 hover:text-primary-container cursor-pointer underline underline-offset-4 transition-colors">124 Reviews</span>
                <span className={`text-xs font-black px-2 py-1 rounded-md ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {product.countInStock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} className="card-surface p-8 rounded-[2.5rem] mb-8 hover:shadow-soft transition-shadow duration-300">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-5xl font-black text-red-600 tracking-tight">₹{product.price}</span>
                {product.oldPrice && <span className="text-zinc-400 line-through text-xl font-bold mb-1">₹{product.oldPrice}</span>}
                {product.discount && <span className="bg-red-100 text-red-700 font-black text-sm px-3 py-1 rounded-full mb-2 ml-2 border border-red-200 shadow-sm uppercase tracking-wider">{product.discount}</span>}
              </div>
              <div className="flex items-center gap-2 mt-6 pt-5 border-t border-white/50">
                <div className="bg-teal-50 text-teal-600 p-1 rounded-full shadow-inner border border-teal-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">stars</span>
                </div>
                <span className="text-teal-800 font-black text-[15px] tracking-wide">Club Member Price: ₹{product.clubPrice}</span>
                <Link to="/auth" className="text-xs font-bold text-zinc-500 hover:text-teal-600 underline ml-auto transition-colors">Join Club</Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <p className="text-zinc-600 font-medium text-lg leading-relaxed mb-10">
                {product.description}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300} className="flex flex-col sm:flex-row gap-5 mb-12">
              <div className="flex items-center justify-between card-surface rounded-full px-2 w-full sm:w-40 shrink-0 h-16">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center text-zinc-600 hover:text-black hover:bg-white shadow-sm font-bold text-2xl transition-all">-</button>
                <span className="font-black text-xl text-zinc-800">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))} className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center text-zinc-600 hover:text-black hover:bg-white shadow-sm font-bold text-2xl transition-all">+</button>
              </div>

              <button 
                disabled={product.countInStock === 0}
                className={`flex-1 h-16 rounded-full font-black text-xl flex items-center justify-center gap-3 transition-all ${
                  product.countInStock > 0 
                  ? 'bg-gradient-to-r from-primary-container to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:-translate-y-1 active:scale-95' 
                  : 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">{product.countInStock > 0 ? 'shopping_cart_checkout' : 'block'}</span> 
                {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </ScrollReveal>
            
            {/* ... (Keep the rest of your Accordion Details exactly the same) ... */}
            <ScrollReveal delay={350} className="space-y-4">
              <details className="group card-surface rounded-3xl overflow-hidden [&_summary::-webkit-details-marker]:hidden" open>
                <summary className="flex items-center justify-between font-black text-zinc-800 p-6 cursor-pointer outline-none">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-container">info</span>
                    Product Details
                  </div>
                  <span className="material-symbols-outlined transition-transform duration-300 group-open:-rotate-180 bg-white/50 rounded-full p-1 shadow-sm">expand_more</span>
                </summary>
                <div className="px-6 pb-6 pt-2 text-zinc-600 font-medium text-[15px] space-y-3 border-t border-white/40 mt-2">
                   <p><strong className="text-zinc-800 font-black">Category:</strong> {product.category}</p>
                   <p><strong className="text-zinc-800 font-black">Stock Remaining:</strong> {product.countInStock}</p>
                </div>
              </details>
            </ScrollReveal>
            
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;