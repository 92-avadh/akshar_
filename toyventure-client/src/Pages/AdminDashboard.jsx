import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useToggleCouponMutation,
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
    default: return { label: 'Pending', className: 'bg-orange-50 border-orange-200 text-orange-700', icon: 'timer' };
  }
};

const getNextAction = (orderStatus) => {
  if (!orderStatus || orderStatus === 'paid' || orderStatus === 'created' || orderStatus === 'pending_payment') {
    return { label: 'Mark Confirmed', nextStatus: 'confirmed', bg: 'bg-indigo-600 hover:bg-indigo-700 text-white' };
  }
  if (orderStatus === 'confirmed') return { label: 'Mark Packed', nextStatus: 'packed', bg: 'bg-purple-600 hover:bg-purple-700 text-white' };
  if (orderStatus === 'packed') return { label: 'Mark Dispatched', nextStatus: 'dispatched', bg: 'bg-orange-600 hover:bg-orange-700 text-white' };
  if (orderStatus === 'dispatched') return { label: 'Mark Delivered', nextStatus: 'delivered', bg: 'bg-green-600 hover:bg-green-700 text-white' };
  return null;
};

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">receipt_long</span> Order #{String(order._id).slice(-8)}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <span className="material-symbols-outlined text-slate-500">close</span>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Customer Details</p>
              <p className="font-bold text-slate-800">{order.shippingDetails?.fullName || order.user?.name}</p>
              <p className="text-sm font-medium text-slate-500 mt-0.5">{order.shippingDetails?.phone || order.user?.mobileNumber}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Shipping Address</p>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{order.shippingDetails?.flatNumber}, {order.shippingDetails?.street}</p>
              {order.shippingDetails?.landmark && <p className="text-sm font-medium text-slate-500">{order.shippingDetails.landmark}</p>}
              <p className="text-sm font-medium text-slate-500">{order.shippingDetails?.city} - {order.shippingDetails?.pincode}</p>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Payment Info</p>
            <div className="flex items-center gap-4 text-sm font-bold text-slate-700">
              <span className="bg-white px-3 py-1 rounded-md shadow-sm capitalize border border-slate-100 text-primary-container">{order.paymentMethod || 'Unknown'} Route</span>
              <span className="bg-white px-3 py-1 rounded-md shadow-sm border border-slate-100 uppercase tracking-wider text-xs">Status: {order.paymentStatus || 'pending'}</span>
            </div>
            {order.paymentFailureReason && <p className="text-xs text-red-500 mt-2 font-bold whitespace-pre-wrap">Error: {order.paymentFailureReason}</p>}
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Order Items</p>
            <div className="space-y-3">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">Qty: {item.qty} x Rs {item.price}</p>
                  </div>
                  <div className="font-black text-slate-800">Rs {item.price * item.qty}</div>
                </div>
              ))}
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');

  // Coupon state
  const { data: coupons, isLoading: isCouponsLoading } = useGetAllCouponsQuery();
  const [createCoupon] = useCreateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();
  const [toggleCoupon] = useToggleCouponMutation();
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxDiscount: '', usageLimit: '', expiresAt: '',
  });

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
      } catch (err) {
        alert(err?.data?.message || 'Failed to update order');
      }
    }
  };

  if (isLoading) {
    return <div className="pt-32 text-center font-bold text-zinc-500">Loading Command Center...</div>;
  }

  const totalRevenue = orders?.reduce((acc, order) => acc + (order.paymentStatus === 'paid' ? order.totalPrice : 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter((order) => order.orderStatus !== 'delivered' && order.orderStatus !== 'fulfilled' && order.orderStatus !== 'cancelled').length || 0;

  return (
    <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1300px] mx-auto px-6 relative z-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/60 p-6 md:p-8 rounded-[2.5rem] border border-white shadow-sm">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-zinc-800 tracking-tight">Admin Dashboard</h1>
            <p className="text-zinc-500 font-bold mt-2">Overview of your sales, revenue, and fulfillment queue.</p>
          </div>

          <Link to="/admin/catalog" className="bg-primary-container text-white px-8 py-4 rounded-2xl font-black shadow-md hover:bg-orange-600 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 w-full md:w-auto">
            <span className="material-symbols-outlined">inventory_2</span> Manage Inventory
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card-surface p-8 rounded-[2.5rem] border border-white shadow-soft flex items-center gap-6">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center border border-green-100 shadow-inner">
              <span className="material-symbols-outlined text-[32px]">payments</span>
            </div>
            <div>
              <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Total Revenue</p>
              <h3 className="text-3xl font-black text-zinc-800">Rs {totalRevenue.toLocaleString('en-IN')}</h3>
            </div>
          </div>

          <div className="card-surface p-8 rounded-[2.5rem] border border-white shadow-soft flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
              <span className="material-symbols-outlined text-[32px]">shopping_bag</span>
            </div>
            <div>
              <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Total Orders</p>
              <h3 className="text-3xl font-black text-zinc-800">{totalOrders}</h3>
            </div>
          </div>

          <div className="card-surface p-8 rounded-[2.5rem] border border-white shadow-soft flex items-center gap-6">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center border border-orange-100 shadow-inner">
              <span className="material-symbols-outlined text-[32px]">pending_actions</span>
            </div>
            <div>
              <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Active Queue</p>
              <h3 className="text-3xl font-black text-zinc-800">{pendingOrders}</h3>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 bg-white/60 p-2 rounded-2xl border border-white shadow-sm w-max">
          <button onClick={() => setActiveTab('orders')} className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-800 hover:bg-white/80'}`}>
            <span className="material-symbols-outlined text-[18px]">local_shipping</span> Orders
          </button>
          <button onClick={() => setActiveTab('promos')} className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'promos' ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-800 hover:bg-white/80'}`}>
            <span className="material-symbols-outlined text-[18px]">sell</span> Promo Codes
            {coupons?.length > 0 && <span className="bg-primary-container text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{coupons.length}</span>}
          </button>
        </div>

        {activeTab === 'orders' && (
        <div className="card-surface rounded-[2.5rem] border border-white shadow-soft overflow-hidden">
          <div className="p-8 border-b border-zinc-100/50 bg-white/50 flex items-center justify-between">
            <h2 className="text-2xl font-black text-zinc-800 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container text-[28px]">local_shipping</span>
              Fulfillment Pipeline
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100">
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider pl-8">Order ID</th>
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider">Customer</th>
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider">Payment</th>
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider">Fulfillment</th>
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider pr-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => {
                  const fulfillMeta = getFulfillmentMeta(order.orderStatus);
                  const payMeta = getPaymentMeta(order.paymentStatus);
                  const nextAction = getNextAction(order.orderStatus);

                  return (
                    <tr key={order._id} className="hover:bg-white transition-colors border-b border-zinc-50 group">
                      <td className="p-5 font-mono text-sm font-bold text-zinc-500 pl-8">
                        ...{order._id.substring(order._id.length - 6)}
                        <p className="text-[10px] text-zinc-400 font-sans mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </p>
                      </td>
                      <td className="p-5">
                        <p className="font-bold text-zinc-800">{order.user?.name || order.shippingDetails?.fullName}</p>
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs font-black text-primary-container hover:text-orange-600 flex items-center gap-1 mt-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">visibility</span> See Details
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
                          <span className="text-xs font-bold text-zinc-400 flex items-center justify-end gap-1 px-4 py-2.5">
                            <span className="material-symbols-outlined text-[16px]">done_all</span> Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {orders?.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-16">
                      <span className="material-symbols-outlined text-[48px] text-zinc-300 mb-2 block">inbox</span>
                      <p className="text-zinc-500 font-bold">No orders have been placed yet.</p>
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
        <div className="card-surface rounded-[2.5rem] border border-white shadow-soft overflow-hidden">
          <div className="p-8 border-b border-zinc-100/50 bg-white/50 flex items-center justify-between">
            <h2 className="text-2xl font-black text-zinc-800 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container text-[28px]">sell</span>
              Promo Code Manager
            </h2>
            <button
              onClick={() => setShowCouponForm(!showCouponForm)}
              className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-black transition-all shadow-md hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[18px]">{showCouponForm ? 'close' : 'add'}</span>
              {showCouponForm ? 'Cancel' : 'New Code'}
            </button>
          </div>

          {showCouponForm && (
            <form onSubmit={handleCreateCoupon} className="p-8 border-b border-zinc-100 bg-zinc-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-wider">Promo Code *</label>
                  <input required value={couponForm.code} onChange={(e) => setCouponForm(p => ({...p, code: e.target.value.toUpperCase()}))} placeholder="e.g. SUMMER20" className="w-full bg-white p-3 border border-zinc-200 rounded-xl font-bold text-sm uppercase focus:ring-2 focus:ring-primary-container/20 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-wider">Discount Type *</label>
                  <select value={couponForm.discountType} onChange={(e) => setCouponForm(p => ({...p, discountType: e.target.value}))} className="w-full bg-white p-3 border border-zinc-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-primary-container/20 outline-none">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-wider">Discount Value *</label>
                  <input required type="number" min="1" value={couponForm.discountValue} onChange={(e) => setCouponForm(p => ({...p, discountValue: e.target.value}))} placeholder={couponForm.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 500'} className="w-full bg-white p-3 border border-zinc-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-primary-container/20 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-wider">Min Order (Rs)</label>
                  <input type="number" min="0" value={couponForm.minOrderAmount} onChange={(e) => setCouponForm(p => ({...p, minOrderAmount: e.target.value}))} placeholder="0 = no min" className="w-full bg-white p-3 border border-zinc-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-primary-container/20 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-wider">Max Discount (Rs)</label>
                  <input type="number" min="0" value={couponForm.maxDiscount} onChange={(e) => setCouponForm(p => ({...p, maxDiscount: e.target.value}))} placeholder="Cap for %" className="w-full bg-white p-3 border border-zinc-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-primary-container/20 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-wider">Usage Limit</label>
                  <input type="number" min="1" value={couponForm.usageLimit} onChange={(e) => setCouponForm(p => ({...p, usageLimit: e.target.value}))} placeholder="Empty = unlimited" className="w-full bg-white p-3 border border-zinc-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-primary-container/20 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-wider">Expiry Date</label>
                  <input type="date" value={couponForm.expiresAt} onChange={(e) => setCouponForm(p => ({...p, expiresAt: e.target.value}))} className="w-full bg-white p-3 border border-zinc-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-primary-container/20 outline-none" />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full bg-primary-container text-white py-3 rounded-xl font-black text-sm hover:bg-orange-600 transition-all shadow-md hover:-translate-y-0.5">Create Promo</button>
                </div>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100">
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider pl-8">Code</th>
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider">Discount</th>
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider">Min Order</th>
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider">Usage</th>
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider pr-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons?.map((coupon) => {
                  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                  const isAtLimit = coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit;
                  return (
                    <tr key={coupon._id} className="hover:bg-white border-b border-zinc-50 transition-colors">
                      <td className="p-5 pl-8">
                        <span className="font-mono font-black text-zinc-800 bg-zinc-100 px-3 py-1.5 rounded-lg text-sm">{coupon.code}</span>
                      </td>
                      <td className="p-5">
                        <span className="font-black text-zinc-800">
                          {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `Rs ${coupon.discountValue}`}
                        </span>
                        {coupon.maxDiscount && <span className="text-xs text-zinc-400 ml-1">(max Rs {coupon.maxDiscount})</span>}
                      </td>
                      <td className="p-5 text-sm font-bold text-zinc-600">
                        {coupon.minOrderAmount > 0 ? `Rs ${coupon.minOrderAmount}` : '—'}
                      </td>
                      <td className="p-5 text-sm font-bold text-zinc-600">
                        {coupon.usedCount}{coupon.usageLimit !== null ? ` / ${coupon.usageLimit}` : ' / ∞'}
                      </td>
                      <td className="p-5">
                        {isExpired ? (
                          <span className="text-xs font-black bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-full">Expired</span>
                        ) : isAtLimit ? (
                          <span className="text-xs font-black bg-zinc-100 text-zinc-500 border border-zinc-200 px-3 py-1.5 rounded-full">Exhausted</span>
                        ) : coupon.isActive ? (
                          <span className="text-xs font-black bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-full">Active</span>
                        ) : (
                          <span className="text-xs font-black bg-zinc-100 text-zinc-500 border border-zinc-200 px-3 py-1.5 rounded-full">Disabled</span>
                        )}
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={async () => { try { await toggleCoupon(coupon._id).unwrap(); toast.success(`Coupon ${coupon.isActive ? 'disabled' : 'enabled'}`); } catch(e) { toast.error('Failed'); } }} className="p-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-500 hover:text-zinc-800" title={coupon.isActive ? 'Disable' : 'Enable'}>
                            <span className="material-symbols-outlined text-[18px]">{coupon.isActive ? 'toggle_on' : 'toggle_off'}</span>
                          </button>
                          <button onClick={async () => { if (window.confirm('Delete this promo code?')) { try { await deleteCoupon(coupon._id).unwrap(); toast.success('Coupon deleted.'); } catch(e) { toast.error('Failed'); } } }} className="p-2 rounded-lg hover:bg-red-50 transition-colors text-zinc-400 hover:text-red-500" title="Delete">
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
                      <span className="material-symbols-outlined text-[48px] text-zinc-300 mb-2 block">sell</span>
                      <p className="text-zinc-500 font-bold">No promo codes yet. Click "New Code" to get started!</p>
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
