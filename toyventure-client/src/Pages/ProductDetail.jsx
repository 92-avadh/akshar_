import React, { useState } from 'react';

const ProductDetail = () => {
  // State for a simple image gallery and quantity selector
  const [activeImage, setActiveImage] = useState("https://images.unsplash.com/photo-1594787317666-41793740284e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80");
  const [quantity, setQuantity] = useState(1);

  const thumbnails = [
    "https://images.unsplash.com/photo-1594787317666-41793740284e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  ];

  return (
    <main className="pt-32 pb-24 max-w-[1440px] mx-auto px-6 min-h-screen">
      
      {/* ================= BREADCRUMBS ================= */}
      <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-8">
        <a href="/" className="hover:text-primary-container flex items-center">
          <span className="material-symbols-outlined text-[16px] mr-1">home</span> HOME
        </a>
        <span>/</span>
        <a href="/shop" className="hover:text-primary-container">METAL CARS</a>
        <span>/</span>
        <span className="text-zinc-800">G PATTON DIE-CAST SUV</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* ================= LEFT: IMAGE GALLERY ================= */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {/* Main Image */}
          <div className="w-full aspect-square bg-zinc-50 rounded-[2.5rem] overflow-hidden border border-black/5 flex items-center justify-center p-8 relative shadow-inner">
            <img 
              src={activeImage} 
              alt="Main Product" 
              className="w-full h-full object-contain mix-blend-multiply"
            />
            <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
              Best Seller
            </div>
            <button className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-zinc-400 hover:text-red-500 transition-colors">
               <span className="material-symbols-outlined text-[24px]">favorite</span>
            </button>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-3 gap-4">
            {thumbnails.map((thumb, index) => (
              <button 
                key={index} 
                onClick={() => setActiveImage(thumb)}
                className={`aspect-square rounded-2xl overflow-hidden bg-zinc-50 border-2 transition-all p-2 ${activeImage === thumb ? 'border-primary-container shadow-md' : 'border-transparent hover:border-zinc-300'}`}
              >
                <img src={thumb} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
              </button>
            ))}
          </div>
        </div>

        {/* ================= RIGHT: PRODUCT INFO ================= */}
        <div className="w-full lg:w-1/2 flex flex-col">
          
          {/* Title & Ratings */}
          <h1 className="text-3xl md:text-5xl font-black text-on-surface leading-tight mb-4 tracking-tighter">
            G Patton Die-Cast Off-Road SUV Toy Car with Lights & Sounds
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-orange-400">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0.5" }}>star_half</span>
            </div>
            <span className="text-sm font-bold text-zinc-500 hover:text-primary-container cursor-pointer underline underline-offset-4">124 Reviews</span>
          </div>

          {/* Price Block */}
          <div className="bg-surface-container-lowest border border-surface-variant p-6 rounded-3xl mb-8 shadow-sm">
            <div className="flex items-end gap-3 mb-2">
              <span className="text-4xl font-black text-red-600 tracking-tight">₹1,199.00</span>
              <span className="text-zinc-400 line-through text-lg font-medium mb-1">₹1,999.00</span>
              <span className="bg-green-100 text-green-700 font-black text-sm px-3 py-1 rounded-full mb-1 border border-green-200">40% OFF</span>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-100">
              <span className="material-symbols-outlined text-teal-600">stars</span>
              <span className="text-teal-800 font-black text-sm tracking-wide">Club Member Price: ₹1,139.00</span>
              <a href="/club" className="text-xs font-bold text-zinc-400 hover:text-teal-600 underline ml-auto">Join Club</a>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-zinc-600 font-medium text-lg leading-relaxed mb-8">
            Built for rough terrains and endless imagination. This 1:32 scale G Patton SUV features openable doors, realistic engine sounds, working headlights, and a powerful pull-back action mechanism.
          </p>

          {/* Add to Cart Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-zinc-100 rounded-full px-2 w-full sm:w-36 shrink-0 h-14 border border-zinc-200">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-zinc-600 hover:text-black shadow-sm font-bold text-xl"
              >
                -
              </button>
              <span className="font-black text-lg text-zinc-800">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-zinc-600 hover:text-black shadow-sm font-bold text-xl"
              >
                +
              </button>
            </div>

            {/* Cart Button */}
            <button className="flex-1 bg-primary-container text-white h-14 rounded-full font-black text-lg shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">shopping_cart</span> Add to Cart
            </button>
          </div>

          {/* Accordion Details (Static for layout template) */}
          <div className="border-t border-zinc-200">
            <details className="group cursor-pointer border-b border-zinc-200" open>
              <summary className="flex items-center justify-between font-black text-zinc-800 py-5 list-none">
                Product Details
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="pb-6 text-zinc-600 font-medium text-sm space-y-2">
                <p><strong className="text-zinc-800">Scale:</strong> 1:32</p>
                <p><strong className="text-zinc-800">Material:</strong> Die-cast Metal Body, Plastic Interior, Rubber Tires</p>
                <p><strong className="text-zinc-800">Features:</strong> Pull-back action, Openable doors, hood and tailgate, Lights & Sounds.</p>
                <p><strong className="text-zinc-800">Recommended Age:</strong> 8+ Years</p>
              </div>
            </details>
            
            <details className="group cursor-pointer border-b border-zinc-200">
              <summary className="flex items-center justify-between font-black text-zinc-800 py-5 list-none">
                Delivery & Returns
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="pb-6 text-zinc-600 font-medium text-sm">
                Standard delivery takes 3-5 business days. We offer a 30-day hassle-free return policy if the product is unused and in its original packaging.
              </div>
            </details>
          </div>

        </div>
      </div>
    </main>
  );
};

export default ProductDetail;