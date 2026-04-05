import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetMyOrdersQuery, useGetUserProfileQuery, useUpdateUserProfileMutation } from '../features/api/apiSlice';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'edit'
  
  const [name, setName] = useState('');
  const [addresses, setAddresses] = useState([]);

  const { data: orders, isLoading: loadingOrders } = useGetMyOrdersQuery();
  const { data: profile, isLoading: loadingProfile } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/auth');
    }
  }, [navigate]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAddresses(profile.addresses || []);
      
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if(userInfo) {
          localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, name: profile.name }));
      }
    }
  }, [profile]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/auth');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name, addresses }).unwrap();
      alert("Profile updated successfully!");
    } catch (error) {
      alert(error?.data?.message || "Failed to update profile");
    }
  };

  const handleAddAddress = () => {
    if (addresses.length >= 3) return alert("You can only save up to 3 addresses.");
    setAddresses([...addresses, { flatNumber: '', street: '', landmark: '', city: '', pincode: '' }]);
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setAddresses(newAddresses);
  };

  const handleRemoveAddress = (index) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(newAddresses);
  };

  if (loadingProfile) return <div className="pt-32 text-center font-bold">Loading...</div>;

  return (
    <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1100px] mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: USER AVATAR & TABS */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="card-surface p-8 rounded-[2.5rem] shadow-soft text-center border border-white">
            
            <div className="w-24 h-24 bg-primary-container text-white rounded-full flex items-center justify-center text-4xl font-black mx-auto mb-4 shadow-inner uppercase">
              {profile?.name ? profile.name.charAt(0) : 'U'}
            </div>
            
            <h2 className="text-2xl font-black text-zinc-800 mb-1">{profile?.name || 'Magical Guest'}</h2>
            <p className="text-zinc-500 font-bold mb-6">+91 {profile?.mobileNumber}</p>
            
            <div className="space-y-3 mb-6">
              <button onClick={() => setActiveTab('orders')} className={`w-full py-3 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${activeTab === 'orders' ? 'bg-zinc-900 text-white shadow-md' : 'bg-white/60 text-zinc-600 hover:bg-white border border-white'}`}>
                <span className="material-symbols-outlined">inventory_2</span> Order History
              </button>
              <button onClick={() => setActiveTab('edit')} className={`w-full py-3 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${activeTab === 'edit' ? 'bg-zinc-900 text-white shadow-md' : 'bg-white/60 text-zinc-600 hover:bg-white border border-white'}`}>
                <span className="material-symbols-outlined">edit</span> Edit Profile
              </button>
            </div>

            <button onClick={handleLogout} className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">logout</span> Sign Out
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: DYNAMIC CONTENT */}
        <div className="md:col-span-8">
          
          {/* TAB 1: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="card-surface p-8 rounded-[2.5rem] shadow-soft border border-white min-h-[400px] animate-[fadeIn_0.3s_ease-out]">
              <h1 className="text-3xl font-black text-zinc-800 mb-8 border-b border-white pb-4">Order History</h1>
              {loadingOrders ? (
                <div className="flex justify-center py-10"><p className="font-bold text-zinc-500">Loading orders...</p></div>
              ) : orders && orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white/60 p-6 rounded-3xl border border-white shadow-sm flex flex-col md:flex-row justify-between gap-4 hover:shadow-md transition-all">
                      <div>
                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Order: <span className="text-zinc-600 font-mono">{order._id.substring(order._id.length - 8)}</span></p>
                        <p className="text-sm font-bold text-zinc-800 mb-2">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">Paid</span>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-xs text-zinc-500 font-bold mb-1">{order.orderItems.length} Item(s)</p>
                        <p className="text-2xl font-black text-primary-container">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <span className="material-symbols-outlined text-[60px] text-zinc-300 mb-4">shopping_cart</span>
                  <p className="text-zinc-500 font-bold mb-4">No orders yet!</p>
                  <Link to="/shop" className="px-6 py-3 bg-primary-container text-white font-bold rounded-full">Start Shopping</Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EDIT PROFILE */}
          {activeTab === 'edit' && (
            <div className="card-surface p-8 rounded-[2.5rem] shadow-soft border border-white min-h-[400px] animate-[fadeIn_0.3s_ease-out]">
              <h1 className="text-3xl font-black text-zinc-800 mb-8 border-b border-white pb-4">Edit Profile</h1>
              
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-600 ml-1">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none font-medium text-zinc-800 shadow-inner" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-600 ml-1">Mobile Number</label>
                    <input type="text" value={`+91 ${profile?.mobileNumber}`} disabled className="w-full bg-zinc-100/50 text-zinc-400 p-4 border border-white rounded-2xl outline-none font-medium cursor-not-allowed shadow-inner" title="Mobile number cannot be changed" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black text-zinc-800">Saved Addresses</h3>
                    <span className="text-xs font-bold text-zinc-400 bg-white px-3 py-1 rounded-full shadow-sm border border-zinc-100">{addresses.length} / 3</span>
                  </div>

                  {addresses.length === 0 && <p className="text-zinc-400 text-sm italic mb-4">No addresses saved yet.</p>}

                  <div className="space-y-6">
                    {addresses.map((address, index) => (
                      <div key={index} className="bg-white/40 p-5 rounded-3xl border border-white relative shadow-sm">
                        <div className="absolute top-4 right-4">
                           <button type="button" onClick={() => handleRemoveAddress(index)} className="text-red-400 hover:text-red-600 bg-white p-1.5 rounded-full shadow-sm border border-zinc-100 transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                        </div>
                        <h4 className="font-bold text-zinc-700 mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-zinc-400 text-[18px]">home_pin</span> Address #{index + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" placeholder="Flat / Block No." value={address.flatNumber} onChange={(e) => handleAddressChange(index, 'flatNumber', e.target.value)} required className="w-full bg-white/80 p-3 rounded-xl outline-none border border-white shadow-inner text-sm font-medium text-zinc-800 focus:ring-2 focus:ring-primary-container/20" />
                          <input type="text" placeholder="Street / Locality" value={address.street} onChange={(e) => handleAddressChange(index, 'street', e.target.value)} required className="w-full bg-white/80 p-3 rounded-xl outline-none border border-white shadow-inner text-sm font-medium text-zinc-800 focus:ring-2 focus:ring-primary-container/20" />
                          <input type="text" placeholder="Landmark (Optional)" value={address.landmark} onChange={(e) => handleAddressChange(index, 'landmark', e.target.value)} className="w-full bg-white/80 p-3 rounded-xl outline-none border border-white shadow-inner text-sm font-medium text-zinc-800 focus:ring-2 focus:ring-primary-container/20" />
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="City" value={address.city} onChange={(e) => handleAddressChange(index, 'city', e.target.value)} required className="w-full bg-white/80 p-3 rounded-xl outline-none border border-white shadow-inner text-sm font-medium text-zinc-800 focus:ring-2 focus:ring-primary-container/20" />
                            <input type="text" placeholder="Pincode" value={address.pincode} onChange={(e) => handleAddressChange(index, 'pincode', e.target.value)} required className="w-full bg-white/80 p-3 rounded-xl outline-none border border-white shadow-inner text-sm font-medium text-zinc-800 focus:ring-2 focus:ring-primary-container/20" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {addresses.length < 3 && (
                    <button type="button" onClick={handleAddAddress} className="mt-4 text-sm font-bold text-primary-container flex items-center gap-1 hover:underline bg-primary-container/10 px-4 py-2 rounded-full transition-colors">
                      <span className="material-symbols-outlined text-[18px]">add_circle</span> Add New Address
                    </button>
                  )}
                </div>

                <button type="submit" disabled={isUpdating} className="w-full py-4 bg-zinc-900 text-white font-black text-lg rounded-2xl hover:bg-black shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95 disabled:opacity-50">
                  {isUpdating ? 'Saving Profile...' : 'Save Profile Details'}
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