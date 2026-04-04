import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Make sure this is here!

const Cart = () => {
  // Initial dummy state for the cart items
  const [cartItems, setCartItems] = useState([
    { 
      id: 1, 
      title: "G Patton Die-Cast Off-Road SUV Toy Car", 
      price: 1199, 
      quantity: 1, 
      img: "https://images.unsplash.com/photo-1594787317666-41793740284e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      tag: "Diecast"
    },
    { 
      id: 2, 
      title: "Educational Building Blocks Set", 
      price: 1199, 
      quantity: 2, 
      img: "https://images.unsplash.com/photo-1555448248-2571daf6344b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      tag: "STEM"
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Helper functions for cart logic
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items => 
      items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    // Simple dummy promo logic
    if (promoCode.toUpperCase() === 'TOY15') {
      setDiscount(0.15); // 15% discount
    } else {
      alert('Invalid promo code. Try TOY15');
      setDiscount(0);
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 99; // Free shipping over ₹2000
  const discountAmount = subtotal * discount;
  const total = subtotal + shipping - discountAmount;

  return (
    <main className="pt-32 pb-24 max-w-[1440px] mx-auto px-6 min-h-screen">
      
      {/* ================= BREADCRUMBS ================= */}
      <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-8">
        <Link to="/" className="hover:text-primary-container flex items-center">
          <span className="material-symbols-outlined text-[16px] mr-1">home</span> HOME
        </Link>
        <span>/</span>
        <span className="text-zinc-800">SHOPPING CART</span>
      </div>

      <h1 className="text-4xl md:text-5xl font-black text-on-surface mb-10 tracking-tighter">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low rounded-3xl border border-surface-variant">
          <span className="material-symbols-outlined text-6xl text-zinc-300 mb-4">production_quantity_limits</span>
          <h2 className="text-2xl font-black text-zinc-700 mb-2">Your cart is empty!</h2>
          <p className="text-zinc-500 mb-6">Looks like you haven't added any magical toys yet.</p>
          <Link to="/shop" className="inline-block px-8 py-3 bg-primary-container text-white font-black rounded-full hover:bg-orange-600 transition-colors shadow-lg">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* ================= LEFT: CART ITEMS ================= */}
          <div className="flex-1 flex flex-col gap-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-3xl border border-surface-variant/50 shadow-sm relative group">
                
                {/* Remove Button */}
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors bg-zinc-50 p-2 rounded-full sm:bg-transparent sm:p-0"
                  aria-label="Remove item"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>

                {/* Item Image */}
                <div className="w-full sm:w-32 h-32 bg-zinc-100 rounded-2xl overflow-hidden shrink-0">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                </div>

                {/* Item Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 block">{item.tag}</span>
                    <h3 className="font-bold text-zinc-800 text-lg leading-snug pr-8 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-red-600 font-black text-xl">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-6 mt-4 sm:mt-0">
                    <div className="flex items-center justify-between bg-zinc-100 rounded-full px-1 w-28 h-10 border border-zinc-200">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-zinc-600 hover:text-black shadow-sm font-bold"
                      >
                        -
                      </button>
                      <span className="font-black text-sm text-zinc-800">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-zinc-600 hover:text-black shadow-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-zinc-500 font-bold text-sm ml-auto sm:ml-0">
                      Total: ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================= RIGHT: ORDER SUMMARY ================= */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-surface-container-lowest border border-surface-variant rounded-3xl p-8 sticky top-32 shadow-lg shadow-purple-900/5">
              <h3 className="font-black text-xl text-on-surface mb-6">Order Summary</h3>
              
              <div className="space-y-4 text-zinc-600 font-medium text-sm mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span className="font-bold text-zinc-800">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping estimate</span>
                  <span className="font-bold text-zinc-800">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount * 100}%)</span>
                    <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                )}
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code (Try TOY15)" 
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none uppercase"
                />
                <button type="submit" className="bg-zinc-800 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-black transition-colors">
                  Apply
                </button>
              </form>

              <div className="border-t border-zinc-200 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-black text-zinc-800">Total</span>
                  <div className="text-right">
                    <span className="text-xs text-zinc-500 block font-medium mb-1">Including GST</span>
                    <span className="font-black text-3xl text-red-600 tracking-tight">₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>

              {/* THIS IS THE UPDATED ROUTER LINK */}
              <Link to="/checkout" className="w-full py-4 bg-primary-container text-white font-black text-lg rounded-xl hover:bg-orange-600 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                Proceed to Checkout <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>

              <p className="text-center text-xs font-bold text-zinc-400 mt-4 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span> Secure SSL Checkout
              </p>
            </div>
          </div>

        </div>
      )}
    </main>
  );
};

export default Cart;