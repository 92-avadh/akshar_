import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductByIdQuery, useGetProductsQuery } from '../features/api/apiSlice';
import { toggleFavorite } from '../features/wishlist/wishlistSlice'; // NEW IMPORT
// import { addToCart } from '../features/cart/cartSlice'; 

const ProductDetail = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();

  const { data: product, isLoading, error } = useGetProductByIdQuery(id);
  const { data: allProducts } = useGetProductsQuery();
  
  // NEW STATE
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-16 h-16 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <h2 className="text-2xl font-bold text-red-500">Product not found!</h2>
      </div>
    );
  }

  const handleAddToCart = () => {
    alert(`${product.title} added to cart!`);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const suggestedProducts = allProducts ? allProducts.filter(item => item._id !== id).slice(0, 4) : [];
  
  // Check if current page's product is favorited
  const isMainProductFavorited = wishlistItems.some(w => w._id === product._id);

  return (
    <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/95 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <button onClick={() => setIsImageModalOpen(false)} className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
          <img src={product.img} alt={product.title} className="max-w-[90%] max-h-[90vh] object-contain rounded-3xl shadow-2xl animate-[zoomIn_0.3s_ease-out]" />
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-8">
          <Link to="/" className="hover:text-primary-container transition-colors">HOME</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary-container transition-colors">SHOP</Link>
          <span>/</span>
          <span className="text-zinc-800 line-clamp-1">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          
          {/* Magnifier Image */}
          <div className="relative group">
            <div 
              className="w-full aspect-square card-surface rounded-[3rem] p-8 flex items-center justify-center shadow-soft relative overflow-hidden cursor-crosshair"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setIsImageModalOpen(true)}
            >
                <img 
                    src={product.img} 
                    alt={product.title} 
                    className={`w-full h-full object-cover mix-blend-multiply transition-transform duration-100 ease-linear ${isZooming ? 'scale-[2.5]' : 'scale-100'}`}
                    style={{ transformOrigin: isZooming ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center' }}
                />
                <div className={`absolute bottom-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-zinc-800 shadow-sm flex items-center gap-2 transition-all duration-300 ${isZooming ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                    <span className="material-symbols-outlined text-[16px]">zoom_in</span> Hover to zoom, click to expand
                </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-black text-zinc-800 tracking-tight leading-tight mb-4">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white">
              <span className="text-4xl font-black text-primary-container">₹{product.price}</span>
              {product.oldPrice && <span className="text-xl font-bold text-zinc-400 line-through">₹{product.oldPrice}</span>}
            </div>

            <p className="text-zinc-600 font-medium leading-relaxed mb-8 text-lg">
              {product.description || "Bring home the magic with this incredible toy! Carefully crafted to spark imagination and provide hours of endless fun."}
            </p>

            {/* Action Buttons Row */}
            <div className="flex gap-4">
                <button 
                onClick={handleAddToCart}
                className="flex-1 py-5 bg-zinc-900 text-white font-black text-xl rounded-[2rem] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 active:scale-95 group"
                >
                Add to Cart 
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">shopping_cart_checkout</span>
                </button>

                {/* ========================================== */}
                {/* NEW: LARGE FAVORITE BUTTON */}
                {/* ========================================== */}
                <button 
                  onClick={() => dispatch(toggleFavorite(product))}
                  className={`w-20 rounded-[2rem] border-2 transition-all flex items-center justify-center hover:-translate-y-1 active:scale-95 shadow-md ${
                      isMainProductFavorited 
                      ? 'border-red-500 bg-red-50 text-red-500' 
                      : 'border-white bg-white/60 text-zinc-400 hover:border-red-200 hover:text-red-400'
                  }`}
                  title="Add to Wishlist"
                >
                  <span className={`material-symbols-outlined text-[32px] ${isMainProductFavorited ? 'filled' : ''}`}>favorite</span>
                </button>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white text-zinc-500 text-sm font-bold">
                <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">local_shipping</span> Free Shipping</div>
                <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">replay</span> 7-Day Returns</div>
                <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">verified</span> Quality Tested</div>
            </div>
          </div>
        </div>

        {/* SUGGESTED PRODUCTS */}
        {suggestedProducts.length > 0 && (
          <div className="mt-24">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-zinc-800">You Might Also Like</h2>
                <Link to="/shop" className="text-primary-container font-bold hover:underline flex items-center gap-1">
                    View All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {suggestedProducts.map((item) => {
                const isFavorited = wishlistItems.some((wItem) => wItem._id === item._id);

                return (
                  <Link to={`/product/${item._id}`} key={item._id} className="flex flex-col group cursor-pointer relative card-surface p-4 rounded-[2rem] hover:-translate-y-2 transition-all duration-300">
                    
                    {/* Tiny Favorite Button on Suggestions */}
                    <button 
                      onClick={(e) => { e.preventDefault(); dispatch(toggleFavorite(item)); }}
                      className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    >
                      <span className={`material-symbols-outlined text-[16px] ${isFavorited ? 'text-red-500 filled' : 'text-zinc-400 hover:text-red-400'}`}>favorite</span>
                    </button>

                    <div className="w-full aspect-[4/3] bg-white/50 rounded-[1.5rem] overflow-hidden relative mb-5 shadow-inner border border-white/60">
                      <img alt={item.title} src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" />
                    </div>
                    <div className="px-2">
                      <h3 className="font-bold text-zinc-800 text-[15px] leading-snug group-hover:text-primary-container transition-colors line-clamp-1 mb-2">
                        {item.title}
                      </h3>
                      <span className="text-zinc-800 font-black text-lg">₹{item.price}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

export default ProductDetail;