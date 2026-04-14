import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';
import Logo from './Logo';
import { useGetAllOrdersQuery, useGetAllContactMessagesQuery } from '../features/api/apiSlice';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const cartItemsRaw = useSelector((state) => state.cart.cartItems);
  const wishlistItemsRaw = useSelector((state) => state.wishlist?.wishlistItems || []);

  const userInfoData = sessionStorage.getItem('userInfo');
  const userInfo = (userInfoData && userInfoData !== 'null' && userInfoData !== 'undefined') 
                   ? JSON.parse(userInfoData) 
                   : null;

  const cartItemsCount = userInfo ? cartItemsRaw.length : 0;
  const wishlistItemsCount = userInfo ? wishlistItemsRaw.length : 0;
  const isAdmin = userInfo?.role === 'admin';

  const [latestOrderId, setLatestOrderId] = useState(null);
  const [latestMessageId, setLatestMessageId] = useState(null);

  const { data: adminOrders } = useGetAllOrdersQuery(undefined, { skip: !isAdmin, pollingInterval: 5000 });
  const { data: adminMessages } = useGetAllContactMessagesQuery(undefined, { skip: !isAdmin, pollingInterval: 5000 });

  const [lastReadTimestamp, setLastReadTimestamp] = useState(() => parseInt(localStorage.getItem('adminNotificationsReadAt')) || 0);

  const pendingOrdersCount = adminOrders?.filter(o => {
    const isPending = !['delivered', 'fulfilled', 'cancelled'].includes(o.orderStatus);
    const isNew = new Date(o.createdAt).getTime() > lastReadTimestamp;
    return isPending && isNew;
  }).length || 0;

  const unreadMessagesCount = adminMessages?.filter(m => {
    return new Date(m.createdAt).getTime() > lastReadTimestamp;
  }).length || 0;

  const totalNotifications = pendingOrdersCount + unreadMessagesCount;

  const handleNotificationClick = () => {
    const now = Date.now();
    setLastReadTimestamp(now);
    localStorage.setItem('adminNotificationsReadAt', now.toString());
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsNotifOpen(false);
  }, [location]);

  useEffect(() => {
    if (isAdmin && adminOrders && adminOrders.length > 0) {
      const topOrderId = adminOrders[0]._id;
      if (latestOrderId && topOrderId !== latestOrderId) {
        import('react-hot-toast').then(({ default: toast }) => {
          toast.success("New Order Arrived! 🚚", {
            duration: 6000, position: 'top-right',
            style: { border: '1px solid #fee2e2', padding: '16px', color: '#450a0a', fontWeight: 'bold', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(127, 29, 29, 0.1)' },
            iconTheme: { primary: '#dc2626', secondary: '#FFF' }
          });
        });
      }
      setLatestOrderId(topOrderId);
    }
  }, [adminOrders, isAdmin, latestOrderId]);

  useEffect(() => {
    if (isAdmin && adminMessages && adminMessages.length > 0) {
      const topMessageId = adminMessages[0]._id;
      if (latestMessageId && topMessageId !== latestMessageId) {
        import('react-hot-toast').then(({ default: toast }) => {
          toast("New Customer Message! 💬", {
            duration: 6000, position: 'top-right',
            style: { border: '1px solid #fee2e2', padding: '16px', color: '#450a0a', fontWeight: 'bold', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(127, 29, 29, 0.1)' }
          });
        });
      }
      setLatestMessageId(topMessageId);
    }
  }, [adminMessages, isAdmin, latestMessageId]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('token');
      setIsProfileDropdownOpen(false);
      navigate('/auth');
      window.location.reload(); 
    }
  };

  const navLinks = isAdmin
    ? [
        { name: 'Dashboard', path: '/admin' },
        { name: 'Catalog', path: '/admin/catalog' },
        { name: 'Profile', path: '/profile' },
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'About', path: '/About' },
        { name: 'Contact', path: '/Contact' },
      ];

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'pt-4 pb-2' : 'py-6'}`}>
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 relative">
          
          {/* Main Navbar Bar - Morphs into Premium Red Gradient when scrolled */}
          <div className={`relative flex items-center justify-between rounded-full transition-all duration-500 ease-in-out ${
            isScrolled 
            ? 'bg-gradient-to-r from-red-950 via-red-900 to-red-950 backdrop-blur-xl border border-red-800/60 shadow-xl shadow-red-950/30 px-6 py-3' 
            : 'bg-transparent px-2'
          }`}>
            
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 group z-20">
              <Logo className={`w-9 h-9 md:w-10 md:h-10 transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-slate-900'}`} />
              <span className={`font-black text-2xl tracking-tight transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-slate-900'}`}>
                Toy<span className={isScrolled ? 'text-red-400' : 'text-red-600'}>Blix</span>
              </span>
            </Link>

            {/* Middle: Desktop Links */}
            <div className={`hidden md:flex items-center gap-1 p-1 rounded-full transition-colors duration-300 ${isScrolled ? 'bg-red-950/40 border border-red-800/40' : 'bg-transparent'}`}>
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    location.pathname === link.path 
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30' // Red Box for Active Link
                    : isScrolled
                      ? 'text-red-100 hover:text-white hover:bg-red-800/60' // Dark Red Mode Inactive Links
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50' // Light Mode Inactive Links
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right: Icons & Profile */}
            <div className="flex items-center gap-2 z-20">
              
              {/* Favorites Icon */}
              <Link to="/favorites" className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 hidden sm:flex ${
                isScrolled ? 'text-red-100 hover:bg-red-800/80 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}>
                <span className="material-symbols-outlined text-[22px]">favorite</span>
                {wishlistItemsCount > 0 && (
                  <span className={`absolute top-0 right-0 w-4 h-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 box-content ${
                    isScrolled ? 'bg-red-500 border-red-900' : 'bg-red-600 border-white'
                  }`}>
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>

              {/* Admin Notifications Bell */}
              {isAdmin && (
                <div className="relative hidden sm:block">
                  <button onClick={() => setIsNotifOpen(!isNotifOpen)} className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isScrolled ? 'text-red-100 hover:bg-red-800/80 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`} title="Admin Alerts">
                    <span className="material-symbols-outlined text-[22px]">notifications</span>
                    {totalNotifications > 0 && (
                      <span className={`absolute top-0 right-0 w-4 h-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 box-content ${
                        isScrolled ? 'bg-red-500 border-red-900' : 'bg-red-600 border-white'
                      }`}>
                        {totalNotifications}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown Panel */}
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-4 w-[340px] bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden animate-[fadeIn_0.2s_ease-out] z-50 p-2">
                      <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span className="material-symbols-outlined text-red-600 text-[18px]">notifications_active</span> Alerts
                        </h3>
                        {totalNotifications > 0 && (
                          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{totalNotifications} new</span>
                        )}
                      </div>

                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                        {adminOrders?.filter(o => !['delivered','fulfilled','cancelled'].includes(o.orderStatus) && new Date(o.createdAt).getTime() > lastReadTimestamp).slice(0, 5).map(order => (
                          <Link key={order._id} to="/admin" onClick={() => { setIsNotifOpen(false); handleNotificationClick(); }} className="flex items-center gap-3 p-3 mb-1 rounded-2xl hover:bg-red-50 transition-colors">
                            <div className="w-10 h-10 bg-red-100 text-red-700 rounded-xl flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[18px]">package_2</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">New Order #{String(order._id).slice(-6)}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                Rs {order.totalPrice?.toLocaleString('en-IN')} 
                              </p>
                            </div>
                          </Link>
                        ))}

                        {totalNotifications === 0 && (
                          <div className="px-5 py-8 text-center">
                            <span className="material-symbols-outlined text-[32px] text-slate-300 block mb-2">done_all</span>
                            <p className="text-xs font-medium text-slate-500">All caught up!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cart Icon */}
              <Link to="/cart" className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isScrolled ? 'text-red-100 hover:bg-red-800/80 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}>
                <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
                {cartItemsCount > 0 && (
                  <span className={`absolute top-0 right-0 w-4 h-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 box-content ${
                    isScrolled ? 'bg-red-500 border-red-900' : 'bg-red-600 border-white'
                  }`}>
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Profile / Auth Button */}
              <div className="relative ml-1 z-50">
                {userInfo ? (
                  <>
                    <button 
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className={`flex items-center gap-2 border pl-1.5 pr-3 py-1.5 rounded-full transition-colors duration-300 outline-none ${
                        isScrolled 
                        ? 'bg-red-900/40 border-red-800/50 hover:bg-red-800/80' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        isScrolled ? 'bg-red-700 text-white' : 'bg-red-50 text-red-600'
                      }`}>
                        {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''} ${
                        isScrolled ? 'text-red-200' : 'text-slate-500'
                      }`}>
                        expand_more
                      </span>
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden animate-[fadeIn_0.2s_ease-out] z-50 p-2">
                        <div className="px-4 py-4 border-b border-slate-50">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Signed in</p>
                          <p className="text-sm font-bold text-slate-900 truncate">{userInfo.name || 'User'}</p>
                        </div>
                        
                        <div className="py-2 space-y-1">
                          {!isAdmin && (
                            <Link 
                              to="/profile" 
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">person</span>
                              My Account
                            </Link>
                          )}
                          
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-600 rounded-2xl hover:bg-red-50 transition-colors text-left"
                          >
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link to="/auth" className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-colors duration-300 relative z-50 ${
                    isScrolled ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}>
                    <span className="material-symbols-outlined text-[18px] hidden sm:block">login</span>
                    Log In
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ml-1 z-50 relative ${
                  isScrolled ? 'bg-red-900/60 text-white border border-red-800/50 hover:bg-red-800' : 'bg-slate-50 text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {isMobileMenuOpen ? 'close' : 'menu_open'}
                </span>
              </button>

            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-[110%] left-4 right-4 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 p-4 flex flex-col gap-2 animate-[slideDown_0.3s_ease-out] z-40">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`px-5 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-between ${
                    location.pathname === link.path 
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30' // Red Box for Active Link
                    : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  {link.name}
                  <span className="material-symbols-outlined text-[20px] opacity-30">chevron_right</span>
                </Link>
              ))}
              <Link 
                to="/favorites" 
                className={`px-5 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-between ${
                  location.pathname === '/favorites' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                  : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">favorite</span> Favorites
                </div>
                {wishlistItemsCount > 0 && <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full">{wishlistItemsCount}</span>}
              </Link>
            </div>
          )}

        </div>
      </nav>

      {/* Overlay to close dropdowns on outside click */}
      {(isProfileDropdownOpen || isMobileMenuOpen || isNotifOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-sm"
          onClick={() => {
            setIsProfileDropdownOpen(false);
            setIsMobileMenuOpen(false);
            setIsNotifOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;