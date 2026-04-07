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

  // Get raw items from Redux
  const cartItemsRaw = useSelector((state) => state.cart.cartItems);
  const wishlistItemsRaw = useSelector((state) => state.wishlist?.wishlistItems || []);

  // Bulletproof user check
  const userInfoData = sessionStorage.getItem('userInfo');
  const userInfo = (userInfoData && userInfoData !== 'null' && userInfoData !== 'undefined') 
                   ? JSON.parse(userInfoData) 
                   : null;

  // IMPORTANT FIX: If no user is logged in, treat cart and wishlist as completely empty for the UI
  const cartItemsCount = userInfo ? cartItemsRaw.length : 0;
  const wishlistItemsCount = userInfo ? wishlistItemsRaw.length : 0;

  const isAdmin = userInfo?.role === 'admin';

  // State to track newest incoming database IDs for toast alerts
  const [latestOrderId, setLatestOrderId] = useState(null);
  const [latestMessageId, setLatestMessageId] = useState(null);

  // Admin Real-Time Polling for Notifications
  const { data: adminOrders } = useGetAllOrdersQuery(undefined, { skip: !isAdmin, pollingInterval: 5000 });
  const { data: adminMessages } = useGetAllContactMessagesQuery(undefined, { skip: !isAdmin, pollingInterval: 5000 });

  // Local state to track when the admin last clicked the notification bell
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
    setIsNotifOpen(false);
  }, [location]);

  // Real-Time Alert Toast logic for incoming Orders
  useEffect(() => {
    if (isAdmin && adminOrders && adminOrders.length > 0) {
      const topOrderId = adminOrders[0]._id;
      if (latestOrderId && topOrderId !== latestOrderId) {
        import('react-hot-toast').then(({ default: toast }) => {
          toast.success("New Order Arrived! 📦", {
            duration: 6000,
            position: 'top-right',
            style: { border: '2px solid #F97316', padding: '16px', color: '#18181B', fontWeight: '900' },
            iconTheme: { primary: '#F97316', secondary: '#FFF' }
          });
        });
      }
      setLatestOrderId(topOrderId);
    }
  }, [adminOrders, isAdmin, latestOrderId]);

  // Real-Time Alert Toast logic for incoming Messages
  useEffect(() => {
    if (isAdmin && adminMessages && adminMessages.length > 0) {
      const topMessageId = adminMessages[0]._id;
      if (latestMessageId && topMessageId !== latestMessageId) {
        import('react-hot-toast').then(({ default: toast }) => {
          toast("New Customer Message! 💬", {
            duration: 6000,
            position: 'top-right',
            style: { border: '2px solid #38BDF8', padding: '16px', color: '#18181B', fontWeight: '900' }
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
      // Optional: you can dispatch an action here to completely wipe Redux state if you want
      // dispatch(clearCart()); 
      
      setIsProfileDropdownOpen(false);
      navigate('/auth');
      window.location.reload(); // Hard refresh to flush out all state
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
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 relative">
          
          {/* Main Navbar Bar */}
          <div className={`relative flex items-center justify-between rounded-full transition-all duration-300 ${
            isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md border border-white/40 px-6 py-3' : 'bg-transparent px-2'
          }`}>
            
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 group z-20">
              <Logo className="w-10 h-10 md:w-11 md:h-11 drop-shadow" />
              <span className="font-black text-2xl tracking-tight text-zinc-900">
                Toy<span className="text-primary-container">Blix</span>
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

              {/* Admin Notifications Bell */}
              {isAdmin && (
                <div className="relative hidden sm:block">
                  <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative p-2 text-zinc-600 hover:text-orange-500 transition-colors group" title="Admin Alerts">
                    <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">notifications</span>
                    {totalNotifications > 0 && (
                      <span className="absolute top-0 right-0 w-5 h-5 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm border border-white animate-bounce-in">
                        {totalNotifications}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown Panel */}
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-3 w-[340px] bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden animate-[fadeIn_0.2s_ease-out] z-50">
                      <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                        <h3 className="font-black text-zinc-800 text-sm flex items-center gap-2">
                          <span className="material-symbols-outlined text-orange-500 text-[18px]">notifications_active</span> Notifications
                        </h3>
                        {totalNotifications > 0 && (
                          <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{totalNotifications} new</span>
                        )}
                      </div>

                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {/* Unread Orders */}
                        {adminOrders?.filter(o => !['delivered','fulfilled','cancelled'].includes(o.orderStatus) && new Date(o.createdAt).getTime() > lastReadTimestamp).slice(0, 5).map(order => (
                          <Link key={order._id} to="/admin" onClick={() => { setIsNotifOpen(false); handleNotificationClick(); }} className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50/50 transition-colors border-b border-zinc-50">
                            <div className="w-9 h-9 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[18px]">package_2</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-zinc-800 truncate">New Order #{String(order._id).slice(-6)}</p>
                              <p className="text-[10px] text-zinc-400 font-bold mt-0.5">
                                Rs {order.totalPrice?.toLocaleString('en-IN')} · {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </Link>
                        ))}

                        {/* Unread Messages */}
                        {adminMessages?.filter(m => new Date(m.createdAt).getTime() > lastReadTimestamp).slice(0, 5).map(msg => (
                          <div key={msg._id} className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50/50 transition-colors border-b border-zinc-50">
                            <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[18px]">mail</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-zinc-800 truncate">{msg.name || 'Customer'}</p>
                              <p className="text-[10px] text-zinc-400 font-bold mt-0.5 truncate">{msg.message?.substring(0, 50)}...</p>
                            </div>
                          </div>
                        ))}

                        {totalNotifications === 0 && (
                          <div className="px-5 py-8 text-center">
                            <span className="material-symbols-outlined text-[36px] text-zinc-300 block mb-2">notifications_off</span>
                            <p className="text-xs font-bold text-zinc-400">All caught up! No new notifications.</p>
                          </div>
                        )}
                      </div>

                      {totalNotifications > 0 && (
                        <div className="px-4 py-3 border-t border-zinc-100 bg-zinc-50/30">
                          <button
                            onClick={() => { handleNotificationClick(); setIsNotifOpen(false); }}
                            className="w-full py-2.5 bg-zinc-900 text-white font-black text-xs rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[16px]">done_all</span> Mark All as Read
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Cart Icon */}
              <Link to="/cart" className="relative p-2 text-zinc-600 hover:text-primary-container transition-colors group">
                <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">shopping_cart</span>
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-primary-container text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm border border-white animate-bounce-in">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Profile / Auth Button with Dropdown */}
              <div className="relative ml-2 z-50">
                {userInfo ? (
                  <>
                    <button 
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center gap-2 bg-white border border-zinc-200 pl-2 pr-3 py-1.5 rounded-full hover:border-primary-container/30 hover:shadow-sm transition-all focus:ring-2 focus:ring-primary-container/20 outline-none group relative z-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-fixed to-orange-100 flex items-center justify-center text-primary-container font-black text-sm shadow-inner">
                        {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className={`material-symbols-outlined text-[18px] text-zinc-400 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden animate-[fadeIn_0.2s_ease-out] z-50">
                        <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/50">
                          <p className="text-xs font-bold text-zinc-500 mb-0.5">Signed in as</p>
                          <p className="text-sm font-black text-zinc-800 truncate">{userInfo.name || 'User'}</p>
                        </div>
                        
                        <div className="py-2">
                          {/* ONLY CUSTOMERS see this link (Admins have it in the main Navbar) */}
                          {!isAdmin && (
                            <Link 
                              to="/profile" 
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-zinc-600 hover:bg-orange-50 hover:text-primary-container transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">person</span>
                              My Profile & Orders
                            </Link>
                          )}
                          
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors text-left"
                          >
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link to="/auth" className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-black hover:shadow-md transition-all relative z-50">
                    <span className="material-symbols-outlined text-[18px] hidden sm:block">login</span>
                    Log In
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors ml-1 z-50 relative"
              >
                <span className="material-symbols-outlined text-[28px]">
                  {isMobileMenuOpen ? 'close' : 'menu_open'}
                </span>
              </button>

            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-[110%] left-4 right-4 bg-white/95 backdrop-blur-xl border border-zinc-100 shadow-xl rounded-[2rem] p-4 flex flex-col gap-2 animate-[slideDown_0.3s_ease-out] overflow-hidden z-40">
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
      {(isProfileDropdownOpen || isMobileMenuOpen || isNotifOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px]"
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