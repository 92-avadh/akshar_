import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal.jsx';

const Checkout = () => {
  // Dummy data passed from the Cart
  const cartItems = [
    { 
      id: 1, 
      title: "G Patton Die-Cast Off-Road SUV Toy Car", 
      price: 1199, 
      quantity: 1, 
      img: "https://images.unsplash.com/photo-1594787317666-41793740284e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    { 
      id: 2, 
      title: "Educational Building Blocks Set", 
      price: 1199, 
      quantity: 2, 
      img: "https://images.unsplash.com/photo-1555448248-2571daf6344b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    }
  ];

  const [paymentMethod, setPaymentMethod] = useState('card');

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 99;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    alert("Order Placed Successfully! (This is a template)");
    // In a real app, this would submit the form data to your Express backend
  };

  return (
    <main className="pt-32 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      
      {/* Background Doodle overlay */}
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* ================= BREADCRUMBS ================= */}
        <ScrollReveal className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-8">
          <Link to="/" className="hover:text-primary-container flex items-center transition-colors">
            <span className="material-symbols-outlined text-[16px] mr-1">home</span> HOME
          </Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-primary-container transition-colors">CART</Link>
          <span>/</span>
          <span className="text-zinc-800">CHECKOUT</span>
        </ScrollReveal>

        <ScrollReveal delay={50}>
          <h1 className="text-4xl md:text-5xl font-black text-on-surface mb-10 tracking-tighter drop-shadow-sm">Checkout</h1>
        </ScrollReveal>

        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* ================= LEFT: FORMS ================= */}
          <div className="flex-1 flex flex-col gap-10">
            
            {/* Contact Information */}
            <ScrollReveal delay={100} as="section">
              <h2 className="text-2xl font-black text-zinc-800 mb-5 flex items-center gap-3 drop-shadow-sm">
                <div className="bg-white/80 p-2 rounded-full shadow-sm border border-white flex items-center justify-center">
                   <span className="material-symbols-outlined text-primary-container">contact_mail</span>
                </div>
                Contact Information
              </h2>
              <div className="card-surface p-6 md:p-8 rounded-[2rem] space-y-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1.5 ml-1">Email Address *</label>
                  <input type="email" required placeholder="magic@toyventure.com" className="w-full bg-white/60 backdrop-blur-sm border border-white rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner" />
                </div>
                <label className="flex items-center gap-3 cursor-pointer group mt-4 ml-1">
                  <input type="checkbox" className="w-5 h-5 rounded text-primary-container focus:ring-primary-container border-white shadow-sm cursor-pointer" defaultChecked />
                  <span className="text-sm font-medium text-zinc-700 group-hover:text-primary-container transition-colors">Email me with news and offers</span>
                </label>
              </div>
            </ScrollReveal>

            {/* Shipping Address */}
            <ScrollReveal delay={150} as="section">
              <h2 className="text-2xl font-black text-zinc-800 mb-5 flex items-center gap-3 drop-shadow-sm">
                <div className="bg-white/80 p-2 rounded-full shadow-sm border border-white flex items-center justify-center">
                   <span className="material-symbols-outlined text-primary-container">local_shipping</span> 
                </div>
                Shipping Address
              </h2>
              <div className="card-surface p-6 md:p-8 rounded-[2.5rem] grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-zinc-700 mb-1.5 ml-1">Country/Region</label>
                  <select className="w-full bg-white/60 backdrop-blur-sm border border-white rounded-xl px-4 py-3.5 text-sm font-bold text-zinc-800 focus:ring-4 focus:ring-primary-container/20 outline-none transition-all cursor-pointer shadow-inner">
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1.5 ml-1">First Name *</label>
                  <input type="text" required placeholder="First Name" className="w-full bg-white/60 backdrop-blur-sm border border-white rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1.5 ml-1">Last Name *</label>
                  <input type="text" required placeholder="Last Name" className="w-full bg-white/60 backdrop-blur-sm border border-white rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-zinc-700 mb-1.5 ml-1">Address *</label>
                  <input type="text" required placeholder="House number, Street name" className="w-full bg-white/60 backdrop-blur-sm border border-white rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-zinc-700 mb-1.5 ml-1">Apartment, suite, etc. (optional)</label>
                  <input type="text" placeholder="Apartment, suite, etc." className="w-full bg-white/60 backdrop-blur-sm border border-white rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1.5 ml-1">City *</label>
                  <input type="text" required placeholder="City" className="w-full bg-white/60 backdrop-blur-sm border border-white rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5 ml-1">State *</label>
                    <select className="w-full bg-white/60 backdrop-blur-sm border border-white rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-4 focus:ring-primary-container/20 outline-none transition-all cursor-pointer shadow-inner">
                      <option>Gujarat</option>
                      <option>Maharashtra</option>
                      <option>Delhi</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5 ml-1">PIN Code *</label>
                    <input type="text" required placeholder="PIN" className="w-full bg-white/60 backdrop-blur-sm border border-white rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-zinc-700 mb-1.5 ml-1">Phone Number *</label>
                  <input type="tel" required placeholder="For delivery updates" className="w-full bg-white/60 backdrop-blur-sm border border-white rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner" />
                </div>
              </div>
            </ScrollReveal>

            {/* Payment Method */}
            <ScrollReveal delay={200} as="section">
              <h2 className="text-2xl font-black text-zinc-800 mb-5 flex items-center gap-3 drop-shadow-sm">
                <div className="bg-white/80 p-2 rounded-full shadow-sm border border-white flex items-center justify-center">
                   <span className="material-symbols-outlined text-primary-container">payments</span> 
                </div>
                Payment
              </h2>
              <div className="card-surface rounded-[2.5rem] overflow-hidden shadow-soft">
                
                {/* Credit Card Option */}
                <div 
                  className={`p-6 border-b border-white/50 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'bg-primary-container/5' : 'hover:bg-white/50'}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-inner ${paymentMethod === 'card' ? 'border-primary-container bg-white' : 'border-zinc-300 bg-white/50'}`}>
                      {paymentMethod === 'card' && <div className="w-3 h-3 bg-primary-container rounded-full"></div>}
                    </div>
                    <span className="font-bold text-zinc-800 text-lg">Credit / Debit Card</span>
                    <div className="ml-auto flex gap-1">
                      <span className="material-symbols-outlined text-zinc-400">credit_card</span>
                    </div>
                  </div>
                  {/* Expandable Card Form */}
                  {paymentMethod === 'card' && (
                    <div className="mt-5 pt-5 border-t border-white/60 space-y-4 animate-[fadeIn_0.3s_ease-out]">
                      <input type="text" placeholder="Card Number" className="w-full bg-white/80 border border-white rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-primary-container/20 outline-none shadow-inner" />
                      <div className="flex gap-4">
                        <input type="text" placeholder="MM/YY" className="flex-1 bg-white/80 border border-white rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-primary-container/20 outline-none shadow-inner" />
                        <input type="text" placeholder="CVV" className="flex-1 bg-white/80 border border-white rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-primary-container/20 outline-none shadow-inner" />
                      </div>
                      <input type="text" placeholder="Name on Card" className="w-full bg-white/80 border border-white rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-primary-container/20 outline-none shadow-inner" />
                    </div>
                  )}
                </div>

                {/* UPI Option */}
                <div 
                  className={`p-6 border-b border-white/50 cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'bg-primary-container/5' : 'hover:bg-white/50'}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-inner ${paymentMethod === 'upi' ? 'border-primary-container bg-white' : 'border-zinc-300 bg-white/50'}`}>
                      {paymentMethod === 'upi' && <div className="w-3 h-3 bg-primary-container rounded-full"></div>}
                    </div>
                    <span className="font-bold text-zinc-800 text-lg">UPI (Google Pay, PhonePe, etc.)</span>
                  </div>
                  {paymentMethod === 'upi' && (
                    <div className="mt-5 pt-5 border-t border-white/60 animate-[fadeIn_0.3s_ease-out]">
                       <p className="text-sm text-zinc-600 mb-3 ml-1 font-medium">Enter your UPI ID. We will send a payment request to your UPI app.</p>
                       <input type="text" placeholder="user@upi" className="w-full bg-white/80 border border-white rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-primary-container/20 outline-none shadow-inner" />
                    </div>
                  )}
                </div>

                {/* COD Option */}
                <div 
                  className={`p-6 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'bg-primary-container/5' : 'hover:bg-white/50'}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-inner ${paymentMethod === 'cod' ? 'border-primary-container bg-white' : 'border-zinc-300 bg-white/50'}`}>
                      {paymentMethod === 'cod' && <div className="w-3 h-3 bg-primary-container rounded-full"></div>}
                    </div>
                    <span className="font-bold text-zinc-800 text-lg">Cash on Delivery (COD)</span>
                  </div>
                </div>

              </div>
            </ScrollReveal>

          </div>

          {/* ================= RIGHT: ORDER SUMMARY ================= */}
          <ScrollReveal delay={300} className="w-full lg:w-[400px] shrink-0">
            <div className="card-surface rounded-[2.5rem] p-8 sticky top-32 hover:shadow-soft transition-shadow duration-300">
              <h3 className="font-black text-2xl text-on-surface mb-6 drop-shadow-sm">Order Summary</h3>
              
              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center p-2 bg-white/40 rounded-2xl border border-white/60 shadow-sm">
                    <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 relative border border-white">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                      <span className="absolute -top-1 -right-1 bg-zinc-700 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{item.quantity}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-zinc-800 line-clamp-2 leading-tight">{item.title}</h4>
                      <span className="text-sm font-black text-red-600">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/60 pt-6 space-y-4 text-zinc-600 font-medium text-[15px] mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-black text-zinc-800">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-black text-zinc-800">{shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping}`}</span>
                </div>
              </div>

              <div className="border-t border-white/60 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-black text-zinc-800 text-xl">Total</span>
                  <div className="text-right">
                    <span className="text-[11px] text-zinc-500 block font-bold mb-1 uppercase tracking-wider">Including GST</span>
                    <span className="font-black text-4xl text-red-600 tracking-tighter drop-shadow-sm">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-primary-container to-orange-600 text-white font-black text-lg rounded-2xl hover:shadow-lg hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95">
                Place Order <span className="material-symbols-outlined text-[20px]">check_circle</span>
              </button>

              <div className="mt-6 flex flex-col items-center gap-3">
                <p className="text-center text-xs font-bold text-zinc-500 flex items-center justify-center gap-1.5 bg-white/50 py-2 px-4 rounded-full border border-white">
                  <span className="material-symbols-outlined text-[16px] text-green-600">lock</span> Secure 256-bit SSL Encryption
                </p>
                <div className="flex items-center gap-3 opacity-30 mt-1">
                  <span className="material-symbols-outlined text-3xl">credit_card</span>
                  <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                  <span className="material-symbols-outlined text-3xl">assured_workload</span>
                </div>
              </div>

            </div>
          </ScrollReveal>

        </form>
      </div>
    </main>
  );
};

export default Checkout;