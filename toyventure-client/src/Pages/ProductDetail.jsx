import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductByIdQuery, useGetProductsQuery, useCreateReviewMutation } from '../features/api/apiSlice';
import { toggleFavorite } from '../features/wishlist/wishlistSlice';
import { addToCart } from '../features/cart/cartSlice';
import SkeletonProductDetail from '../components/SkeletonProductDetail.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data: responseData, isLoading, error } = useGetProductByIdQuery(id);
  const { data: allProducts } = useGetProductsQuery();
  const [createReview, { isLoading: isReviewLoading }] = useCreateReviewMutation();

  const product = responseData?.data || (Array.isArray(responseData) ? responseData[0] : responseData);
  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || []);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');

  const displayPrice = (price) => {
    if (price === undefined || price === null) return '₹0';
    const num = Number(price);
    if (isNaN(num)) return '₹0';
    return '₹' + num.toLocaleString('en-IN');
  };

  const getDiscountPercent = (price, oldPrice) => {
    if (!oldPrice || !price) return null;
    const p = Number(price);
    const op = Number(oldPrice);
    if (isNaN(p) || isNaN(op) || op === 0) return null;
    return Math.round(((op - p) / op) * 100);
  };

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (isLoading) return <SkeletonProductDetail />;

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <h2 className="text-2xl font-bold text-red-500">Product not found!</h2>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
    alert(`${product.title} magically added to your cart!`);
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
      await createReview({ productId: id, rating, comment, name }).unwrap();
      alert('🎉 Review submitted successfully!');
      setRating(5); setComment(''); setName('');
    } catch (err) {
      alert('Failed to submit review.');
    }
  };

  const renderStars = (starCount) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`material-symbols-outlined text-[18px] ${index < starCount ? 'text-yellow-400 filled' : 'text-zinc-300'}`}
      >
        star
      </span>
    ));
  };

  const isMainProductFavorited = wishlistItems.some(w => w._id === product._id);
  const discountPercent = getDiscountPercent(product.price, product.oldPrice);

  return (
    <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      {/* IMAGE MODAL */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/95 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
          <img
            src={product.img}
            alt={product.title}
            className="max-w-[90%] max-h-[90vh] object-contain rounded-3xl shadow-2xl"
          />
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-8">
          <Link to="/" className="hover:text-primary-container transition-colors">HOME</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary-container transition-colors">SHOP</Link>
          <span>/</span>
          <span className="text-zinc-800 line-clamp-1">{product.title}</span>
        </div>

        {/* MAIN PRODUCT SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">

          {/* LEFT: IMAGE */}
          <div className="relative group">
            <div
              className="w-full aspect-square card-surface rounded-[3rem] p-8 flex items-center justify-center shadow-soft relative overflow-hidden cursor-crosshair"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setIsImageModalOpen(true)}
            >
              <img
                src={product.img}
                alt={product.title}
                className={`w-full h-full object-cover mix-blend-multiply transition-transform duration-100 ease-linear ${isZooming ? 'scale-[2.5]' : 'scale-100'}`}
                style={{ transformOrigin: isZooming ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center' }}
              />
            </div>
            <p className="text-center text-xs text-zinc-400 font-medium mt-3 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[14px]">zoom_in</span>
              Hover to zoom · Click to expand
            </p>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="flex flex-col justify-center">

            {/* STARS */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">{renderStars(product.rating || 5)}</div>
                <span className="text-sm font-bold text-zinc-500">({product.numReviews} Reviews)</span>
              </div>
            )}

            {/* TITLE */}
            <h1 className="text-4xl md:text-5xl font-black text-zinc-800 tracking-tight leading-tight mb-6">
              {product.title}
            </h1>

            {/* PRICE BLOCK */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white flex-wrap">
              <span className="text-4xl font-black text-primary-container">
                {displayPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xl font-bold text-zinc-400 line-through">
                  {displayPrice(product.oldPrice)}
                </span>
              )}
              {discountPercent && (
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 font-black text-sm px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-[16px]">local_offer</span>
                    {discountPercent}% OFF
                  </span>
                  <span className="text-xs text-green-600 font-bold ml-1">
                    You save {displayPrice(Number(product.oldPrice) - Number(product.price))}
                  </span>
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="text-zinc-600 font-medium leading-relaxed mb-8 text-lg">
              {product.description || "Bring home the magic with this incredible toy!"}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-5 bg-zinc-900 text-white font-black text-xl rounded-[2rem] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 active:scale-95 group"
              >
                Add to Cart
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">shopping_cart_checkout</span>
              </button>

              <button
                onClick={() => dispatch(toggleFavorite(product))}
                className={`w-20 rounded-[2rem] border-2 transition-all flex items-center justify-center hover:-translate-y-1 active:scale-95 shadow-md ${
                  isMainProductFavorited
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-white bg-white/60 text-zinc-400 hover:border-red-200 hover:text-red-400'
                }`}
                title="Add to Wishlist"
              >
                <span className={`material-symbols-outlined text-[32px] ${isMainProductFavorited ? 'filled' : ''}`}>favorite</span>
              </button>
            </div>

            {/* TRUST BADGES */}
            <div className="flex items-center gap-4 mt-6 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 bg-white/60 px-3 py-2 rounded-full border border-white">
                <span className="material-symbols-outlined text-green-500 text-[16px]">verified_user</span> 100% Safe
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 bg-white/60 px-3 py-2 rounded-full border border-white">
                <span className="material-symbols-outlined text-blue-500 text-[16px]">local_shipping</span> Free Delivery
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 bg-white/60 px-3 py-2 rounded-full border border-white">
                <span className="material-symbols-outlined text-orange-500 text-[16px]">replay</span> 30-Day Returns
              </div>
            </div>

          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-20 border-t border-white pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT: REVIEW LIST */}
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-black text-zinc-800 mb-8 flex items-center gap-3">
              Customer Reviews
              <span className="bg-primary-container text-white text-sm py-1 px-3 rounded-full">
                {product.reviews?.length || 0}
              </span>
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
                          <h4 className="font-bold text-zinc-800">{review.name}</h4>
                          <p className="text-xs text-zinc-400 font-medium">
                            {review.createdAt ? review.createdAt.substring(0, 10) : 'Just now'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 bg-white px-3 py-1.5 rounded-full shadow-inner">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-zinc-600 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: WRITE REVIEW */}
          <div className="lg:col-span-5">
            <div className="card-surface p-8 rounded-[2.5rem] shadow-soft sticky top-32 border border-white">
              <h3 className="text-xl font-black text-zinc-800 mb-6">Write a Review</h3>
              <form onSubmit={submitReviewHandler} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-600 ml-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-600 ml-1">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-bold text-zinc-800 cursor-pointer"
                  >
                    <option value="5">5 - Excellent (⭐⭐⭐⭐⭐)</option>
                    <option value="4">4 - Very Good (⭐⭐⭐⭐)</option>
                    <option value="3">3 - Good (⭐⭐⭐)</option>
                    <option value="2">2 - Fair (⭐⭐)</option>
                    <option value="1">1 - Poor (⭐)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-600 ml-1">Your Experience</label>
                  <textarea
                    required
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you love about this toy?"
                    className="w-full bg-white/60 p-4 border border-white rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none transition-all shadow-inner font-medium text-zinc-800 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isReviewLoading}
                  className="w-full py-4 mt-2 bg-primary-container text-white font-black text-lg rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-1 disabled:opacity-50"
                >
                  {isReviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default ProductDetail;