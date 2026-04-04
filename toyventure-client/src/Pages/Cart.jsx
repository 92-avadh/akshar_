import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../features/cart/cartSlice';
import ScrollReveal from '../components/ScrollReveal.jsx';

const Cart = () => {
  // 1. Pull real items from Redux
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // 2. Dispatch helpers
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'TOY15') {
      setDiscount(0.15); // 15% discount
    } else {
      alert('Invalid promo code. Try TOY15');
      setDiscount(0);
    }
  };

  // 3. Real Calculations based on Redux array
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 99; // Free shipping over ₹2000
  const discountAmount = subtotal * discount;
  const total = subtotal + shipping - discountAmount;

  return (
    <main className="pt-32 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        <ScrollReveal className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-8">
          <Link to="/" className="hover:text-primary-container flex items-center transition-colors">
            <span className="material-symbols-outlined text-[16px] mr-1">home</span> HOME
          </Link>
          <span>/</span>
          <span className="text-zinc-800">SHOPPING CART</span>
        </ScrollReveal>

        <ScrollReveal delay={50}>
          <h1 className="text-4xl md:text-5xl font-black text-on-surface mb-10 tracking-tighter drop-shadow-sm">Your Cart</h1>
        </ScrollReveal>

        {cartItems.length === 0 ? (
          <ScrollReveal delay={100} className="text-center py-24 card-surface rounded-[3rem] border border-white/50 shadow-soft">
            <div className="w-24 h-24 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-white">
              <span className="material-symbols-outlined text-5xl text-zinc-300">production_quantity_limits</span>
            </div>
            <h2 className="text-3xl font-black text-zinc-800 mb-3 tracking-tight">Your cart is empty!</h2>
            <p className="text-zinc-500 font-medium mb-8 text-lg">Looks like you haven't added any magical toys yet.</p>
            <Link to="/shop" className="inline-block px-10 py-4 bg-gradient-to-r from-primary-container to-orange-600 text-white font-black rounded-full hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 active:scale-95 transition-all">
              Continue Shopping
            </Link>
          </ScrollReveal>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* ================= LEFT: CART ITEMS ================= */}
            <div className="flex-1 flex flex-col gap-6">
              {cartItems.map((item, index) => (
                <ScrollReveal 
                  key={item._id} 
                  delay={index * 100} 
                  className="flex flex-col sm:flex-row gap-6 p-5 card-surface rounded-[2rem] hover:-translate-y-1 transition-all duration-300 group"
                >
                  
                  <button 
                    onClick={() => handleRemoveItem(item._id)}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-red-600 transition-all bg-white/50 p-2 rounded-full sm:bg-white/80 backdrop-blur-sm border border-transparent hover:border-red-200 hover:shadow-sm hover:scale-110 z-10"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>

                  <div className="w-full sm:w-36 h-36 bg-white/60 backdrop-blur-sm rounded-[1.5rem] overflow-hidden shrink-0 shadow-inner border border-white/80 p-2">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply rounded-xl group-hover:scale-105 transition-transform duration-500" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      {item.tag && <span className="bg-primary-fixed text-primary-container px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider mb-2 inline-block border border-orange-200/50">{item.tag}</span>}
                      <h3 className="font-bold text-zinc-800 text-xl leading-snug pr-10 mb-2 group-hover:text-primary-container transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-red-600 font-black text-2xl tracking-tight">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 sm:mt-0 pt-3 border-t border-white/50">
                      <div className="flex items-center justify-between bg-white/80 rounded-full px-1 w-32 h-12 border border-white shadow-sm">
                        <button 
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                          className="w-10 h-10 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-600 hover:text-black font-black text-xl transition-colors"
                        >
                          -
                        </button>
                        <span className="font-black text-base text-zinc-800">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          className="w-10 h-10 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-600 hover:text-black font-black text-xl transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-zinc-600 font-bold text-sm bg-white/50 px-4 py-2 rounded-full border border-white">
                        Total: <span className="text-zinc-800 font-black">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* ================= RIGHT: ORDER SUMMARY ================= */}
            <ScrollReveal delay={300} className="w-full lg:w-[400px] shrink-0">
              <div className="card-surface rounded-[2.5rem] p-8 sticky top-32 hover:shadow-soft transition-shadow duration-300">
                <h3 className="font-black text-2xl text-on-surface mb-6 drop-shadow-sm">Order Summary</h3>
                
                <div className="space-y-4 text-zinc-600 font-medium text-[15px] mb-6 border-b border-white/50 pb-6">
                  <div className="flex justify-between items-center">
                    <span>Subtotal <span className="text-xs font-bold text-zinc-400 bg-white px-2 py-0.5 rounded-full ml-1 border border-zinc-100">{cartItems.reduce((acc, item) => acc + item.quantity, 0)} items</span></span>
                    <span className="font-black text-zinc-800 text-lg">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping estimate</span>
                    <span className="font-black text-zinc-800">{shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-green-600 bg-green-50 p-3 rounded-2xl border border-green-100 shadow-inner">
                      <span className="font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">local_offer</span> Discount ({discount * 100}%)</span>
                      <span className="font-black">-₹{discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleApplyPromo} className="flex gap-2 mb-8">
                  <input 
                    type="text" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (Try TOY15)" 
                    className="flex-1 bg-white/60 backdrop-blur-sm border border-white rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-primary-container/20 outline-none uppercase shadow-inner placeholder:text-zinc-400 transition-all"
                  />
                  <button type="submit" className="bg-zinc-800 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-black transition-colors shadow-md hover:-translate-y-0.5">
                    Apply
                  </button>
                </form>

                <div className="mb-8">
                  <div className="flex justify-between items-end">
                    <span className="font-black text-zinc-800 text-xl">Total</span>
                    <div className="text-right">
                      <span className="text-[11px] text-zinc-500 block font-bold mb-1 uppercase tracking-wider">Including GST</span>
                      <span className="font-black text-4xl text-red-600 tracking-tighter drop-shadow-sm">₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </div>

                <Link to="/checkout" className="w-full py-4 bg-gradient-to-r from-primary-container to-orange-600 text-white font-black text-lg rounded-2xl hover:shadow-lg hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95">
                  Proceed to Checkout <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>

              </div>
            </ScrollReveal>

          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;