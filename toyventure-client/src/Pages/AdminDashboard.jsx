import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useToggleCouponMutation,
  useGetProductsQuery,
  useDeleteReviewMutation,
  useGetAllUsersQuery,
  useToggleUserBanStatusMutation,
  useUpdateUserRoleMutation,
  useRequestAdminPromotionMutation,
  useConfirmAdminPromotionMutation
} from '../features/api/apiSlice';

const getFulfillmentMeta = (status) => {
  switch(status) {
    case 'confirmed': return { label: 'Confirmed', className: 'bg-red-50 border-red-100 text-red-700', icon: 'thumb_up' };
    case 'packed': return { label: 'Packed', className: 'bg-red-100 border-red-200 text-red-800', icon: 'inventory_2' };
    case 'dispatched': return { label: 'Dispatched', className: 'bg-red-600 border-red-700 text-white', icon: 'local_shipping' };
    case 'delivered': 
    case 'fulfilled': return { label: 'Delivered', className: 'bg-green-50 border-green-200 text-green-700', icon: 'check_circle' }; // Keeping green for success
    default: return { label: 'Processing', className: 'bg-white border-red-50 text-red-950/60', icon: 'hourglass_empty' };
  }
};

const getPaymentMeta = (status) => {
  switch(status) {
    case 'paid': return { label: 'Paid', className: 'bg-green-50 border-green-200 text-green-700', icon: 'check_circle' }; // Keeping green for paid
    case 'failed': return { label: 'Failed', className: 'bg-red-950 border-red-900 text-white', icon: 'error' };
    case 'refunded': return { label: 'Refunded', className: 'bg-red-50 border-red-100 text-red-700', icon: 'replay' };
    default: return { label: 'Pending', className: 'bg-white border-red-100 text-red-600', icon: 'timer' };
  }
};

const getNextAction = (orderStatus) => {
  if (!orderStatus || orderStatus === 'paid' || orderStatus === 'created' || orderStatus === 'pending_payment') {
    return { label: 'Mark Confirmed', nextStatus: 'confirmed', bg: 'bg-red-600 hover:bg-red-700 text-white' };
  }
  if (orderStatus === 'confirmed') return { label: 'Mark Packed', nextStatus: 'packed', bg: 'bg-red-700 hover:bg-red-800 text-white' };
  if (orderStatus === 'packed') return { label: 'Mark Dispatched', nextStatus: 'dispatched', bg: 'bg-red-950 hover:bg-black text-white' };
  if (orderStatus === 'dispatched') return { label: 'Mark Delivered', nextStatus: 'delivered', bg: 'bg-green-600 hover:bg-green-700 text-white' };
  return null;
};

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/60 backdrop-blur-sm fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-red-50 flex items-center justify-between bg-red-50/30">
          <h2 className="text-xl font-black text-red-950 flex items-center gap-2">
            <span className="material-symbols-outlined text-red-600">receipt_long</span> Order #{String(order._id).slice(-8)}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-red-50 rounded-full transition-colors">
            <span className="material-symbols-outlined text-red-950/40">close</span>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50/30 p-4 rounded-2xl border border-red-50 shadow-sm">
              <p className="text-[10px] font-black text-red-950/40 uppercase tracking-widest mb-1">Customer Details</p>
              <p className="font-bold text-red-950">{order.shippingDetails?.fullName || order.user?.name}</p>
              <p className="text-sm font-medium text-red-950/60 mt-0.5">{order.shippingDetails?.phone || order.user?.mobileNumber}</p>
            </div>
            <div className="bg-red-50/30 p-4 rounded-2xl border border-red-50 shadow-sm">
              <p className="text-[10px] font-black text-red-950/40 uppercase tracking-widest mb-1">Shipping Address</p>
              <p className="font-bold text-red-950 text-sm mt-0.5">{order.shippingDetails?.flatNumber}, {order.shippingDetails?.street}</p>
              {order.shippingDetails?.landmark && <p className="text-sm font-medium text-red-950/60">{order.shippingDetails.landmark}</p>}
              <p className="text-sm font-medium text-red-950/60">{order.shippingDetails?.city} - {order.shippingDetails?.pincode}</p>
            </div>
          </div>
          
          <div className="bg-red-50/30 p-4 rounded-2xl border border-red-50 shadow-sm">
            <p className="text-[10px] font-black text-red-950/40 uppercase tracking-widest mb-2">Payment Info</p>
            <div className="flex items-center gap-4 text-sm font-bold text-red-950 flex-wrap">
              <span className="bg-white px-3 py-1 rounded-md shadow-sm capitalize border border-red-50 text-red-600">{order.paymentMethod || 'Unknown'} Route</span>
              <span className="bg-white px-3 py-1 rounded-md shadow-sm border border-red-50 uppercase tracking-wider text-[10px]">Status: {order.paymentStatus || 'pending'}</span>
              {order.isGiftWrapped && (
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-md shadow-sm font-black text-[10px] flex items-center gap-1 border border-amber-200 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">redeem</span> Gift Wrap!
                </span>
              )}
            </div>
            {order.paymentFailureReason && <p className="text-xs text-red-600 mt-2 font-bold whitespace-pre-wrap">Error: {order.paymentFailureReason}</p>}
          </div>

          <div>
            <p className="text-[10px] font-black text-red-950/40 uppercase tracking-widest mb-3">Order Items</p>
            <div className="space-y-3">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-red-50 shadow-sm">
                  <div className="w-12 h-12 bg-red-50 rounded-xl overflow-hidden shrink-0 border border-red-100">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-red-950 line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-red-950/60 font-medium">Qty: {item.qty} x Rs {item.price}</p>
                  </div>
                  <div className="font-black text-red-950">Rs {item.price * item.qty}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-red-100 space-y-1.5 flex flex-col items-end text-sm font-bold text-red-950">
              {order.deliveryFee > 0 && <p className="w-full max-w-[200px] flex justify-between"><span className="text-red-950/50">Delivery Fee:</span> <span>Rs {order.deliveryFee}</span></p>}
              {order.giftWrapFee > 0 && <p className="w-full max-w-[200px] flex justify-between"><span className="text-red-950/50">Gift Wrap Fee:</span> <span>Rs {order.giftWrapFee}</span></p>}
              <p className="w-full max-w-[200px] flex justify-between text-lg pt-1 border-t border-red-50 mt-1"><span className="text-red-950/50 font-black">Total Paid:</span> <span className="font-black text-red-600">Rs {order.totalPrice}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { data: orders, isLoading } = useGetAllOrdersQuery(undefined, { pollingInterval: 5000 });
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const { data: users, isLoading: usersLoading } = useGetAllUsersQuery();
  const [toggleBanStatus] = useToggleUserBanStatusMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const [activeTab, setActiveTab] = useState('analytics');

  // Coupon state
  const { data: coupons } = useGetAllCouponsQuery();
  const [createCoupon] = useCreateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();
  const [toggleCoupon] = useToggleCouponMutation();
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxDiscount: '', usageLimit: '', expiresAt: '',
  });

  // Secure Admin Promotion State
  const [requestAdminPromotion, { isLoading: isRequestingOtp }] = useRequestAdminPromotionMutation();
  const [confirmAdminPromotion, { isLoading: isConfirmingAdmin }] = useConfirmAdminPromotionMutation();
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminStep, setAdminStep] = useState(1);
  const [adminTarget, setAdminTarget] = useState('');
  const [adminOtp, setAdminOtp] = useState('');

  // Review State
  const { data: productsData } = useGetProductsQuery({ limit: 100 });
  const [deleteReview] = useDeleteReviewMutation();
  
  const allReviews = productsData?.products?.reduce((acc, product) => {
    const productReviews = product.reviews.map(r => ({
      ...r,
      productId: product._id,
      productTitle: product.title,
      productImage: product.img
    }));
    return [...acc, ...productReviews];
  }, []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await createCoupon(couponForm).unwrap();
      toast.success('Promo code created!');
      setCouponForm({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxDiscount: '', usageLimit: '', expiresAt: '' });
      setShowCouponForm(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create coupon.');
    }
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    if (window.confirm(`Are you sure you want to advance this order to ${nextStatus.toUpperCase()}?`)) {
      try {
        await updateOrderStatus({ id, status: nextStatus }).unwrap();
        toast.success(`Order advanced to ${nextStatus}!`);
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to update order');
      }
    }
  };

  const handleDeleteReview = async (productId, reviewId) => {
    if (window.confirm('Delete this user review? This action cannot be undone.')) {
      try {
        await deleteReview({ productId, reviewId }).unwrap();
        toast.success('Review successfully deleted.');
      } catch (err) {
        toast.error('Failed to delete review.');
      }
    }
  };

  const handleRequestAdminOtp = async (e) => {
    e.preventDefault();
    if (!adminTarget) return toast.error('Please enter the target email or phone.');
    try {
      await requestAdminPromotion().unwrap();
      toast.success('Security OTP sent to YOUR device/email.');
      setAdminStep(2);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to request security OTP.');
    }
  };

  const handleConfirmAdmin = async (e) => {
    e.preventDefault();
    try {
      const payload = adminTarget.includes('@') 
        ? { targetEmail: adminTarget, otp: adminOtp } 
        : { targetMobile: adminTarget, otp: adminOtp };
        
      await confirmAdminPromotion(payload).unwrap();
      toast.success('Success! User promoted to Admin.');
      setShowAdminForm(false);
      setAdminStep(1);
      setAdminTarget('');
      setAdminOtp('');
    } catch (err) {
      toast.error(err?.data?.message || 'Invalid OTP or failed to promote.');
    }
  };

  const analyticsData = useMemo(() => {
    if (!orders) return null;

    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse();

    const revenueData = last7Days.map(dateLabel => {
      const dailyRevenue = orders.filter(order => {
        const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return orderDate === dateLabel && (order.paymentStatus === 'paid' || order.paymentMethod === 'cod');
      }).reduce((acc, order) => acc + order.totalPrice, 0);
      return { date: dateLabel, Revenue: dailyRevenue };
    });

    const topToysMap = {};
    orders.forEach(order => {
      if (order.paymentStatus === 'paid' || order.paymentMethod === 'cod') {
        order.orderItems?.forEach(item => {
          topToysMap[item.title] = (topToysMap[item.title] || 0) + item.qty;
        });
      }
    });
    const topToysData = Object.keys(topToysMap)
      .map(key => ({ name: key, Sales: topToysMap[key] }))
      .sort((a,b) => b.Sales - a.Sales)
      .slice(0, 5);

    const fulfillmentData = [
      { name: 'Pending', value: orders.filter(o => o.orderStatus === 'created' || o.orderStatus === 'pending_payment').length, color: '#fca5a5' }, // red-300
      { name: 'Confirmed', value: orders.filter(o => o.orderStatus === 'confirmed').length, color: '#ef4444' }, // red-500
      { name: 'Packed', value: orders.filter(o => o.orderStatus === 'packed').length, color: '#b91c1c' }, // red-700
      { name: 'Dispatched', value: orders.filter(o => o.orderStatus === 'dispatched').length, color: '#7f1d1d' }, // red-900
    ].filter(item => item.value > 0);

    return { revenueData, topToysData, fulfillmentData };
  }, [orders]);


  if (isLoading) {
    return <div className="pt-32 text-center font-bold text-red-950/50">Loading Command Center...</div>;
  }

  const totalRevenue = orders?.reduce((acc, order) => acc + (order.paymentStatus === 'paid' || order.paymentMethod === 'cod' ? order.totalPrice : 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter((order) => order.orderStatus !== 'delivered' && order.orderStatus !== 'fulfilled' && order.orderStatus !== 'cancelled').length || 0;

  return (
    <main className="pt-28 pb-24 min-h-screen bg-white bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1300px] mx-auto px-6 relative z-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/60 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-red-50 shadow-sm">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-red-950 tracking-tight">Admin Dashboard</h1>
            <p className="text-red-950/50 font-bold mt-2">Overview of your sales, revenue, and fulfillment queue.</p>
          </div>

          <Link to="/admin/catalog" className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black shadow-md shadow-red-600/20 hover:bg-red-700 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 w-full md:w-auto">
            <span className="material-symbols-outlined">inventory_2</span> Manage Inventory
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-red-50 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 shadow-inner">
              <span className="material-symbols-outlined text-[32px]">payments</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-red-950/40 uppercase tracking-widest mb-1">Total Revenue</p>
              <h3 className="text-3xl font-black text-red-950">Rs {totalRevenue.toLocaleString('en-IN')}</h3>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-red-50 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 shadow-inner">
              <span className="material-symbols-outlined text-[32px]">shopping_bag</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-red-950/40 uppercase tracking-widest mb-1">Total Orders</p>
              <h3 className="text-3xl font-black text-red-950">{totalOrders}</h3>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-red-50 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 shadow-inner">
              <span className="material-symbols-outlined text-[32px]">pending_actions</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-red-950/40 uppercase tracking-widest mb-1">Active Queue</p>
              <h3 className="text-3xl font-black text-red-950">{pendingOrders}</h3>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 bg-white/60 backdrop-blur-sm p-2 rounded-2xl border border-red-50 shadow-sm w-max flex-wrap">
          <button onClick={() => setActiveTab('analytics')} className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-red-950 text-white shadow-md' : 'text-red-950/50 hover:text-red-950 hover:bg-white/80'}`}>
            <span className="material-symbols-outlined text-[18px]">bar_chart</span> Analytics
          </button>
          <button onClick={() => setActiveTab('customers')} className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'customers' ? 'bg-red-950 text-white shadow-md' : 'text-red-950/50 hover:text-red-950 hover:bg-white/80'}`}>
            <span className="material-symbols-outlined text-[18px]">group</span> Customers
            {users?.length > 0 && <span className="bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">{users.length}</span>}
          </button>
          <button onClick={() => setActiveTab('orders')} className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-red-950 text-white shadow-md' : 'text-red-950/50 hover:text-red-950 hover:bg-white/80'}`}>
            <span className="material-symbols-outlined text-[18px]">local_shipping</span> Orders
          </button>
          <button onClick={() => setActiveTab('promos')} className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'promos' ? 'bg-red-950 text-white shadow-md' : 'text-red-950/50 hover:text-red-950 hover:bg-white/80'}`}>
            <span className="material-symbols-outlined text-[18px]">sell</span> Promo Codes
            {coupons?.length > 0 && <span className="bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">{coupons.length}</span>}
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'reviews' ? 'bg-red-950 text-white shadow-md' : 'text-red-950/50 hover:text-red-950 hover:bg-white/80'}`}>
            <span className="material-symbols-outlined text-[18px]">rate_review</span> Moderation
            {allReviews.length > 0 && <span className="bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">{allReviews.length}</span>}
          </button>
        </div>

        {/* ============= ANALYTICS TAB ============= */}
        {activeTab === 'analytics' && analyticsData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-in">
            <div className="bg-white p-8 rounded-[2.5rem] border border-red-50 shadow-sm lg:col-span-2">
              <h3 className="text-xl font-black text-red-950 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">trending_up</span> 7-Day Revenue Trend
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fee2e2" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#fca5a5', fontSize: 12, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#fca5a5', fontSize: 12, fontWeight: 700}} dx={-10} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: '1px solid #fee2e2', boxShadow: '0 10px 25px -5px rgba(69, 10, 10, 0.1)', fontWeight: 'bold' }} itemStyle={{ color: '#dc2626', fontWeight: 900 }} />
                    <Line type="monotone" dataKey="Revenue" stroke="#dc2626" strokeWidth={4} dot={{r: 6, fill: '#dc2626', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-red-50 shadow-sm">
              <h3 className="text-xl font-black text-red-950 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">star</span> Best Selling Toys
              </h3>
              <div className="h-[250px] w-full">
                {analyticsData.topToysData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.topToysData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#fee2e2" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#991b1b', fontSize: 11, fontWeight: 700}} width={120} />
                      <Tooltip cursor={{fill: '#fef2f2'}} contentStyle={{ borderRadius: '1rem', border: '1px solid #fee2e2', boxShadow: '0 10px 25px -5px rgba(69, 10, 10, 0.1)' }} />
                      <Bar dataKey="Sales" fill="#dc2626" radius={[0, 8, 8, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-red-950/40 font-bold">No sales data yet.</div>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-red-50 shadow-sm">
              <h3 className="text-xl font-black text-red-950 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600">pie_chart</span> Active Bottlenecks
              </h3>
              <div className="h-[250px] w-full flex items-center justify-center relative">
                {analyticsData.fulfillmentData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={analyticsData.fulfillmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                          {analyticsData.fulfillmentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '1rem', border: '1px solid #fee2e2', boxShadow: '0 10px 25px -5px rgba(69, 10, 10, 0.1)', fontWeight: 'bold' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 -translate-y-1/2 right-0 flex flex-col gap-3">
                      {analyticsData.fulfillmentData.map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-bold text-red-950/70">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                          {entry.name} ({entry.value})
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-red-950/40 font-bold text-center">
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">done_all</span><br/>Queue is empty!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============= ORDERS TAB ============= */}
        {activeTab === 'orders' && (
        <div className="bg-white rounded-[2.5rem] border border-red-50 shadow-sm overflow-hidden fade-in">
          <div className="p-8 border-b border-red-50/50 bg-red-50/30 flex items-center justify-between">
            <h2 className="text-2xl font-black text-red-950 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600 text-[28px]">local_shipping</span>
              Fulfillment Pipeline
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-red-50/50 border-b border-red-50">
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest pl-8">Order ID</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest">Customer</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest">Payment</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest">Fulfillment</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest pr-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => {
                  const fulfillMeta = getFulfillmentMeta(order.orderStatus);
                  const payMeta = getPaymentMeta(order.paymentStatus);
                  const nextAction = getNextAction(order.orderStatus);

                  return (
                    <tr key={order._id} className="hover:bg-red-50/20 transition-colors border-b border-red-50 group">
                      <td className="p-5 font-mono text-sm font-bold text-red-950/60 pl-8">
                        ...{order._id.substring(order._id.length - 6)}
                        <p className="text-[10px] text-red-950/40 font-sans mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </p>
                      </td>
                      <td className="p-5">
                        <p className="font-bold text-red-950">{order.user?.name || order.shippingDetails?.fullName}</p>
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs font-black text-red-600 hover:text-red-700 flex items-center gap-1 mt-1 transition-colors uppercase tracking-widest"
                        >
                          <span className="material-symbols-outlined text-[14px]">visibility</span> Details
                        </button>
                      </td>
                      <td className="p-5">
                        <span className={`${payMeta.className} text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1 w-max shadow-sm`}>
                          <span className="material-symbols-outlined text-[14px]">{payMeta.icon}</span>
                          {payMeta.label}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className={`${fulfillMeta.className} text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1 w-max shadow-sm`}>
                          <span className="material-symbols-outlined text-[14px]">{fulfillMeta.icon}</span>
                          {fulfillMeta.label}
                        </span>
                      </td>
                      <td className="p-5 pr-8 text-right flex items-center justify-end gap-2">
                        {nextAction ? (
                          <button
                            onClick={() => handleUpdateStatus(order._id, nextAction.nextStatus)}
                            disabled={isUpdating}
                            className={`${nextAction.bg} text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-md hover:-translate-y-0.5 disabled:opacity-50`}
                          >
                            {nextAction.label}
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-red-950/40 flex items-center justify-end gap-1 px-4 py-2.5 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-[14px]">done_all</span> Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {orders?.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-16">
                      <span className="material-symbols-outlined text-[48px] text-red-200 mb-2 block">inbox</span>
                      <p className="text-red-950/50 font-bold">No orders have been placed yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* ============= PROMOS TAB ============= */}
        {activeTab === 'promos' && (
        <div className="bg-white rounded-[2.5rem] border border-red-50 shadow-sm overflow-hidden fade-in">
          <div className="p-8 border-b border-red-50/50 bg-red-50/30 flex items-center justify-between">
            <h2 className="text-2xl font-black text-red-950 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600 text-[28px]">sell</span>
              Promo Code Manager
            </h2>
            <button
              onClick={() => setShowCouponForm(!showCouponForm)}
              className="bg-red-950 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-red-900 transition-all shadow-md hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[18px]">{showCouponForm ? 'close' : 'add'}</span>
              {showCouponForm ? 'Cancel' : 'New Code'}
            </button>
          </div>

          {showCouponForm && (
            <form onSubmit={handleCreateCoupon} className="p-8 border-b border-red-50 bg-red-50/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-red-950/50 uppercase tracking-widest">Promo Code *</label>
                  <input required value={couponForm.code} onChange={(e) => setCouponForm(p => ({...p, code: e.target.value.toUpperCase()}))} placeholder="e.g. SUMMER20" className="w-full bg-white p-3 border border-red-100 rounded-xl font-bold text-sm uppercase focus:ring-2 focus:ring-red-600 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-red-950/50 uppercase tracking-widest">Discount Type *</label>
                  <select value={couponForm.discountType} onChange={(e) => setCouponForm(p => ({...p, discountType: e.target.value}))} className="w-full bg-white p-3 border border-red-100 rounded-xl font-bold text-sm focus:ring-2 focus:ring-red-600 outline-none">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-red-950/50 uppercase tracking-widest">Discount Value *</label>
                  <input required type="number" min="1" value={couponForm.discountValue} onChange={(e) => setCouponForm(p => ({...p, discountValue: e.target.value}))} placeholder={couponForm.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 500'} className="w-full bg-white p-3 border border-red-100 rounded-xl font-bold text-sm focus:ring-2 focus:ring-red-600 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-red-950/50 uppercase tracking-widest">Min Order (Rs)</label>
                  <input type="number" min="0" value={couponForm.minOrderAmount} onChange={(e) => setCouponForm(p => ({...p, minOrderAmount: e.target.value}))} placeholder="0 = no min" className="w-full bg-white p-3 border border-red-100 rounded-xl font-bold text-sm focus:ring-2 focus:ring-red-600 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-red-950/50 uppercase tracking-widest">Max Discount (Rs)</label>
                  <input type="number" min="0" value={couponForm.maxDiscount} onChange={(e) => setCouponForm(p => ({...p, maxDiscount: e.target.value}))} placeholder="Cap for %" className="w-full bg-white p-3 border border-red-100 rounded-xl font-bold text-sm focus:ring-2 focus:ring-red-600 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-red-950/50 uppercase tracking-widest">Usage Limit</label>
                  <input type="number" min="1" value={couponForm.usageLimit} onChange={(e) => setCouponForm(p => ({...p, usageLimit: e.target.value}))} placeholder="Empty = unlimited" className="w-full bg-white p-3 border border-red-100 rounded-xl font-bold text-sm focus:ring-2 focus:ring-red-600 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-red-950/50 uppercase tracking-widest">Expiry Date</label>
                  <input type="date" value={couponForm.expiresAt} onChange={(e) => setCouponForm(p => ({...p, expiresAt: e.target.value}))} className="w-full bg-white p-3 border border-red-100 rounded-xl font-bold text-sm focus:ring-2 focus:ring-red-600 outline-none" />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-md shadow-red-600/20 hover:-translate-y-0.5">Create Promo</button>
                </div>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-red-50/50 border-b border-red-50">
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest pl-8">Code</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest">Discount</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest">Min Order</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest">Usage</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest">Status</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest pr-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons?.map((coupon) => {
                  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                  const isAtLimit = coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit;
                  return (
                    <tr key={coupon._id} className="hover:bg-red-50/20 border-b border-red-50 transition-colors">
                      <td className="p-5 pl-8">
                        <span className="font-mono font-black text-red-950 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg text-sm">{coupon.code}</span>
                      </td>
                      <td className="p-5">
                        <span className="font-black text-red-950">
                          {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `Rs ${coupon.discountValue}`}
                        </span>
                        {coupon.maxDiscount && <span className="text-[10px] text-red-950/50 ml-1">(max Rs {coupon.maxDiscount})</span>}
                      </td>
                      <td className="p-5 text-sm font-bold text-red-950/70">
                        {coupon.minOrderAmount > 0 ? `Rs ${coupon.minOrderAmount}` : '—'}
                      </td>
                      <td className="p-5 text-sm font-bold text-red-950/70">
                        {coupon.usedCount}{coupon.usageLimit !== null ? ` / ${coupon.usageLimit}` : ' / ∞'}
                      </td>
                      <td className="p-5">
                        {isExpired ? (
                          <span className="text-xs font-black bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-full">Expired</span>
                        ) : isAtLimit ? (
                          <span className="text-xs font-black bg-red-50 text-red-950/50 border border-red-100 px-3 py-1.5 rounded-full">Exhausted</span>
                        ) : coupon.isActive ? (
                          <span className="text-xs font-black bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-full">Active</span>
                        ) : (
                          <span className="text-xs font-black bg-white text-red-950/40 border border-red-50 px-3 py-1.5 rounded-full">Disabled</span>
                        )}
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={async () => { try { await toggleCoupon(coupon._id).unwrap(); toast.success(`Coupon ${coupon.isActive ? 'disabled' : 'enabled'}`); } catch(e) { toast.error('Failed'); } }} className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-950/40 hover:text-red-950" title={coupon.isActive ? 'Disable' : 'Enable'}>
                            <span className="material-symbols-outlined text-[18px]">{coupon.isActive ? 'toggle_on' : 'toggle_off'}</span>
                          </button>
                          <button onClick={async () => { if (window.confirm('Delete this promo code?')) { try { await deleteCoupon(coupon._id).unwrap(); toast.success('Coupon deleted.'); } catch(e) { toast.error('Failed'); } } }} className="p-2 rounded-lg hover:bg-red-100 transition-colors text-red-400 hover:text-red-600" title="Delete">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {(!coupons || coupons.length === 0) && (
                  <tr>
                    <td colSpan="6" className="text-center py-16">
                      <span className="material-symbols-outlined text-[48px] text-red-200 mb-2 block">sell</span>
                      <p className="text-red-950/50 font-bold">No promo codes yet. Click "New Code" to get started!</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* ============= CUSTOMERS TAB ============= */}
        {activeTab === 'customers' && (
        <div className="bg-white rounded-[2.5rem] border border-red-50 shadow-sm overflow-hidden fade-in">
          <div className="p-8 border-b border-red-50/50 bg-red-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-red-950 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600 text-[28px]">group</span>
              Customer Directory
            </h2>
            <button
              onClick={() => {
                setShowAdminForm(!showAdminForm);
                setAdminStep(1);
                setAdminOtp('');
              }}
              className="bg-red-950 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-red-900 transition-all shadow-md hover:-translate-y-0.5 w-max"
            >
              <span className="material-symbols-outlined text-[18px]">{showAdminForm ? 'close' : 'security'}</span>
              {showAdminForm ? 'Cancel' : 'Add Admin'}
            </button>
          </div>

          {/* SECURE ADMIN ADDITION FORM */}
          {showAdminForm && (
            <div className="p-8 border-b border-red-100 bg-red-50/50">
              <div className="max-w-md bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                <h3 className="font-black text-red-950 mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600">admin_panel_settings</span>
                  Promote to Admin
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-red-950/60 font-bold mb-5">
                  Security Check: To promote someone, we will send an OTP to <strong>your</strong> registered admin email/phone to verify it's you making the change.
                </p>

                {adminStep === 1 ? (
                  <form onSubmit={handleRequestAdminOtp} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-red-950/50 uppercase tracking-widest">Target User's Email or Phone</label>
                      <input 
                        required 
                        value={adminTarget} 
                        onChange={(e) => setAdminTarget(e.target.value)} 
                        placeholder="user@example.com" 
                        className="w-full mt-1 bg-red-50/50 p-3 border border-red-50 rounded-xl font-bold text-sm focus:ring-2 focus:ring-red-600 outline-none" 
                      />
                    </div>
                    <button disabled={isRequestingOtp} type="submit" className="w-full bg-red-950 text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-900 transition-all shadow-md disabled:opacity-50">
                      {isRequestingOtp ? 'Sending...' : 'Send OTP to My Device'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleConfirmAdmin} className="space-y-4 fade-in">
                    <div>
                      <label className="text-[10px] font-black text-red-950/50 uppercase tracking-widest">Enter OTP Sent to You</label>
                      <input 
                        required 
                        value={adminOtp} 
                        onChange={(e) => setAdminOtp(e.target.value)} 
                        placeholder="123456" 
                        className="w-full mt-1 bg-red-50 p-3 border border-red-100 rounded-xl font-black text-center text-lg tracking-[0.5em] focus:ring-2 focus:ring-red-600 outline-none text-red-700" 
                      />
                    </div>
                    <button disabled={isConfirmingAdmin} type="submit" className="w-full bg-red-600 text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-md shadow-red-600/20 disabled:opacity-50">
                      {isConfirmingAdmin ? 'Verifying...' : 'Verify & Promote User'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-red-50/50 border-b border-red-50">
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest pl-8">Customer</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest">Contact</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest text-center">Orders</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest text-center">Total Spend</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest">Status</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest pr-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user._id} className={`hover:bg-red-50/20 transition-colors border-b border-red-50 group ${user.isBanned ? 'opacity-50 grayscale' : ''}`}>
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold border border-red-100">
                           {user.name ? user.name.charAt(0).toUpperCase() : <span className="material-symbols-outlined text-[18px]">person</span>}
                        </div>
                        <div>
                          <p className="font-bold text-red-950 text-sm flex items-center gap-1">
                            {user.name || 'Anonymous User'} 
                            {user.role === 'admin' && <span className="material-symbols-outlined text-red-600 text-[14px]" title="Admin">shield</span>}
                          </p>
                          <p className="text-[10px] text-red-950/50 font-bold">Joined: {new Date(user.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="text-sm font-medium text-red-950/70 truncate max-w-[150px]" title={user.email}>{user.email || '—'}</p>
                      <p className="text-xs text-red-950/50 font-medium">{user.mobileNumber || '—'}</p>
                    </td>
                    <td className="p-5 text-center">
                      <span className="font-black text-red-950">{user.orderCount || 0}</span>
                    </td>
                    <td className="p-5 text-center">
                      <span className="font-black text-red-950">Rs {(user.totalSpend || 0).toLocaleString('en-IN')}</span>
                    </td>
                    <td className="p-5">
                      {user.isBanned ? (
                        <span className="text-[10px] uppercase tracking-widest font-black bg-red-950 text-white border border-red-950 px-3 py-1.5 rounded-full flex items-center gap-1 w-max"><span className="material-symbols-outlined text-[12px]">block</span> Banned</span>
                      ) : user.role === 'admin' ? (
                        <span className="text-[10px] uppercase tracking-widest font-black bg-red-600 text-white border border-red-700 px-3 py-1.5 rounded-full flex items-center gap-1 w-max"><span className="material-symbols-outlined text-[12px]">admin_panel_settings</span> Admin</span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-widest font-black bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-full flex items-center gap-1 w-max"><span className="material-symbols-outlined text-[12px]">check_circle</span> Active</span>
                      )}
                    </td>
                    <td className="p-5 pr-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to ${user.isBanned ? 'unban' : 'ban'} this user?`)) {
                              try { await toggleBanStatus(user._id).unwrap(); toast.success(`User successfully ${user.isBanned ? 'unbanned' : 'banned'}.`); } catch(e) { toast.error(e?.data?.message || 'Action failed.'); }
                            }
                          }}
                          className={`p-2 rounded-lg transition-colors ${user.isBanned ? 'bg-red-950 text-white hover:bg-black' : 'bg-red-50 text-red-500 hover:bg-red-600 hover:text-white'}`} 
                          title={user.isBanned ? 'Unban User' : 'Ban User'}
                        >
                          <span className="material-symbols-outlined text-[18px]">{user.isBanned ? 'lock_open' : 'block'}</span>
                        </button>
                        <button 
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to ${user.role === 'admin' ? 'remove admin rights from' : 'promote'} this user?`)) {
                              try { await updateUserRole(user._id).unwrap(); toast.success('User role updated.'); } catch(e) { toast.error(e?.data?.message || 'Action failed.'); }
                            }
                          }}
                          className={`p-2 rounded-lg flex items-center transition-colors ${user.role === 'admin' ? 'bg-red-50 text-red-950/40 hover:text-red-950' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100'}`} 
                          title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin (Legacy method)'}
                        >
                          <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!users || users.length === 0) && (
                  <tr>
                    <td colSpan="6" className="text-center py-16">
                      <span className="material-symbols-outlined text-[48px] text-red-200 mb-2 block">group_off</span>
                      <p className="text-red-950/50 font-bold">No registered customers found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* ============= REVIEWS MODERATION TAB ============= */}
        {activeTab === 'reviews' && (
        <div className="bg-white rounded-[2.5rem] border border-red-50 shadow-sm overflow-hidden fade-in">
          <div className="p-8 border-b border-red-50/50 bg-red-50/30 flex items-center justify-between">
            <h2 className="text-2xl font-black text-red-950 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600 text-[28px]">rate_review</span>
              Review Moderation
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-red-50/50 border-b border-red-50">
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest pl-8 w-[250px]">Product</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest w-[150px]">User & Rating</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest">Comment</th>
                  <th className="p-5 text-[10px] font-black text-red-950/40 uppercase tracking-widest pr-8 text-right w-[100px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {allReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-red-50/20 transition-colors border-b border-red-50 group">
                    <td className="p-5 pl-8 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-red-50 shrink-0">
                        <img src={review.productImage} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <Link to={`/product/${review.productId}`} className="font-bold text-sm text-red-950 hover:text-red-600 transition-colors line-clamp-2">
                        {review.productTitle}
                      </Link>
                    </td>
                    <td className="p-5">
                      <p className="font-bold text-red-950 text-sm flex items-center gap-1">
                        {review.name}
                        <span className="material-symbols-outlined text-red-600 text-[14px]" title="Verified Buyer">verified</span>
                      </p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`material-symbols-outlined text-[14px] ${i < review.rating ? 'text-red-600 filled' : 'text-red-100'}`}>star</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="text-sm font-medium text-red-950/70 line-clamp-3">{review.comment}</p>
                      <p className="text-[10px] text-red-950/40 font-bold mt-1 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
                    </td>
                    <td className="p-5 pr-8 text-right">
                      <button 
                        onClick={() => handleDeleteReview(review.productId, review._id)}
                        className="bg-red-50 text-red-500 hover:bg-red-600 hover:text-white p-2 rounded-xl transition-all shadow-sm flex items-center justify-center w-max ml-auto"
                        title="Delete Review"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {allReviews.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-16">
                      <span className="material-symbols-outlined text-[48px] text-red-200 mb-2 block">rate_review</span>
                      <p className="text-red-950/50 font-bold">No reviews have been submitted yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>

      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </main>
  );
};

export default AdminDashboard;