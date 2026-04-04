import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <-- 1. Import Link from React Router

const Navbar = () => {
  const [isShopOpen, setIsShopOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-xl shadow-purple-900/5 transition-all">
      <nav className="relative flex items-center justify-between px-6 py-4 max-w-[1440px] mx-auto">
        
        {/* Brand & Search */}
        <div className="flex items-center gap-8">
          {/* 2. Change <a> to <Link> for the logo */}
          <Link to="/" className="text-3xl font-black text-primary-container italic tracking-tighter">
            ToyVenture
          </Link>
          <div className="hidden lg:flex items-center relative group">
            <div className="absolute left-4 z-10 text-primary-container">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input className="pl-12 pr-6 py-2.5 w-72 xl:w-96 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary-container transition-all placeholder:text-zinc-400 font-medium text-sm shadow-inner" placeholder="Discover action figures, puzzles..." type="text"/>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm">
          {/* 3. Update all main nav links */}
          <Link to="/" className="font-bold text-zinc-700 hover:text-primary-container transition-colors">Home</Link>
          
          <button 
            onClick={() => setIsShopOpen(!isShopOpen)}
            className={`font-black flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full ${isShopOpen ? 'bg-primary-container text-white shadow-md' : 'text-zinc-700 hover:text-primary-container hover:bg-orange-50'}`}
          >
            Shop <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${isShopOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>
          
          {/* Link this specifically to the shop page we just built */}
          <Link to="/shop" className="font-bold text-zinc-700 hover:text-primary-container transition-colors">Metal Car</Link>
          <Link to="/shop" className="font-bold text-zinc-700 hover:text-primary-container transition-colors">Boys</Link>
          <Link to="/shop" className="font-bold text-zinc-700 hover:text-primary-container transition-colors">Girls</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* 4. Link the profile icon to your new Login page */}
          <Link to="/login" className="w-10 h-10 text-zinc-700 hover:bg-surface-container hover:text-primary-container rounded-full flex items-center justify-center transition-all">
            <span className="material-symbols-outlined">person</span>
          </Link>
          <button className="w-10 h-10 text-zinc-700 hover:bg-surface-container hover:text-primary-container rounded-full flex items-center justify-center transition-all">
            <span className="material-symbols-outlined">favorite</span>
          </button>
          {/* 5. Link the Cart icon to the Cart page */}
          <Link to="/cart" className="w-10 h-10 relative text-zinc-700 hover:bg-surface-container hover:text-primary-container rounded-full flex items-center justify-center transition-all">
            <span className="material-symbols-outlined">shopping_bag</span>
            <span className="absolute top-1 right-1 w-4 h-4 bg-secondary-container text-white text-[10px] flex items-center justify-center rounded-full font-black shadow-sm">3</span>
          </Link>
        </div>

        {/* Mega Menu Dropdown */}
        {isShopOpen && (
          <div className="absolute top-[100%] left-0 w-full bg-white/95 backdrop-blur-3xl shadow-2xl rounded-b-3xl border-t border-purple-100 p-8 animate-[fadeIn_0.2s_ease-out]">
            <div className="w-full max-w-[1440px] mx-auto flex gap-8">
              <div className="flex-1 grid grid-cols-5 gap-6 border-r border-zinc-100 pr-8">
                
                {/* Notice how I changed these to Link tags too! */}
                <div>
                  <h4 className="text-xs font-black text-tertiary uppercase tracking-widest mb-4">Shop By Age</h4>
                  <ul className="space-y-3">
                    {['0-18 Months', '18-36 Months', '3-5 Years', '5-7 Years', '7-9 Years', '9-12 Years', '14+ Years'].map((item) => (
                      <li key={item}><Link to="/shop" className="text-sm font-medium text-zinc-600 hover:text-primary-container hover:pl-1 transition-all block">{item}</Link></li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-xs font-black text-tertiary uppercase tracking-widest mb-4">Categories</h4>
                  <ul className="space-y-3">
                    {['Soft Toys', 'Doll Houses', 'Bath Toys', 'Musical Toys', 'Role Play', 'Die-cast Vehicles', 'Action Figures'].map((item) => (
                      <li key={item}><Link to="/shop" className="text-sm font-medium text-zinc-600 hover:text-primary-container hover:pl-1 transition-all block">{item}</Link></li>
                    ))}
                  </ul>
                </div>

                {/* You can do the same for the rest of the columns... */}
                <div>
                  <h4 className="text-xs font-black text-tertiary uppercase tracking-widest mb-4">Ride & Outdoor</h4>
                  <ul className="space-y-3">
                    {['Ride-On Toys', 'Tricycles', 'Swing Cars', 'Kick Scooters', 'Skating', 'Sports Gear'].map((item) => (
                      <li key={item}><Link to="/shop" className="text-sm font-medium text-zinc-600 hover:text-primary-container hover:pl-1 transition-all block">{item}</Link></li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-black text-tertiary uppercase tracking-widest mb-4">By Price</h4>
                  <ul className="space-y-3 mb-6">
                    {['Under ₹299', 'Under ₹499', 'Under ₹999', 'Premium Toys'].map((item) => (
                      <li key={item}><Link to="/shop" className="text-sm font-bold text-secondary-container hover:text-primary-container hover:pl-1 transition-all block">{item}</Link></li>
                    ))}
                  </ul>
                </div>

                <div>
                   <h4 className="text-xs font-black text-tertiary uppercase tracking-widest mb-4">Actions</h4>
                   <Link to="/shop" onClick={() => setIsShopOpen(false)} className="block text-center py-2 px-4 rounded-xl bg-primary-container text-sm font-bold text-white hover:bg-orange-600 transition-colors shadow-md">
                     View All Products
                   </Link>
                </div>

              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;