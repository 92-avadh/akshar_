import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../features/api/apiSlice';

const Profile = () => {
  const navigate = useNavigate();
  
  // 1. Get user info from local storage
  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

  // 2. Fetch the user's orders from the database
  const { data: orders, isLoading, error } = useGetMyOrdersQuery(undefined, {
    skip: !userInfo, // Don't fetch if not logged in
  });

  // 3. Redirect to login if they aren't logged in
  useEffect(() => {
    if (!userInfo) {
      navigate('/auth');
    }
    window.scrollTo(0, 0);
  }, [userInfo, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/auth');
  };

  if (!userInfo) return null;

  return (
    <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1100px] mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* ============================== */}
        {/* LEFT COLUMN: USER DETAILS      */}
        {/* ============================== */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="card-surface p-8 rounded-[2.5rem] shadow-soft text-center border border-white">
            <div className="w-24 h-24 bg-primary-container text-white rounded-full flex items-center justify-center text-4xl font-black mx-auto mb-4 shadow-inner">
              {userInfo.mobileNumber ? userInfo.mobileNumber.substring(0, 1) : 'U'}
            </div>
            <h2 className="text-2xl font-black text-zinc-800 mb-1">My Account</h2>
            <p className="text-zinc-500 font-bold mb-6">+91 {userInfo.mobileNumber}</p>
            
            <button 
              onClick={handleLogout}
              className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span> Sign Out
            </button>
          </div>
        </div>

        {/* ============================== */}
        {/* RIGHT COLUMN: ORDER HISTORY    */}
        {/* ============================== */}
        <div className="md:col-span-8">
          <div className="card-surface p-8 rounded-[2.5rem] shadow-soft border border-white min-h-[400px]">
            <div className="flex items-center gap-3 mb-8 border-b border-white pb-4">
              <span className="material-symbols-outlined text-primary-container text-[32px]">inventory_2</span>
              <h1 className="text-3xl font-black text-zinc-800">Order History</h1>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-4">
                 <div className="w-10 h-10 border-4 border-zinc-200 border-t-primary-container rounded-full animate-spin"></div>
                 <p className="text-zinc-500 font-bold">Loading your magical orders...</p>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500 font-bold">{error?.data?.message || 'Failed to load orders'}</p>
              </div>
            ) : orders && orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="material-symbols-outlined text-[60px] text-zinc-300 mb-4">shopping_cart</span>
                <h3 className="text-xl font-black text-zinc-800 mb-2">No orders yet!</h3>
                <p className="text-zinc-500 mb-6">You haven't bought any toys from Akshar Toys Creation yet.</p>
                <Link to="/shop" className="px-6 py-3 bg-primary-container text-white font-bold rounded-full hover:-translate-y-1 hover:shadow-lg transition-all">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white/60 p-6 rounded-3xl border border-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
                    
                    {/* Order Info */}
                    <div>
                      <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">
                        Order ID: <span className="text-zinc-600 font-mono">{order._id.substring(order._id.length - 8)}</span>
                      </p>
                      <p className="text-sm font-bold text-zinc-800 mb-2">
                        Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <div className="flex gap-2">
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Paid</span>
                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full border border-orange-200">
                          Processing
                        </span>
                      </div>
                    </div>

                    {/* Order Total & Items count */}
                    <div className="text-left md:text-right">
                      <p className="text-xs text-zinc-500 font-bold mb-1">{order.orderItems.length} Item(s)</p>
                      <p className="text-2xl font-black text-primary-container">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                    </div>

                  </div>
                ))}
              </div>
            )}
            
          </div>
        </div>

      </div>
    </main>
  );
};

export default Profile;