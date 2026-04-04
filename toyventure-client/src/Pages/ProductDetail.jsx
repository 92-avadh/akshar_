import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ScrollReveal from '../components/ScrollReveal.jsx';
import { useGetProductByIdQuery } from '../features/api/apiSlice.js';
import { addToCart } from '../features/cart/cartSlice.js';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);

  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) setActiveImage(product.img);
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28 pb-24 bg-surface">
        <div className="w-16 h-16 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-28 pb-24 bg-surface">
        <h2 className="text-3xl font-black text-zinc-800 mb-4">Toy Not Found</h2>
        <Link to="/shop" className="text-primary-container font-bold hover:underline">Go back to Store</Link>
      </div>
    );
  }

  const thumbnails = [product.img, product.img, product.img];

  const handleAddToCart = () => {
    // Convert string price (e.g., "1,199.00") to a real number for math calculation in the cart
    const numericPrice = parseFloat(product.price.replace(/,/g, ''));
    
    dispatch(addToCart({ 
      ...product, 
      price: numericPrice, 
      quantity 
    }));
    
    navigate('/cart');
  };

  return (
    <main className="pt-32 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        <ScrollReveal className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-8">
          <Link to="/" className="hover:text-primary-container flex items-center transition-colors">
            <span className="material-symbols-outlined text-[16px] mr-1">home</span> HOME
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary-container transition-colors">{product.category || "STORE"}</Link>
          <span>/</span>
          <span className="text-zinc-800 truncate max-w-[200px]">{product.title}</span>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          <div className="w-full lg:w-1/2 flex flex-col gap-5">
            <ScrollReveal delay={50} className="w-full aspect-square card-surface rounded-[3rem] overflow-hidden flex items-center justify-center p-8 relative hover:-translate-y-1 transition-transform duration-500">
              <img src={activeImage} alt={product.title} className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" />
              {product.tag && (
                <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md border border-red-400">
                  {product.tag}
                </div>
              )}
            </ScrollReveal>

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

          <div className="w-full lg:w-1/2 flex flex-col pt-4">
            <ScrollReveal delay={150}>
              <h1 className="text-3xl md:text-5xl font-black text-on-surface leading-tight mb-4 tracking-tighter drop-shadow-sm">
                {product.title}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200} className="card-surface p-8 rounded-[2.5rem] mb-8 hover:shadow-soft transition-shadow duration-300">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-5xl font-black text-red-600 tracking-tight">₹{product.price}</span>
                {product.oldPrice && <span className="text-zinc-400 line-through text-xl font-bold mb-1">₹{product.oldPrice}</span>}
                {product.discount && <span className="bg-red-100 text-red-700 font-black text-sm px-3 py-1 rounded-full mb-2 ml-2 border border-red-200 shadow-sm uppercase tracking-wider">{product.discount}</span>}
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

              {/* The magical functional Add to Cart button! */}
              <button 
                onClick={handleAddToCart}
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
            
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;