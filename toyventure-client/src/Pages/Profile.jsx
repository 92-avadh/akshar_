import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  useGetMyOrdersQuery, 
  useGetUserProfileQuery, 
  useUpdateUserProfileMutation,
  useGetAllContactMessagesQuery // <-- Import the new hook
} from '../features/api/apiSlice';

const getOrderStatusMeta = (order) => {
  if (order.orderStatus === 'fulfilled') return { label: 'Delivered', className: 'bg-green-100 text-green-700 border border-green-200' };
  if (order.orderStatus === 'payment_review') return { label: 'Paid - Review', className: 'bg-amber-100 text-amber-700 border border-amber-200' };
  if (order.paymentStatus === 'refunded' || order.orderStatus === 'refunded') return { label: 'Refunded', className: 'bg-slate-100 text-slate-700 border border-slate-200' };
  if (order.paymentStatus === 'paid') return { label: 'Paid', className: 'bg-green-100 text-green-700 border border-green-200' };
  if (order.paymentStatus === 'failed') return { label: 'Payment Retry Needed', className: 'bg-red-100 text-red-700 border border-red-200' };
  return { label: 'Pending Payment', className: 'bg-orange-100 text-orange-700 border border-orange-200' };
};

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [name, setName] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // To track if user is admin

  const { data: orders, isLoading: loadingOrders } = useGetMyOrdersQuery();
  const { data: profile, isLoading: loadingProfile } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  
  // Fetch messages (will only return data if user has admin token on backend)
  const { data: messages, isLoading: loadingMessages } = useGetAllContactMessagesQuery(undefined, {
    skip: !isAdmin // Skip fetching if not an admin
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const userInfoData = sessionStorage.getItem('userInfo');
    
    if (!token) {
      navigate('/auth');
    } else if (userInfoData) {
      try {
        const userInfo = JSON.parse(userInfoData);
        if (userInfo.role === 'admin') {
          setIsAdmin(true);
        }
      } catch(e) {}
    }
  }, [navigate]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAddresses(profile.addresses || []);

      const userInfoData = sessionStorage.getItem('userInfo');
      if (userInfoData && userInfoData !== 'undefined') {
        const userInfo = JSON.parse(userInfoData);
        sessionStorage.setItem('userInfo', JSON.stringify({ ...userInfo, name: profile.name }));
      }
    }
  }, [profile]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name, addresses }).unwrap();
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error?.data?.message || 'Failed to update profile');
    }
  };

  const handleAddAddress = () => {
    if (addresses.length >= 3) return alert('You can only save up to 3 addresses.');
    setAddresses([...addresses, { flatNumber: '', street: '', landmark: '', city: '', pincode: '' }]);
  };

  const handleAddressChange = (index, field, value) => {
    const nextAddresses = [...addresses];
    nextAddresses[index] = { ...nextAddresses[index], [field]: value };
    setAddresses(nextAddresses);
  };

  const handleRemoveAddress = (index) => {
    setAddresses(addresses.filter((_, addressIndex) => addressIndex !== index));
  };

  if (loadingProfile) {
    return <div className="pt-40 min-h-screen bg-[#fafafa] text-center font-bold text-slate-500">Loading profile...</div>;
  }

  return (
    <main className="pt-32 pb-24 min-h-screen bg-[#fafafa] relative overflow-hidden selection:bg-orange-200">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none opacity-30 bg-[radial-gradient(circle,rgba(253,186,116,0.4)_0%,rgba(253,186,116,0)_70%)] z-0"></div>

      <div className="max-w-[1100px] mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-md border border-slate-100 text-center">
            <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-4xl font-black mx-auto mb-4 border border-orange-200 uppercase">
              {profile?.name ? profile.name.charAt(0) : 'U'}
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-1">{profile?.name || 'Magical Guest'}</h2>
            <p className="text-slate-500 font-bold mb-6">
              {profile?.mobileNumber ? `+91 ${profile.mobileNumber}` : profile?.email || 'No phone number'}
            </p>

            <div className="space-y-3 mb-6">
              <button onClick={() => setActiveTab('orders')} className={`w-full py-3 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
                <span className="material-symbols-outlined text-[20px]">inventory_2</span> Order History
              </button>
              
              {/* ADMIN ONLY TAB */}
              {isAdmin && (
                <button onClick={() => setActiveTab('messages')} className={`w-full py-3 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${activeTab === 'messages' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
                  <span className="material-symbols-outlined text-[20px]">forum</span> User Messages
                </button>
              )}

              <button onClick={() => setActiveTab('edit')} className={`w-full py-3 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${activeTab === 'edit' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
                <span className="material-symbols-outlined text-[20px]">edit</span> Edit Profile
              </button>
            </div>

            <button onClick={handleLogout} className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-100">
              <span className="material-symbols-outlined text-[20px]">logout</span> Sign Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-8">
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-md border border-slate-100 min-h-[400px]">
              <h1 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">Order History</h1>
              {loadingOrders ? (
                <div className="flex justify-center py-10"><p className="font-bold text-slate-500">Loading orders...</p></div>
              ) : orders && orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => {
                    const statusMeta = getOrderStatusMeta(order);
                    return (
                      <div key={order._id} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4 hover:shadow-md transition-all">
                        <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                            Order: <span className="text-slate-600 font-mono">{order._id.substring(order._id.length - 8)}</span>
                          </p>
                          <p className="text-sm font-bold text-slate-800 mb-2">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                          <span className={`${statusMeta.className} text-xs font-bold px-3 py-1 rounded-full`}>
                            {statusMeta.label}
                          </span>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-xs text-slate-500 font-bold mb-1">{order.orderItems.length} Item(s)</p>
                          <p className="text-2xl font-black text-orange-500">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <span className="material-symbols-outlined text-[60px] text-slate-300 mb-4">shopping_cart</span>
                  <p className="text-slate-500 font-bold mb-4">No orders yet!</p>
                  <Link to="/shop" className="px-6 py-3 bg-slate-900 text-white hover:bg-orange-500 transition-colors font-bold rounded-full">Start Shopping</Link>
                </div>
              )}
            </div>
          )}

          {/* USER MESSAGES TAB (Admin Only) */}
          {activeTab === 'messages' && isAdmin && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-md border border-slate-100 min-h-[400px]">
              <h1 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">Customer Messages</h1>
              {loadingMessages ? (
                <div className="flex justify-center py-10"><p className="font-bold text-slate-500">Loading messages...</p></div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <div key={msg._id} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">{msg.name}</h4>
                          <a href={`mailto:${msg.email}`} className="text-sm font-medium text-orange-500 hover:underline">{msg.email}</a>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                          {new Date(msg.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-100">
                        <p className="text-slate-600 font-medium text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <span className="material-symbols-outlined text-[60px] text-slate-300 mb-4">inbox</span>
                  <p className="text-slate-500 font-bold mb-4">No messages received yet.</p>
                </div>
              )}
            </div>
          )}

          {/* EDIT PROFILE TAB */}
          {activeTab === 'edit' && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-md border border-slate-100 min-h-[400px]">
              <h1 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">Edit Profile</h1>

              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="w-full bg-slate-50 p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-medium text-slate-900 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Mobile / Email</label>
                    <input type="text" value={profile?.mobileNumber ? `+91 ${profile.mobileNumber}` : profile?.email || ''} disabled className="w-full bg-slate-100 text-slate-400 p-4 border border-slate-200 rounded-2xl outline-none font-medium cursor-not-allowed" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black text-slate-900">Saved Addresses</h3>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">{addresses.length} / 3</span>
                  </div>

                  {addresses.length === 0 && <p className="text-slate-400 text-sm italic mb-4">No addresses saved yet.</p>}

                  <div className="space-y-6">
                    {addresses.map((address, index) => (
                      <div key={index} className="bg-slate-50 p-5 rounded-3xl border border-slate-200 relative shadow-sm">
                        <div className="absolute top-4 right-4">
                          <button type="button" onClick={() => handleRemoveAddress(index)} className="text-red-400 hover:text-red-600 bg-white p-1.5 rounded-full shadow-sm border border-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                        <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-slate-400 text-[18px]">home_pin</span> Address #{index + 1}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" placeholder="Flat / Block No." value={address.flatNumber} onChange={(e) => handleAddressChange(index, 'flatNumber', e.target.value)} required className="w-full bg-white p-3 rounded-xl outline-none border border-slate-200 shadow-sm text-sm font-medium text-slate-900 focus:ring-2 focus:ring-orange-500" />
                          <input type="text" placeholder="Street / Locality" value={address.street} onChange={(e) => handleAddressChange(index, 'street', e.target.value)} required className="w-full bg-white p-3 rounded-xl outline-none border border-slate-200 shadow-sm text-sm font-medium text-slate-900 focus:ring-2 focus:ring-orange-500" />
                          <input type="text" placeholder="Landmark (Optional)" value={address.landmark} onChange={(e) => handleAddressChange(index, 'landmark', e.target.value)} className="w-full bg-white p-3 rounded-xl outline-none border border-slate-200 shadow-sm text-sm font-medium text-slate-900 focus:ring-2 focus:ring-orange-500" />
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="City" value={address.city} onChange={(e) => handleAddressChange(index, 'city', e.target.value)} required className="w-full bg-white p-3 rounded-xl outline-none border border-slate-200 shadow-sm text-sm font-medium text-slate-900 focus:ring-2 focus:ring-orange-500" />
                            <input type="text" placeholder="Pincode" value={address.pincode} onChange={(e) => handleAddressChange(index, 'pincode', e.target.value)} required className="w-full bg-white p-3 rounded-xl outline-none border border-slate-200 shadow-sm text-sm font-medium text-slate-900 focus:ring-2 focus:ring-orange-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {addresses.length < 3 && (
                    <button type="button" onClick={handleAddAddress} className="mt-4 text-sm font-bold text-orange-500 flex items-center gap-1 hover:underline bg-orange-50 px-4 py-2 rounded-full transition-colors border border-orange-100">
                      <span className="material-symbols-outlined text-[18px]">add_circle</span> Add New Address
                    </button>
                  )}
                </div>

                <button type="submit" disabled={isUpdating} className="w-full py-4 bg-slate-900 text-white font-black text-lg rounded-2xl hover:bg-orange-500 shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95 disabled:opacity-50">
                  {isUpdating ? 'Saving...' : 'Save Profile Details'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Profile;