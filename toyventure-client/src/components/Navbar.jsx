import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get raw items from Redux
  const cartItemsRaw = useSelector((state) => state.cart.cartItems);
  const wishlistItemsRaw = useSelector((state) => state.wishlist?.wishlistItems || []);

  // Bulletproof user check
  const userInfoData = localStorage.getItem('userInfo');
  const userInfo = (userInfoData && userInfoData !== 'null' && userInfoData !== 'undefined') 
                   ? JSON.parse(userInfoData) 
                   : null;

  // IMPORTANT FIX: If no user is logged in, treat cart and wishlist as completely empty for the UI
  const cartItemsCount = userInfo ? cartItemsRaw.length : 0;
  const wishlistItemsCount = userInfo ? wishlistItemsRaw.length : 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside or changing route
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      // Optional: you can dispatch an action here to completely wipe Redux state if you want
      // dispatch(clearCart()); 
      
      setIsProfileDropdownOpen(false);
      navigate('/auth');
      window.location.reload(); // Hard refresh to flush out all state
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/About' },
    { name: 'Contact', path: '/Contact' },
  ];

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 relative">
          
          {/* Main Navbar Bar */}
          <div className={`relative flex items-center justify-between rounded-full transition-all duration-300 ${
            isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md border border-white/40 px-6 py-3' : 'bg-transparent px-2'
          }`}>
            
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 group z-20">
              <div className="w-10 h-10 bg-primary-container text-white rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-inner">
                 <span className="material-symbols-outlined text-[24px]">toys</span>
              </div>
              <span className="font-black text-2xl tracking-tight text-zinc-900">
                Toy<span className="text-primary-container">Venture</span>
              </span>
            </Link>

            {/* Middle: Desktop Links */}
            <div className="hidden md:flex items-center gap-1 bg-zinc-100/50 backdrop-blur-sm p-1 rounded-full border border-white/60">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                    location.pathname === link.path 
                    ? 'bg-white text-zinc-900 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-white/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right: Icons & Profile */}
            <div className="flex items-center gap-2 z-20">
              
              {/* Favorites Icon */}
              <Link to="/favorites" className="relative p-2 text-zinc-600 hover:text-red-500 transition-colors hidden sm:block group">
                <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">favorite</span>
                {wishlistItemsCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm border border-white animate-bounce-in">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link to="/cart" className="relative p-2 text-zinc-600 hover:text-primary-container transition-colors group">
                <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">shopping_cart</span>
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-primary-container text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm border border-white animate-bounce-in">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Profile / Auth Button */}
              <div className="relative ml-2">
                {userInfo ? (
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 bg-white border border-zinc-200 pl-2 pr-4 py-1.5 rounded-full hover:border-primary-container/30 hover:shadow-sm transition-all focus:ring-2 focus:ring-primary-container/20 outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-fixed to-orange-100 flex items-center justify-center text-primary-container font-black text-sm shadow-inner">
                      {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="font-bold text-sm text-zinc-700 hidden lg:block line-clamp-1 max-w-[100px]">
                      {userInfo.name?.split(' ')[0] || 'User'}
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-zinc-400">expand_more</span>
                  </button>
                ) : (
                  <Link to="/auth" className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-black hover:shadow-md transition-all">
                    <span className="material-symbols-outlined text-[18px] hidden sm:block">login</span>
                    Log In
                  </Link>
                )}

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && userInfo && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden animate-[fadeIn_0.2s_ease-out] z-50 py-2">
                    <div className="px-5 py-4 border-b border-zinc-50 bg-zinc-50/50">
                      <p className="font-black text-zinc-800 line-clamp-1">{userInfo.name || 'ToyVenture User'}</p>
                      <p className="text-xs font-bold text-zinc-400 mt-0.5 break-all">{userInfo.email || userInfo.mobileNumber}</p>
                    </div>
                    
                    <div className="p-2 flex flex-col gap-1">
                      {userInfo.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-zinc-600 hover:text-primary-container hover:bg-primary-container/5 rounded-xl transition-colors">
                          <span className="material-symbols-outlined text-[20px]">dashboard</span> Admin Dashboard
                        </Link>
                      )}
                      
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-zinc-600 hover:text-primary-container hover:bg-primary-container/5 rounded-xl transition-colors">
                        <span className="material-symbols-outlined text-[20px]">person</span> My Profile
                      </Link>
                      
                      <Link to="/profile?tab=orders" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-zinc-600 hover:text-primary-container hover:bg-primary-container/5 rounded-xl transition-colors">
                        <span className="material-symbols-outlined text-[20px]">package</span> Order History
                      </Link>
                    </div>

                    <div className="p-2 border-t border-zinc-50">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-black text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        Sign Out <span className="material-symbols-outlined text-[20px]">logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors ml-1"
              >
                <span className="material-symbols-outlined text-[28px]">
                  {isMobileMenuOpen ? 'close' : 'menu_open'}
                </span>
              </button>

            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-[110%] left-4 right-4 bg-white/95 backdrop-blur-xl border border-zinc-100 shadow-xl rounded-[2rem] p-4 flex flex-col gap-2 animate-[slideDown_0.3s_ease-out] overflow-hidden">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`px-5 py-4 rounded-2xl text-base font-black transition-all flex items-center justify-between ${
                    location.pathname === link.path 
                    ? 'bg-primary-container/10 text-primary-container' 
                    : 'text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  {link.name}
                  <span className="material-symbols-outlined text-[20px] opacity-50">chevron_right</span>
                </Link>
              ))}
              <Link 
                to="/favorites" 
                className={`px-5 py-4 rounded-2xl text-base font-black transition-all flex items-center justify-between ${
                  location.pathname === '/favorites' 
                  ? 'bg-primary-container/10 text-primary-container' 
                  : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[22px]">favorite</span> Favorites
                </div>
                {wishlistItemsCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlistItemsCount}</span>}
              </Link>
            </div>
          )}

        </div>
      </nav>

      {/* Overlay to close dropdowns on outside click */}
      {(isProfileDropdownOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px]"
          onClick={() => {
            setIsProfileDropdownOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;