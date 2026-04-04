import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateOrderMutation } from '../features/api/apiSlice';
// If you have a clearCart action in your cartSlice, uncomment the next line:
// import { clearCart } from '../features/cart/cartSlice'; 

const Checkout = () => {
  // Get cart items from Redux store
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // RTK Query Mutation
  const [createOrderApi, { isLoading }] = useCreateOrderMutation();

  // Local Form State
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  // Calculate Total Price
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Handle Form Input changes
  const handleInputChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  // Handle Order Submission
  const placeOrderHandler = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert("Your cart is empty! Please add items before checking out.");
      navigate('/shop');
      return;
    }

    try {
      // Send the payload to the backend
      const response = await createOrderApi({
        orderItems: cartItems,
        shippingDetails,
        totalPrice
      }).unwrap();

      alert(`🎉 Order Placed Successfully!\nYour Order ID is: ${response._id}`);
      
      // Clear the cart after successful order (Uncomment if implemented)
      // dispatch(clearCart()); 
      
      navigate('/'); // Send user back to home
      
    } catch (error) {
      alert(error?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  // IF CART IS EMPTY
  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-surface flex flex-col items-center justify-center px-6">
        <span className="material-symbols-outlined text-[80px] text-zinc-300 mb-6">shopping_bag</span>
        <h2 className="text-3xl font-black text-zinc-800 mb-4">Your cart is empty</h2>
        <p className="text-zinc-500 mb-8 text-center max-w-md">Looks like you haven't added any magical toys to your cart yet.</p>
        <Link to="/shop" className="px-8 py-4 bg-primary-container text-white font-black rounded-full hover:-translate-y-1 hover:shadow-lg transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  // CHECKOUT PAGE UI
  return (
    <div className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>
      
      <div className="max-w-[1000px] mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Shipping Form */}
        <div className="lg:col-span-2 card-surface p-8 rounded-[2.5rem] shadow-soft">
          <h1 className="text-3xl font-black text-zinc-800 mb-8 border-b border-white pb-4">Shipping Details</h1>

          <form id="checkout-form" onSubmit={placeOrderHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-600 ml-1">Full Name</label>
                <input required type="text" name="fullName" value={shippingDetails.fullName} onChange={handleInputChange} className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner" placeholder="John Doe" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-600 ml-1">Phone Number</label>
                <input required type="tel" name="phone" value={shippingDetails.phone} onChange={handleInputChange} className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner" placeholder="+91 99999 00000" />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-zinc-600 ml-1">Full Address</label>
                <input required type="text" name="address" value={shippingDetails.address} onChange={handleInputChange} className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner" placeholder="123 Magic Toy Street, Apartment 4B" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-600 ml-1">City</label>
                <input required type="text" name="city" value={shippingDetails.city} onChange={handleInputChange} className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner" placeholder="Mumbai" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-600 ml-1">Pincode</label>
                <input required type="text" name="pincode" value={shippingDetails.pincode} onChange={handleInputChange} className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner" placeholder="400001" />
              </div>
            </div>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-1">
          <div className="card-surface p-6 rounded-[2.5rem] shadow-soft sticky top-32">
            <h2 className="text-xl font-black text-zinc-800 mb-6 border-b border-white pb-4">Order Summary</h2>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-4 items-center bg-white/40 p-3 rounded-2xl border border-white">
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-zinc-800 line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-zinc-500 font-medium mt-1">Qty: {item.qty}</p>
                  </div>
                  <div className="font-black text-zinc-800">
                    ₹{item.price * item.qty}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white mt-6 pt-6 space-y-3">
              <div className="flex justify-between text-sm font-bold text-zinc-600">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-zinc-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-lg font-bold text-zinc-800">Total</span>
                <span className="text-3xl font-black text-primary-container">₹{totalPrice}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              disabled={isLoading}
              className="w-full py-4 mt-8 bg-zinc-900 text-white font-black text-lg rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isLoading ? 'Processing...' : 'Place Order (COD)'} 
              {!isLoading && <span className="material-symbols-outlined text-[20px]">local_shipping</span>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;