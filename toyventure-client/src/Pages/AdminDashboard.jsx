import React from 'react';
import { Link } from 'react-router-dom';
import { useGetAllOrdersQuery, useDeliverOrderMutation } from '../features/api/apiSlice';

const getAdminOrderStatusMeta = (order) => {
  if (order.orderStatus === 'fulfilled') {
    return {
      label: 'Shipped',
      className: 'bg-green-50 border border-green-200 text-green-700',
      icon: 'check_circle',
    };
  }

  if (order.orderStatus === 'payment_review') {
    return {
      label: 'Paid - Review',
      className: 'bg-amber-50 border border-amber-200 text-amber-700',
      icon: 'warning',
    };
  }

  if (order.paymentStatus === 'refunded' || order.orderStatus === 'refunded') {
    return {
      label: 'Refunded',
      className: 'bg-slate-50 border border-slate-200 text-slate-700',
      icon: 'replay',
    };
  }

  if (order.paymentStatus === 'paid') {
    return {
      label: 'Ready to Ship',
      className: 'bg-blue-50 border border-blue-200 text-blue-700',
      icon: 'local_shipping',
    };
  }

  if (order.paymentStatus === 'failed') {
    return {
      label: 'Payment Failed',
      className: 'bg-red-50 border border-red-200 text-red-700',
      icon: 'error',
    };
  }

  return {
    label: 'Pending Payment',
    className: 'bg-orange-50 border border-orange-200 text-orange-700',
    icon: 'timer',
  };
};

const AdminDashboard = () => {
  const { data: orders, isLoading } = useGetAllOrdersQuery();
  const [deliverOrder, { isLoading: isDelivering }] = useDeliverOrderMutation();

  const handleDeliver = async (id) => {
    if (window.confirm('Mark this order as shipped/delivered?')) {
      try {
        await deliverOrder(id).unwrap();
        alert('Order status updated!');
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
  const pendingOrders = orders?.filter((order) => order.paymentStatus === 'paid' && !order.isDelivered && order.orderStatus !== 'payment_review').length || 0;

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
            <span className="material-symbols-outlined">inventory_2</span> Manage Inventory Catalog
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
              <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">To Be Shipped</p>
              <h3 className="text-3xl font-black text-zinc-800">{pendingOrders}</h3>
            </div>
          </div>
        </div>

        <div className="card-surface rounded-[2.5rem] border border-white shadow-soft overflow-hidden">
          <div className="p-8 border-b border-zinc-100/50 bg-white/50 flex items-center justify-between">
            <h2 className="text-2xl font-black text-zinc-800 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container text-[28px]">local_shipping</span>
              Fulfillment Queue
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100">
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider pl-8">Order ID</th>
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider">Customer Info</th>
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider">Date</th>
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider">Total</th>
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider pr-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => {
                  const statusMeta = getAdminOrderStatusMeta(order);

                  return (
                    <tr key={order._id} className="hover:bg-white transition-colors border-b border-zinc-50 group">
                      <td className="p-5 font-mono text-sm font-bold text-zinc-500 pl-8">
                        ...{order._id.substring(order._id.length - 6)}
                      </td>
                      <td className="p-5">
                        <p className="font-bold text-zinc-800">{order.user?.name || order.shippingDetails?.fullName}</p>
                        <p className="text-xs font-bold text-zinc-400 mt-1">{order.user?.mobileNumber || order.shippingDetails?.phone}</p>
                      </td>
                      <td className="p-5 text-sm font-bold text-zinc-600">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-5 text-lg font-black text-primary-container">
                        Rs {order.totalPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="p-5">
                        <span className={`${statusMeta.className} text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1 w-max shadow-sm`}>
                          <span className="material-symbols-outlined text-[14px]">{statusMeta.icon}</span>
                          {statusMeta.label}
                        </span>
                        {order.inventoryIssue && (
                          <p className="text-xs text-amber-700 font-bold mt-2">{order.inventoryIssue}</p>
                        )}
                      </td>
                      <td className="p-5 pr-8 text-right">
                        {order.paymentStatus === 'paid' && !order.isDelivered && order.orderStatus !== 'payment_review' ? (
                          <button
                            onClick={() => handleDeliver(order._id)}
                            disabled={isDelivering}
                            className="bg-zinc-900 text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-black transition-all shadow-md hover:-translate-y-0.5 disabled:opacity-50"
                          >
                            Mark Shipped
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-zinc-400 flex items-center justify-end gap-1">
                            <span className="material-symbols-outlined text-[16px]">done_all</span> No Action
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {orders?.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-16">
                      <span className="material-symbols-outlined text-[48px] text-zinc-300 mb-2 block">inbox</span>
                      <p className="text-zinc-500 font-bold">No orders have been placed yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
