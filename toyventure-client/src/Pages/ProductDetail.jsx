import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion'; 
import toast from 'react-hot-toast'; 
import { 
  useGetProductByIdQuery, 
  useGetProductsQuery, 
  useCreateReviewMutation, 
  useGetMyOrdersQuery,
  useNotifyMeWhenAvailableMutation 
} from '../features/api/apiSlice';
import { addToCart } from '../features/cart/cartSlice';
import { toggleFavorite } from '../features/wishlist/wishlistSlice'; 
import SkeletonProductDetail from '../components/SkeletonProductDetail.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx'; 

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // User Check
  const userInfoData = sessionStorage.getItem('userInfo');
  const userInfo = userInfoData && userInfoData !== 'undefined' ? JSON.parse(userInfoData) : null;

  const { data: responseData, isLoading, error } = useGetProductByIdQuery(id);
  const product = responseData?.data || (Array.isArray(responseData) ? responseData[0] : responseData);

  const { data: allProductsData } = useGetProductsQuery({ limit: 8 }, { skip: !product }); 
  const { data: myOrders } = useGetMyOrdersQuery(undefined, { skip: !userInfo });
  
  const [createReview, { isLoading: isReviewLoading }] = useCreateReviewMutation();
  const [notifyMeWhenAvailable, { isLoading: isNotifying }] = useNotifyMeWhenAvailableMutation(); // NEW
  
  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || []);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const [mainImage, setMainImage] = useState('');
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Notify Me State
  const [notifyEmail, setNotifyEmail] = useState('');

  const relatedProducts = allProductsData?.products?.filter(p => p._id !== id).slice(0, 4) || [];

  // Determine if User can leave a review
  const hasBoughtAndDelivered = myOrders?.some(order => 
    ['delivered', 'fulfilled'].includes(order.orderStatus) && 
    order.orderItems.some(item => (item.product === id || item._id === id || item.title === product?.title))
  );

  useEffect(() => { 
    if (product?.img) {
      setMainImage(product.img);
    }
  }, [id, product]);

  // Pre-fill email if logged in
  useEffect(() => {
    if (userInfo && userInfo.email && !notifyEmail) {
      setNotifyEmail(userInfo.email);
    }
  }, [userInfo]);

  const displayPrice = (price) => {
    if (price === undefined || price === null) return '₹0';
    return '₹' + Number(price).toLocaleString('en-IN');
  };

  const getDiscountPercent = (price, oldPrice) => {
    if (!oldPrice || !price) return null;
    const p = Number(price);
    const op = Number(oldPrice);
    if (isNaN(p) || isNaN(op) || op === 0) return null;
    return Math.round(((op - p) / op) * 100);
  };

  if (isLoading) return <SkeletonProductDetail />;
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <h2 className="text-2xl font-bold text-red-500">Product not found!</h2>
      </div>
    );
  }

  const galleryImages = product.images?.length > 0 ? product.images : [product.img, product.img, product.img]; 

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success(`${product.title} magically added to your cart!`); 
  };

  // Submit Notify Email Handler
  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    if (!notifyEmail) return toast.error("Please enter an email address.");
    try {
      const res = await notifyMeWhenAvailable({ productId: id, email: notifyEmail }).unwrap();
      toast.success(res.message || "You're on the list! We'll email you when it's back.");
      setNotifyEmail('');
    } catch (err) {
      toast.error("Failed to sign up for notifications.");
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId: id, rating, comment }).unwrap();
      toast.success('🎉 Review submitted successfully!'); 
      setRating(5); setComment('');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to submit review.');
    }
  };

  const renderStars = (starCount) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={`material-symbols-outlined text-[18px] ${index < starCount ? 'text-yellow-400 filled' : 'text-zinc-300'}`}>
        star
      </span>
    ));
  };

  const isMainProductFavorited = wishlistItems.some(w => w._id === product._id);
  const discountPercent = getDiscountPercent(product.price, product.oldPrice);

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/95 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <button onClick={() => setIsImageModalOpen(false)} className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
          <img src={mainImage || product.img} alt={product.title} className="max-w-[90%] max-h-[90vh] object-contain rounded-3xl shadow-2xl transform-gpu" />
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-8">
          <Link to="/" className="hover:text-primary-container transition-colors">HOME</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary-container transition-colors">SHOP</Link>
          <span>/</span>
          <span className="text-zinc-800 line-clamp-1">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="relative group">
            <div
              className="w-full aspect-square card-surface rounded-[3rem] p-8 flex items-center justify-center shadow-soft relative overflow-hidden cursor-crosshair transform-gpu"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setIsImageModalOpen(true)}
            >
              <img
                src={mainImage || product.img}
                alt={product.title}
                decoding="async"
                className={`w-full h-full object-cover mix-blend-multiply transition-transform duration-100 ease-linear transform-gpu ${isZooming ? 'scale-[2.5]' : 'scale-100'}`}
                style={{ transformOrigin: isZooming ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center', willChange: 'transform' }}
              />
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-6">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(imgUrl)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-[3px] transition-all duration-300 bg-white shadow-sm transform-gpu ${mainImage === imgUrl ? 'border-primary-container shadow-lg scale-110' : 'border-white/80 opacity-60 hover:opacity-100 hover:scale-105'}`}
                >
                  <img src={imgUrl} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply p-1" />
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-zinc-400 font-medium mt-4 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[14px]">zoom_in</span> Hover to zoom · Click to expand
            </p>
          </div>

          <div className="flex flex-col justify-center">
            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">{renderStars(Math.round(product.rating) || 5)}</div>
                <span className="text-sm font-bold text-zinc-500">({product.numReviews} Reviews)</span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-black text-zinc-800 tracking-tight leading-tight mb-4">{product.title}</h1>

            <div className="mb-6">
              {product.countInStock > 10 ? (
                <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 font-black text-sm px-3 py-1.5 rounded-full shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">inventory_2</span> In Stock
                </span>
              ) : product.countInStock > 0 ? (
                <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 font-black text-sm px-3 py-1.5 rounded-full shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">warning</span> Hurry, only {product.countInStock} left!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 font-black text-sm px-3 py-1.5 rounded-full shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">error</span> Out of Stock
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white flex-wrap">
              <span className="text-4xl font-black text-primary-container">{displayPrice(product.price)}</span>
              {product.oldPrice > 0 && <span className="text-xl font-bold text-zinc-400 line-through">{displayPrice(product.oldPrice)}</span>}
              {discountPercent > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 font-black text-sm px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-[16px]">local_offer</span> {discountPercent}% OFF
                  </span>
                  <span className="text-xs text-green-600 font-bold ml-1">You save {displayPrice(Number(product.oldPrice) - Number(product.price))}</span>
                </div>
              )}
            </div>

            <p className="text-zinc-600 font-medium leading-relaxed mb-8 text-lg">
              {product.description || "Bring home the magic with this incredible toy! Spark creativity, imagination, and endless hours of joy."}
            </p>

            <div className="flex gap-4">
              {/* ========================================== */}
              {/* NEW DYNAMIC BUTTON: ADD TO CART vs NOTIFY ME */}
              {/* ========================================== */}
              {product.countInStock === 0 ? (
                <div className="flex-1 bg-red-50 p-4 md:p-5 rounded-[2rem] border border-red-100 flex flex-col justify-center shadow-inner">
                  <p className="text-red-600 font-black text-sm mb-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                    Out of stock! Be the first to know when it's back:
                  </p>
                  <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2 w-full">
                    <input 
                      type="email" 
                      value={notifyEmail} 
                      onChange={(e) => setNotifyEmail(e.target.value)} 
                      required 
                      placeholder="Your email address" 
                      className="flex-1 px-4 py-3.5 rounded-xl border border-red-200 outline-none focus:ring-2 focus:ring-red-400 font-bold text-sm bg-white shadow-sm"
                    />
                    <button 
                      type="submit" 
                      disabled={isNotifying}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3.5 rounded-xl font-black text-sm transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-1 shrink-0"
                    >
                      {isNotifying ? 'Wait...' : 'Notify Me'}
                      {!isNotifying && <span className="material-symbols-outlined text-[18px]">send</span>}
                    </button>
                  </form>
                </div>
              ) : (
                <button 
                  onClick={handleAddToCart} 
                  className="flex-1 py-5 font-black text-xl rounded-[2rem] bg-zinc-900 text-white hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 active:scale-95 group"
                >
                  Add to Cart
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">shopping_cart_checkout</span>
                </button>
              )}
              
              <button 
                onClick={() => {
                    dispatch(toggleFavorite(product));
                    isMainProductFavorited ? toast.error('Removed from favorites') : toast.success('Added to favorites!');
                }} 
                className={`w-20 rounded-[2rem] border-2 transition-all flex items-center justify-center hover:-translate-y-1 active:scale-95 shadow-md shrink-0 ${isMainProductFavorited ? 'border-red-500 bg-red-50 text-red-500' : 'border-white bg-white/60 text-zinc-400 hover:border-red-200 hover:text-red-400'}`} 
                title="Add to Wishlist"
              >
                <span className={`material-symbols-outlined text-[32px] ${isMainProductFavorited ? 'filled' : ''}`}>favorite</span>
              </button>
            </div>

            <div className="flex items-center gap-4 mt-6 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 bg-white/60 px-3 py-2 rounded-full border border-white"><span className="material-symbols-outlined text-green-500 text-[16px]">verified_user</span> 100% Safe</div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 bg-white/60 px-3 py-2 rounded-full border border-white"><span className="material-symbols-outlined text-blue-500 text-[16px]">local_shipping</span> Free Delivery</div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 bg-white/60 px-3 py-2 rounded-full border border-white"><span className="material-symbols-outlined text-orange-500 text-[16px]">replay</span> 30-Day Returns</div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-20 border-t border-white pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-black text-zinc-800 mb-8 flex items-center gap-3">
              Customer Reviews <span className="bg-primary-container text-white text-sm py-1 px-3 rounded-full">{product.reviews?.length || 0}</span>
            </h2>

            {(!product.reviews || product.reviews.length === 0) ? (
              <div className="card-surface p-8 rounded-[2rem] text-center border border-white">
                <span className="material-symbols-outlined text-[48px] text-zinc-300 mb-3 block">rate_review</span>
                <p className="text-zinc-500 font-medium">No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review._id} className="card-surface p-6 rounded-[2rem] shadow-sm border border-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-fixed to-orange-100 flex items-center justify-center font-black text-primary-container shadow-inner">
                          {review.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-800 flex items-center gap-1.5">
                            {review.name}
                            <span className="bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[10px]">verified</span> Verified
                            </span>
                          </h4>
                          <p className="text-xs text-zinc-400 font-medium">{review.createdAt ? review.createdAt.substring(0, 10) : 'Just now'}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 bg-white px-3 py-1.5 rounded-full shadow-inner">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-zinc-600 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            {hasBoughtAndDelivered ? (
              <div className="card-surface p-8 rounded-[2.5rem] shadow-soft sticky top-32 border border-white">
                <h3 className="text-xl font-black text-zinc-800 mb-6">Write a Review</h3>
                <form onSubmit={submitReviewHandler} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-600 ml-1">Rating</label>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-bold text-zinc-800 cursor-pointer">
                      <option value="5">5 - Excellent (⭐⭐⭐⭐⭐)</option>
                      <option value="4">4 - Very Good (⭐⭐⭐⭐)</option>
                      <option value="3">3 - Good (⭐⭐⭐)</option>
                      <option value="2">2 - Fair (⭐⭐)</option>
                      <option value="1">1 - Poor (⭐)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-600 ml-1">Your Experience</label>
                    <textarea required rows="4" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What did you love about this toy?" className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800 resize-none"></textarea>
                  </div>
                  <button type="submit" disabled={isReviewLoading} className="w-full py-4 mt-2 bg-primary-container text-white font-black text-lg rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-1 disabled:opacity-50">
                    {isReviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            ) : userInfo ? (
              <div className="card-surface p-8 rounded-[2.5rem] shadow-soft border border-white text-center sticky top-32">
                <span className="material-symbols-outlined text-[48px] text-orange-400 mb-4 block">local_shipping</span>
                <h3 className="text-xl font-black text-zinc-800 mb-2">Verified Buyers Only</h3>
                <p className="text-zinc-500 font-medium text-sm">
                  You unlock the ability to leave a glowing 1-5 Star review once your order for this magical toy has been delivered!
                </p>
              </div>
            ) : (
              <div className="card-surface p-8 rounded-[2.5rem] shadow-soft border border-white text-center sticky top-32">
                <span className="material-symbols-outlined text-[48px] text-zinc-300 mb-4 block">lock</span>
                <h3 className="text-xl font-black text-zinc-800 mb-2">Login to Review</h3>
                <p className="text-zinc-500 font-medium text-sm mb-6">
                  Please sign in to leave a review for your purchases.
                </p>
                <Link to="/auth" className="inline-block w-full py-3 bg-zinc-900 text-white font-black text-sm rounded-xl hover:bg-black transition-all shadow-md">
                  Log In or Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-white">
            <h2 className="text-3xl font-black text-zinc-800 mb-8 text-center">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct, index) => {
                const isRelFavorited = wishlistItems.some((w) => w._id === relProduct._id);
                return (
                  <ScrollReveal as="div" key={relProduct._id} delay={index * 50} className="flex flex-col group relative card-surface p-4 rounded-[2rem] hover:-translate-y-2 transition-all duration-300">
                    <button 
                      onClick={(e) => { 
                          e.preventDefault(); 
                          dispatch(toggleFavorite(relProduct)); 
                          isRelFavorited ? toast.error('Removed from favorites') : toast.success('Added to favorites!');
                      }} 
                      className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    >
                      <span className={`material-symbols-outlined text-[20px] transition-colors ${isRelFavorited ? 'text-red-500 filled' : 'text-zinc-400 hover:text-red-400'}`}>favorite</span>
                    </button>
                    <Link to={`/product/${relProduct._id}`} className="w-full aspect-[4/3] bg-white/50 rounded-[1.5rem] overflow-hidden relative mb-4 shadow-inner border border-white/60 block z-10 isolate transform-gpu">
                      <img alt={relProduct.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply transform-gpu" src={relProduct.img} />
                    </Link>
                    <div className="px-2 flex flex-col flex-1">
                      <Link to={`/product/${relProduct._id}`}>
                        <h3 className="font-bold text-zinc-800 text-sm leading-snug hover:text-primary-container transition-colors line-clamp-2 h-10 mb-2">{relProduct.title}</h3>
                      </Link>
                      <span className="text-zinc-800 font-black text-lg tracking-tight">{displayPrice(relProduct.price)}</span>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.main>
  );
};

export default ProductDetail;