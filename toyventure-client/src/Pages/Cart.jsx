import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../features/cart/cartSlice';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  
  // Bulletproof check to ensure we don't accidentally read "null" as a logged-in user
  const userInfoData = localStorage.getItem('userInfo');
  const userInfo = (userInfoData && userInfoData !== 'null' && userInfoData !== 'undefined') 
                   ? JSON.parse(userInfoData) 
                   : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getNumericPrice = (priceStr) => {
    if (!priceStr) return 0;
    return Number(String(priceStr).replace(/[^0-9.-]+/g, "")) || 0;
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const price = getNumericPrice(item.price);
    const qty = parseInt(item.qty, 10) || 1;
    return acc + (price * qty);
  }, 0);

  const handleIncrease = (item) => {
    if (item.qty < item.countInStock) {
      dispatch(updateQuantity({ id: item._id, qty: (item.qty || 1) + 1 }));
    } else {
      alert(`Sorry, we only have ${item.countInStock} units available.`);
    }
  };

  const handleDecrease = (item) => {
    if (item.qty > 1) {
      dispatch(updateQuantity({ id: item._id, qty: item.qty - 1 }));
    } else {
      dispatch(removeFromCart(item._id));
    }
  };

  const isCartValid = cartItems.every(item => item.countInStock >= item.qty && item.countInStock > 0);

  // ==========================================
  // NOT LOGGED IN STATE
  // ==========================================
  if (!userInfo) {
    return (
      <main className="pt-32 pb-24 min-h-screen bg-surface flex flex-col items-center justify-center px-6 fade-in">
        <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[48px] text-zinc-300">lock</span>
        </div>
        <h2 className="text-3xl font-black text-zinc-800 mb-4">Login to View Cart</h2>
        <p className="text-zinc-500 font-bold mb-8 text-center max-w-md">Please log in or create an account to view and manage your shopping cart.</p>
        <Link to="/auth?redirect=/cart" className="px-8 py-4 bg-primary-container text-white font-black rounded-full hover:-translate-y-1 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
          Login / Sign Up <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </main>
    );
  }

  // ==========================================
  // EMPTY CART STATE
  // ==========================================
  if (cartItems.length === 0) {
    return (
      <main className="pt-32 pb-24 min-h-screen bg-surface flex flex-col items-center justify-center px-6 fade-in">
        <span className="material-symbols-outlined text-[80px] text-zinc-300 mb-6">shopping_bag</span>
        <h2 className="text-3xl font-black text-zinc-800 mb-4">Your cart is empty!</h2>
        <p className="text-zinc-500 font-bold mb-8 text-center max-w-md">Looks like you haven't added any magical toys yet.</p>
        <Link to="/shop" className="px-8 py-4 bg-primary-container text-white font-black rounded-full hover:-translate-y-1 hover:shadow-lg transition-all">
          Discover Toys
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT SIDE: CART ITEMS */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8 border-b border-white pb-6">
            <h1 className="text-3xl font-black text-zinc-800 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container text-[36px]">shopping_cart</span>
              Your Cart
            </h1>
            <button 
              onClick={() => dispatch(clearCart())}
              className="text-red-500 font-bold text-sm hover:underline flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span> Clear Cart
            </button>
          </div>

          <div className="space-y-6">
            {cartItems.map((item) => {
              const itemPrice = getNumericPrice(item.price);
              const itemQty = parseInt(item.qty, 10) || 1;
              const itemTotal = itemPrice * itemQty;
              
              // NEW: Split logic for Completely Out of Stock vs Just Exceeding Limits
              const isOutOfStock = item.countInStock === 0;
              const isExceedingStock = itemQty > item.countInStock && item.countInStock > 0;
              const hasStockError = isOutOfStock || isExceedingStock;

              return (
                <div key={item._id} className={`card-surface p-4 md:p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 relative border ${hasStockError ? 'border-red-400 bg-red-50/50' : 'border-white shadow-sm'}`}>
                  
                  <Link to={`/product/${item._id}`} className="w-24 h-24 md:w-32 md:h-32 bg-white/60 rounded-[1.5rem] p-2 flex-shrink-0 shadow-inner">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-multiply rounded-xl" />
                  </Link>

                  <div className="flex-1 text-center md:text-left">
                    <Link to={`/product/${item._id}`}>
                      <h3 className="font-bold text-zinc-800 text-lg hover:text-primary-container transition-colors line-clamp-2">{item.title}</h3>
                    </Link>
                    <p className="text-zinc-500 font-bold text-sm mt-1">₹{itemPrice.toLocaleString('en-IN')}</p>
                  </div>

                  {/* NEW: Show Red "Out of Stock" Box OR Quantity Controls */}
                  {isOutOfStock ? (
                    <div className="bg-red-500 text-white font-black px-6 py-2.5 rounded-xl border border-red-600 uppercase text-xs tracking-widest text-center shadow-sm w-full md:w-auto">
                      Out of Stock
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 bg-white/60 rounded-full px-4 py-2 shadow-inner border border-white">
                      <button onClick={() => handleDecrease(item)} className="text-zinc-500 hover:text-red-500 font-black text-xl w-6 flex justify-center items-center transition-colors">-</button>
                      <span className="font-black text-zinc-800 w-6 text-center">{itemQty}</span>
                      
                      <button 
                        onClick={() => handleIncrease(item)} 
                        disabled={itemQty >= item.countInStock}
                        className={`font-black text-xl w-6 flex justify-center items-center transition-colors ${itemQty >= item.countInStock ? 'text-zinc-300 cursor-not-allowed' : 'text-zinc-500 hover:text-green-500'}`}
                      >+</button>
                    </div>
                  )}

                  <div className="text-xl font-black text-zinc-800 w-28 text-right">
                    ₹{itemTotal.toLocaleString('en-IN')}
                  </div>

                  <button 
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="md:absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors p-2 bg-white rounded-full shadow-sm md:shadow-none md:bg-transparent"
                    title="Remove Item"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>

                  {/* Show specific limit warning ONLY if they have more in cart than available (but not 0) */}
                  {isExceedingStock && (
                     <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-red-100 text-red-600 text-xs font-bold px-4 py-1 rounded-full shadow-sm whitespace-nowrap">
                       Only {item.countInStock} available. Please reduce quantity.
                     </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE: ORDER SUMMARY */}
        <div className="lg:col-span-4">
          <div className="card-surface p-8 rounded-[2.5rem] shadow-soft sticky top-32 border border-white">
            <h2 className="text-2xl font-black text-zinc-800 mb-6 border-b border-white pb-4">Order Summary</h2>
            
            <div className="space-y-4 text-sm font-bold text-zinc-600 mb-6">
              <div className="flex justify-between items-center">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="text-zinc-800">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping Discount</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>

            <div className="border-t border-white pt-6 mb-8 flex justify-between items-end">
              <span className="text-lg font-bold text-zinc-800">Total</span>
              <span className="text-3xl font-black text-primary-container">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>

            {isCartValid ? (
              <Link to="/checkout" className="w-full py-4 bg-zinc-900 text-white font-black text-lg rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl hover:-translate-y-1 block text-center">
                Proceed to Checkout <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
            ) : (
              <button disabled className="w-full py-4 bg-zinc-300 text-zinc-500 font-black text-lg rounded-2xl cursor-not-allowed flex items-center justify-center gap-2 block text-center opacity-70">
               Out Of Stock <span className="material-symbols-outlined text-[20px]">warning</span>
              </button>
            )}
            
            <p className="text-center text-[10px] text-zinc-400 font-bold mt-4 uppercase tracking-wider flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified_user</span> Secure Checkout
            </p>
          </div>
        </div>

      </div>
    </main>
  );
};

export default Cart;