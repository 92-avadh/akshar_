import React, { useState } from 'react';

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
    <main className="pt-32 pb-24 max-w-[1440px] mx-auto px-6 min-h-screen">
      
      {/* ================= BREADCRUMBS ================= */}
      <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-8">
        <a href="/" className="hover:text-primary-container flex items-center">
          <span className="material-symbols-outlined text-[16px] mr-1">home</span> HOME
        </a>
        <span>/</span>
        <a href="/cart" className="hover:text-primary-container">CART</a>
        <span>/</span>
        <span className="text-zinc-800">CHECKOUT</span>
      </div>

      <h1 className="text-4xl md:text-5xl font-black text-on-surface mb-10 tracking-tighter">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        
        {/* ================= LEFT: FORMS ================= */}
        <div className="flex-1 flex flex-col gap-10">
          
          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-black text-zinc-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">contact_mail</span> Contact Information
            </h2>
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-surface-variant shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1.5">Email Address *</label>
                <input type="email" required placeholder="magic@toyventure.com" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none transition-all" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer group mt-2">
                <input type="checkbox" className="w-4 h-4 rounded text-primary-container focus:ring-primary-container border-zinc-300 cursor-pointer" defaultChecked />
                <span className="text-sm font-medium text-zinc-600 group-hover:text-primary-container transition-colors">Email me with news and offers</span>
              </label>
            </div>
          </section>

          {/* Shipping Address */}
          <section>
            <h2 className="text-xl font-black text-zinc-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">local_shipping</span> Shipping Address
            </h2>
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-surface-variant shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-zinc-700 mb-1.5">Country/Region</label>
                <select className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold text-zinc-800 focus:ring-2 focus:ring-primary-container outline-none transition-all cursor-pointer">
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1.5">First Name *</label>
                <input type="text" required placeholder="First Name" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1.5">Last Name *</label>
                <input type="text" required placeholder="Last Name" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none transition-all" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-zinc-700 mb-1.5">Address *</label>
                <input type="text" required placeholder="House number, Street name" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none transition-all" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-zinc-700 mb-1.5">Apartment, suite, etc. (optional)</label>
                <input type="text" placeholder="Apartment, suite, etc." className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1.5">City *</label>
                <input type="text" required placeholder="City" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none transition-all" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-zinc-700 mb-1.5">State *</label>
                  <select className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none transition-all cursor-pointer">
                    <option>Gujarat</option>
                    <option>Maharashtra</option>
                    <option>Delhi</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-zinc-700 mb-1.5">PIN Code *</label>
                  <input type="text" required placeholder="PIN" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none transition-all" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-zinc-700 mb-1.5">Phone Number *</label>
                <input type="tel" required placeholder="For delivery updates" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none transition-all" />
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section>
            <h2 className="text-xl font-black text-zinc-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">payments</span> Payment
            </h2>
            <div className="bg-white rounded-3xl border border-surface-variant shadow-sm overflow-hidden">
              
              {/* Credit Card Option */}
              <div 
                className={`p-5 border-b border-zinc-100 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'bg-orange-50/30' : 'hover:bg-zinc-50'}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary-container' : 'border-zinc-300'}`}>
                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-primary-container rounded-full"></div>}
                  </div>
                  <span className="font-bold text-zinc-800">Credit / Debit Card</span>
                  <div className="ml-auto flex gap-1">
                    <span className="material-symbols-outlined text-zinc-400">credit_card</span>
                  </div>
                </div>
                {/* Expandable Card Form */}
                {paymentMethod === 'card' && (
                  <div className="mt-4 pt-4 border-t border-zinc-200 space-y-4 animate-[fadeIn_0.3s_ease-out]">
                    <input type="text" placeholder="Card Number" className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none" />
                    <div className="flex gap-4">
                      <input type="text" placeholder="MM/YY" className="flex-1 bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none" />
                      <input type="text" placeholder="CVV" className="flex-1 bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none" />
                    </div>
                    <input type="text" placeholder="Name on Card" className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none" />
                  </div>
                )}
              </div>

              {/* UPI Option */}
              <div 
                className={`p-5 border-b border-zinc-100 cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'bg-orange-50/30' : 'hover:bg-zinc-50'}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-primary-container' : 'border-zinc-300'}`}>
                    {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-primary-container rounded-full"></div>}
                  </div>
                  <span className="font-bold text-zinc-800">UPI (Google Pay, PhonePe, etc.)</span>
                </div>
                {paymentMethod === 'upi' && (
                  <div className="mt-4 pt-4 border-t border-zinc-200 animate-[fadeIn_0.3s_ease-out]">
                     <p className="text-sm text-zinc-500 mb-3">Enter your UPI ID. We will send a payment request to your UPI app.</p>
                     <input type="text" placeholder="user@upi" className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none" />
                  </div>
                )}
              </div>

              {/* COD Option */}
              <div 
                className={`p-5 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'bg-orange-50/30' : 'hover:bg-zinc-50'}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary-container' : 'border-zinc-300'}`}>
                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-primary-container rounded-full"></div>}
                  </div>
                  <span className="font-bold text-zinc-800">Cash on Delivery (COD)</span>
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* ================= RIGHT: ORDER SUMMARY ================= */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-surface-container-lowest border border-surface-variant rounded-3xl p-8 sticky top-32 shadow-lg shadow-purple-900/5">
            <h3 className="font-black text-xl text-on-surface mb-6">Order Summary</h3>
            
            {/* Items List */}
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-zinc-100 rounded-xl overflow-hidden shrink-0 relative border border-zinc-200">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                    <span className="absolute -top-2 -right-2 bg-zinc-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{item.quantity}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-zinc-800 line-clamp-2 leading-tight">{item.title}</h4>
                    <span className="text-sm font-black text-red-600">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 pt-6 space-y-4 text-zinc-600 font-medium text-sm mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-800">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-zinc-800">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-black text-zinc-800 text-lg">Total</span>
                <div className="text-right">
                  <span className="text-xs text-zinc-500 block font-medium mb-1">INR</span>
                  <span className="font-black text-3xl text-red-600 tracking-tight">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-primary-container text-white font-black text-lg rounded-xl hover:bg-orange-600 hover:shadow-lg transition-all flex items-center justify-center gap-2">
              Place Order <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </button>

            <div className="mt-6 flex flex-col items-center gap-2">
              <p className="text-center text-xs font-bold text-zinc-400 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span> Secure 256-bit SSL Encryption
              </p>
              <div className="flex items-center gap-2 opacity-40">
                <span className="material-symbols-outlined text-2xl">credit_card</span>
                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                <span className="material-symbols-outlined text-2xl">assured_workload</span>
              </div>
            </div>

          </div>
        </div>

      </form>
    </main>
  );
};

export default Checkout;