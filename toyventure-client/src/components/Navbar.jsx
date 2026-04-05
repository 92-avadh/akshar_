import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Grab counts from the Redux store
  const unseenFavorites = useSelector((state) => state.wishlist?.unseenCount || 0);
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const navigate = useNavigate();

  // AUTH LOGIC: Check if the user is currently logged in
  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsShopOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-xl shadow-purple-900/5 transition-all">
      <nav className="relative flex items-center justify-between px-6 py-4 max-w-[1440px] mx-auto">

        {/* Brand & Search */}
        <div className="flex items-center gap-8 flex-1">
          <Link to="/" className="text-3xl font-black text-primary-container italic tracking-tighter hover:scale-105 transition-transform">
            ToyVenture
          </Link>
          
          <form onSubmit={handleSearch} className="hidden md:flex relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Search for magical toys..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100/80 px-5 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-primary-container/20 text-sm font-medium text-zinc-800 placeholder:text-zinc-400 transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary-container">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
          </form>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 mx-8">
          <Link to="/" className="font-bold text-zinc-600 hover:text-primary-container transition-colors">Home</Link>
          <button 
            onClick={() => setIsShopOpen(!isShopOpen)} 
            className={`font-bold flex items-center gap-1 transition-colors ${isShopOpen ? 'text-primary-container' : 'text-zinc-600 hover:text-primary-container'}`}
          >
            Shop <span className={`material-symbols-outlined text-[18px] transition-transform ${isShopOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>
          <Link to="/about" className="font-bold text-zinc-600 hover:text-primary-container transition-colors">About Us</Link>
          <Link to="/contact" className="font-bold text-zinc-600 hover:text-primary-container transition-colors">Contact</Link>
        </div>

        {/* Icons & Actions */}
        <div className="flex items-center gap-4 md:gap-6 flex-1 justify-end">
          
          {/* Wishlist Icon */}
          <Link to="/favorites" className="relative text-zinc-600 hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined text-[28px]">favorite</span>
            {unseenFavorites > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {unseenFavorites}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative text-zinc-600 hover:text-primary-container transition-colors">
            <span className="material-symbols-outlined text-[28px]">shopping_cart</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-container text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* ========================================= */}
          {/* DYNAMIC AUTH BUTTON (Login vs Profile)      */}
          {/* ========================================= */}
          {userInfo ? (
            <Link 
              to="/profile" 
              className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-primary-container/10 text-primary-container border border-primary-container/20 rounded-full font-bold hover:bg-primary-container hover:text-white transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">person</span>
              Profile
            </Link>
          ) : (
            <Link 
              to="/auth" 
              className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-full font-bold hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">login</span>
              Login
            </Link>
          )}

          {/* Mobile Profile Icon (Visible only on small screens) */}
          <Link to={userInfo ? "/profile" : "/auth"} className="md:hidden text-zinc-600 hover:text-primary-container transition-colors">
            <span className="material-symbols-outlined text-[28px]">
              {userInfo ? "person" : "login"}
            </span>
          </Link>

        </div>

        {/* Mega Menu Dropdown */}
        {isShopOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-t border-zinc-100 shadow-2xl z-40 animate-[fadeIn_0.2s_ease-out]">
            <div className="max-w-[1440px] mx-auto px-6 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                
                <div>
                  <h4 className="text-xs font-black text-tertiary uppercase tracking-widest mb-4">Categories</h4>
                  <ul className="space-y-3 mb-6">
                    {['Action Figures', 'Educational', 'Puzzles', 'Sports Gear'].map((item) => (
                      <li key={item}><Link to="/shop" onClick={() => setIsShopOpen(false)} className="text-sm font-medium text-zinc-600 hover:text-primary-container hover:pl-1 transition-all block">{item}</Link></li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-black text-tertiary uppercase tracking-widest mb-4">By Price</h4>
                  <ul className="space-y-3 mb-6">
                    {['Under ₹299', 'Under ₹499', 'Under ₹999', 'Premium Toys'].map((item) => (
                      <li key={item}><Link to="/shop" onClick={() => setIsShopOpen(false)} className="text-sm font-bold text-secondary-container hover:text-primary-container hover:pl-1 transition-all block">{item}</Link></li>
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