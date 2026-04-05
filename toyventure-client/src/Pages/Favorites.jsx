import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleFavorite, markFavoritesSeen } from '../features/wishlist/wishlistSlice';
// import { addToCart } from '../features/cart/cartSlice';

const Favorites = () => {
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const dispatch = useDispatch();

  // NEW: Reset the notification badge when this page opens
  useEffect(() => {
    dispatch(markFavoritesSeen());
  }, [dispatch]);

  const handleMoveToCart = (item) => {
    // If you have a cart action, you would dispatch it here:
    // dispatch(addToCart({ ...item, qty: 1 }));
    // dispatch(toggleFavorite(item)); // Automatically remove from wishlist once added to cart
    alert(`${item.title} moved to cart!`);
  };

  return (
    <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        <div className="flex items-center gap-3 mb-8 border-b border-white pb-6">
            <span className="material-symbols-outlined text-red-500 text-[36px] filled">favorite</span>
            <h1 className="text-4xl font-black text-zinc-800 tracking-tight">Your Favourites</h1>
            <span className="bg-white/60 text-zinc-600 font-bold px-4 py-1.5 rounded-full ml-auto shadow-inner text-sm">
                {wishlistItems.length} Items
            </span>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="card-surface rounded-[3rem] p-16 flex flex-col items-center justify-center text-center shadow-soft">
            <span className="material-symbols-outlined text-[80px] text-zinc-300 mb-6">heart_broken</span>
            <h2 className="text-2xl font-black text-zinc-800 mb-3">No favourites yet!</h2>
            <p className="text-zinc-500 mb-8 max-w-md">You haven't saved any magical toys to your wishlist. Let's find something you'll love.</p>
            <Link to="/shop" className="px-8 py-4 bg-primary-container text-white font-black rounded-full hover:-translate-y-1 hover:shadow-lg transition-all">
              Discover Toys
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item._id} className="flex flex-col group relative card-surface p-4 rounded-[2rem] hover:-translate-y-2 transition-all duration-300">
                
                {/* Remove from Favorites Button */}
                <button 
                  onClick={() => dispatch(toggleFavorite(item))}
                  className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-md text-red-500 p-2.5 rounded-full shadow-md hover:scale-110 transition-all"
                  title="Remove from favorites"
                >
                  <span className="material-symbols-outlined text-[20px] filled">favorite</span>
                </button>

                {/* Product Image linked to details page */}
                <Link to={`/product/${item._id}`} className="w-full aspect-[4/3] bg-white/50 rounded-[1.5rem] overflow-hidden relative mb-5 shadow-inner border border-white/60 block">
                  <img alt={item.title} src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" />
                </Link>

                <div className="px-2 flex flex-col flex-1">
                  <h3 className="font-bold text-zinc-800 text-[15px] leading-snug group-hover:text-primary-container transition-colors line-clamp-2 h-11 mb-2">
                    {item.title}
                  </h3>
                  <span className="text-zinc-800 font-black text-xl mb-4">₹{item.price}</span>
                  
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    className="mt-auto w-full py-3 bg-zinc-900 text-white font-black text-sm rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 active:scale-95"
                  >
                    Move to Cart <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
};

export default Favorites;