import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  useGetMyOrdersQuery, 
  useGetUserProfileQuery, 
  useUpdateUserProfileMutation,
  useGetAllContactMessagesQuery 
} from '../features/api/apiSlice';

const getFulfillmentMeta = (status) => {
  switch(status) {
    case 'confirmed': return { label: 'Confirmed', className: 'bg-indigo-50 border-indigo-200 text-indigo-700', icon: 'thumb_up' };
    case 'packed': return { label: 'Packed', className: 'bg-purple-50 border-purple-200 text-purple-700', icon: 'inventory_2' };
    case 'dispatched': return { label: 'Dispatched', className: 'bg-orange-50 border-orange-200 text-orange-700', icon: 'local_shipping' };
    case 'delivered': 
    case 'fulfilled': return { label: 'Delivered', className: 'bg-green-50 border-green-200 text-green-700', icon: 'check_circle' };
    default: return { label: 'Processing', className: 'bg-slate-50 border-slate-200 text-slate-700', icon: 'hourglass_empty' };
  }
};

const getPaymentMeta = (status) => {
  switch(status) {
    case 'paid': return { label: 'Paid', className: 'bg-green-50 border-green-200 text-green-700', icon: 'check_circle' };
    case 'failed': return { label: 'Failed', className: 'bg-red-50 border-red-200 text-red-700', icon: 'error' };
    case 'refunded': return { label: 'Refunded', className: 'bg-slate-50 border-slate-200 text-slate-700', icon: 'replay' };
    default: return { label: 'Pending Payment', className: 'bg-orange-50 border-orange-200 text-orange-700', icon: 'timer' };
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [name, setName] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: orders, isLoading: loadingOrders } = useGetMyOrdersQuery(undefined, { pollingInterval: 5000 });
  const { data: profile, isLoading: loadingProfile } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  
  const { data: messages, isLoading: loadingMessages } = useGetAllContactMessagesQuery(undefined, {
    skip: !isAdmin 
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

  const handleDownloadInvoice = async (orderId) => {
    try {
      setIsDownloading(true);
      const token = sessionStorage.getItem('token');
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/orders/${orderId}/invoice`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ToyBlix-Invoice-${orderId.substring(orderId.length - 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Invoice download error:', error);
      alert('Could not download the invoice. Please try again later.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loadingProfile) {
    return <div className="pt-40 min-h-screen bg-surface text-center font-bold text-slate-500">Loading profile...</div>;
  }

  return (
    <main className="pt-32 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in selection:bg-orange-200">
      {/* Unified Background Pattern */}
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1100px] mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white text-center">
            <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-4xl font-black mx-auto mb-4 border border-orange-200 uppercase">
              {profile?.name ? profile.name.charAt(0) : 'U'}
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-1">{profile?.name || 'Magical Guest'}</h2>
            <p className="text-slate-500 font-bold mb-6">
              {profile?.mobileNumber ? `+91 ${profile.mobileNumber}` : profile?.email || 'No phone number'}
            </p>

            <div className="space-y-3 mb-6">
              <button onClick={() => setActiveTab('orders')} className={`w-full py-3 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm'}`}>
                <span className="material-symbols-outlined text-[20px]">inventory_2</span> Order History
              </button>
              
              {isAdmin && (
                <button onClick={() => setActiveTab('messages')} className={`w-full py-3 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${activeTab === 'messages' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm'}`}>
                  <span className="material-symbols-outlined text-[20px]">forum</span> User Messages
                </button>
              )}

              <button onClick={() => setActiveTab('edit')} className={`w-full py-3 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${activeTab === 'edit' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm'}`}>
                <span className="material-symbols-outlined text-[20px]">edit</span> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-8">
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white min-h-[400px]">
              <h1 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">Order History</h1>
              {loadingOrders ? (
                <div className="flex justify-center py-10"><p className="font-bold text-slate-500">Loading orders...</p></div>
              ) : orders && orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => {
                    const fulfillMeta = getFulfillmentMeta(order.orderStatus);
                    const payMeta = getPaymentMeta(order.paymentStatus);
                    return (
                      <div key={order._id} className="bg-slate-50/80 p-6 rounded-3xl border border-white shadow-sm flex flex-col gap-4 hover:shadow-md transition-all">
                        {/* Top Header Row */}
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                              Order: <span className="text-slate-600 font-mono">{order._id.substring(order._id.length - 8)}</span>
                            </p>
                            <p className="text-sm font-bold text-slate-800 mb-3">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                            <div className="flex flex-wrap gap-2">
                              <span className={`${payMeta.className} text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border shadow-sm bg-white`}>
                                <span className="material-symbols-outlined text-[14px]">{payMeta.icon}</span> {payMeta.label}
                              </span>
                              <span className={`${fulfillMeta.className} text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border shadow-sm bg-white`}>
                                <span className="material-symbols-outlined text-[14px]">{fulfillMeta.icon}</span> {fulfillMeta.label}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-left md:text-right flex flex-col justify-between items-start md:items-end">
                            <div>
                              <p className="text-xs text-slate-500 font-bold mb-1">{order.orderItems.length} Item(s)</p>
                              <p className="text-2xl font-black text-orange-500">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                            </div>
                            
                            {/* Download Invoice Button */}
                            <button 
                              onClick={() => handleDownloadInvoice(order._id)}
                              disabled={isDownloading}
                              className="mt-3 flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-orange-500 transition-colors shadow-sm disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-[16px]">download</span>
                              {isDownloading ? 'Downloading...' : 'Invoice'}
                            </button>
                          </div>
                        </div>

                        {/* Delivery Timeline UI */}
                        <div className="mt-2 border-t border-slate-200/60 pt-6">
                           <div className="relative flex justify-between items-center w-full px-2">
                             {/* Static Background Track */}
                             <div className="absolute left-2 right-2 top-3 -translate-y-1/2 h-1 bg-slate-200 rounded-full z-0"></div>
                             
                             {/* Dynamic Progress Track */}
                             <div 
                               className="absolute left-2 top-3 -translate-y-1/2 h-1 bg-orange-500 rounded-full z-0 transition-all duration-700 ease-in-out" 
                               style={{ 
                                 width: `calc(${
                                  ['created', 'confirmed', 'packed', 'dispatched', 'delivered', 'fulfilled'].indexOf(order.orderStatus) >= 4 ? 100 : 
                                  (['created', 'confirmed', 'packed', 'dispatched'].indexOf(order.orderStatus) / 4) * 100
                                 }% - 16px)` 
                               }}
                             ></div>

                             {/* Timeline Nodes */}
                             {[
                               { id: 'created', label: 'Placed', date: order.createdAt },
                               { id: 'confirmed', label: 'Confirmed', date: order.statusTimestamps?.confirmedAt },
                               { id: 'packed', label: 'Packed', date: order.statusTimestamps?.packedAt },
                               { id: 'dispatched', label: 'Dispatched', date: order.statusTimestamps?.dispatchedAt },
                               { id: 'delivered', label: 'Delivered', date: order.statusTimestamps?.deliveredAt || (order.orderStatus === 'fulfilled' ? new Date() : null) }
                             ].map((step, idx) => {
                               const currentIdx = ['created', 'confirmed', 'packed', 'dispatched', 'delivered'].indexOf(
                                  order.orderStatus === 'fulfilled' ? 'delivered' : order.orderStatus
                               );
                               const isCompleted = idx <= (currentIdx === -1 ? 0 : currentIdx);

                               return (
                                 <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 w-16">
                                   <div className={`w-6 h-6 rounded-full flex items-center justify-center border-[3px] transition-colors duration-500 bg-white shadow-sm
                                     ${isCompleted ? 'border-orange-500 text-orange-500' : 'border-slate-200 text-transparent'}
                                   `}>
                                      {isCompleted && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>}
                                   </div>
                                   <div className={`text-[10px] sm:text-xs font-bold text-center ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                                     {step.label}
                                     {step.date && <div className="text-[9px] font-medium text-slate-400 mt-0.5">{new Date(step.date).toLocaleDateString('en-IN', {day: 'numeric', month: 'short'})}</div>}
                                   </div>
                                 </div>
                               );
                             })}
                           </div>

                           {/* Active Courier Link Box (FIXED TO SHOW EVEN IF ONLY NAME IS PROVIDED) */}
                           {(order.orderStatus === 'dispatched' || order.orderStatus === 'delivered' || order.orderStatus === 'fulfilled') && (order.courier?.trackingLink || order.courier?.name) && (
                             <div className="mt-6 bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                               <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-white shadow-sm text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                                   <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                                 </div>
                                 <div>
                                   <p className="text-xs font-black text-blue-400 uppercase tracking-wider mb-0.5">Shipping Partner</p>
                                   <p className="font-bold text-blue-900">{order.courier.name || 'Standard Courier'}</p>
                                 </div>
                               </div>
                               
                               {order.courier.trackingLink ? (
                                 <a 
                                   href={order.courier.trackingLink} 
                                   target="_blank" 
                                   rel="noopener noreferrer" 
                                   className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                                 >
                                   Track Package <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                 </a>
                               ) : (
                                 <span className="w-full sm:w-auto bg-blue-100/50 text-blue-500 px-5 py-2.5 rounded-xl font-bold text-sm text-center border border-blue-100">
                                   Tracking link not available
                                 </span>
                               )}
                             </div>
                           )}
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
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white min-h-[400px]">
              <h1 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">Customer Messages</h1>
              {loadingMessages ? (
                <div className="flex justify-center py-10"><p className="font-bold text-slate-500">Loading messages...</p></div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <div key={msg._id} className="bg-slate-50/80 p-6 rounded-3xl border border-white shadow-sm flex flex-col gap-3 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">{msg.name}</h4>
                          <a href={`mailto:${msg.email}`} className="text-sm font-medium text-orange-500 hover:underline">{msg.email}</a>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                          {new Date(msg.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
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
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white min-h-[400px]">
              <h1 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">Edit Profile</h1>

              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="w-full bg-white p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-medium text-slate-900 transition-all shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Mobile / Email</label>
                    <input type="text" value={profile?.mobileNumber ? `+91 ${profile.mobileNumber}` : profile?.email || ''} disabled className="w-full bg-slate-100 text-slate-400 p-4 border border-slate-200 rounded-2xl outline-none font-medium cursor-not-allowed shadow-inner" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black text-slate-900">Saved Addresses</h3>
                    <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">{addresses.length} / 3</span>
                  </div>

                  {addresses.length === 0 && <p className="text-slate-400 text-sm italic mb-4">No addresses saved yet.</p>}

                  <div className="space-y-6">
                    {addresses.map((address, index) => (
                      <div key={index} className="bg-white p-5 rounded-3xl border border-slate-200 relative shadow-sm">
                        <div className="absolute top-4 right-4">
                          <button type="button" onClick={() => handleRemoveAddress(index)} className="text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-full shadow-sm border border-red-100 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                        <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-slate-400 text-[18px]">home_pin</span> Address #{index + 1}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" placeholder="Flat / Block No." value={address.flatNumber} onChange={(e) => handleAddressChange(index, 'flatNumber', e.target.value)} required className="w-full bg-slate-50 p-3 rounded-xl outline-none border border-slate-200 shadow-sm text-sm font-medium text-slate-900 focus:ring-2 focus:ring-orange-500" />
                          <input type="text" placeholder="Street / Locality" value={address.street} onChange={(e) => handleAddressChange(index, 'street', e.target.value)} required className="w-full bg-slate-50 p-3 rounded-xl outline-none border border-slate-200 shadow-sm text-sm font-medium text-slate-900 focus:ring-2 focus:ring-orange-500" />
                          <input type="text" placeholder="Landmark (Optional)" value={address.landmark} onChange={(e) => handleAddressChange(index, 'landmark', e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl outline-none border border-slate-200 shadow-sm text-sm font-medium text-slate-900 focus:ring-2 focus:ring-orange-500" />
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="City" value={address.city} onChange={(e) => handleAddressChange(index, 'city', e.target.value)} required className="w-full bg-slate-50 p-3 rounded-xl outline-none border border-slate-200 shadow-sm text-sm font-medium text-slate-900 focus:ring-2 focus:ring-orange-500" />
                            <input type="text" placeholder="Pincode" value={address.pincode} onChange={(e) => handleAddressChange(index, 'pincode', e.target.value)} required className="w-full bg-slate-50 p-3 rounded-xl outline-none border border-slate-200 shadow-sm text-sm font-medium text-slate-900 focus:ring-2 focus:ring-orange-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {addresses.length < 3 && (
                    <button type="button" onClick={handleAddAddress} className="mt-4 text-sm font-bold text-orange-500 flex items-center gap-1 hover:underline bg-white px-4 py-2 rounded-full transition-colors border border-orange-200 shadow-sm">
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