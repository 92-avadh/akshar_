import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ScrollReveal from '../components/ScrollReveal.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { useGetProductsQuery } from '../features/api/apiSlice.js';
import { toggleFavorite } from '../features/wishlist/wishlistSlice.js';
import { addToCart } from '../features/cart/cartSlice';

const Shop = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || []);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const { data: responseData, isLoading, error } = useGetProductsQuery();
  const allProducts = responseData?.data || (Array.isArray(responseData) ? responseData : []);

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

  const products = useMemo(() => {
    if (!searchQuery.trim()) return allProducts;
    const q = searchQuery.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tag?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [allProducts, searchQuery]);

  const handleLocalSearch = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchParams({ search: localSearch.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setLocalSearch('');
    setSearchParams({});
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <h2 className="text-2xl font-bold text-red-500">Failed to load products.</h2>
      </div>
    );
  }

  return (
    <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">

        {/* BREADCRUMB */}
        <ScrollReveal className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-6">
          <Link to="/" className="hover:text-primary-container flex items-center transition-colors">
            <span className="material-symbols-outlined text-[16px] mr-1">home</span> HOME
          </Link>
          <span>/</span>
          <span className="text-zinc-800">SHOP</span>
        </ScrollReveal>

        {/* HEADER ROW */}
        <ScrollReveal delay={50} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              {searchQuery ? `Results for "${searchQuery}"` : 'Magical Collection'}
            </h1>
            {!isLoading && (
              <p className="text-zinc-500 font-medium mt-1">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            )}
          </div>

          {/* INLINE SEARCH BAR */}
          <form
            onSubmit={handleLocalSearch}
            className="flex items-center gap-2 bg-white/80 border border-white rounded-full px-4 py-2 shadow-inner w-full md:w-80"
          >
            <span className="material-symbols-outlined text-primary-container text-[20px]">search</span>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search toys..."
              className="flex-1 bg-transparent outline-none font-medium text-sm text-zinc-800 placeholder:text-zinc-400"
            />
            {localSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </form>
        </ScrollReveal>

        {/* ACTIVE SEARCH BADGE */}
        {searchQuery && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-bold text-zinc-500">Filtering by:</span>
            <span className="flex items-center gap-2 bg-primary-container/10 border border-primary-container/20 text-primary-container font-bold text-sm px-4 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-[16px]">search</span>
              {searchQuery}
              <button onClick={clearSearch} className="hover:text-red-500 transition-colors ml-1">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </span>
          </div>
        )}

        {/* SKELETON GRID */}
        {isLoading && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8 mt-4">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* NO RESULTS STATE */}
        {!isLoading && products.length === 0 && (
          <div className="card-surface rounded-[3rem] p-20 flex flex-col items-center justify-center text-center shadow-soft mt-8">
            <span className="material-symbols-outlined text-[80px] text-zinc-300 mb-6">search_off</span>
            <h2 className="text-2xl font-black text-zinc-800 mb-3">
              No toys found for "{searchQuery}"
            </h2>
            <p className="text-zinc-500 mb-8 max-w-md">
              Try searching with different keywords like "car", "blocks", or "craft".
            </p>
            <button
              onClick={clearSearch}
              className="px-8 py-4 bg-primary-container text-white font-black rounded-full hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              View All Toys
            </button>
          </div>
        )}

        {/* PRODUCT GRID */}
        {!isLoading && products.length > 0 && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8 mt-4">
            {products.map((product, index) => {
              const isFavorited = wishlistItems.some((wItem) => wItem._id === product._id);
              const discountPercent = getDiscountPercent(product.price, product.oldPrice);

              return (
                <ScrollReveal
                  as="div"
                  key={product._id}
                  delay={index * 50}
                  className="flex flex-col group relative card-surface p-4 rounded-[2rem] hover:-translate-y-2 transition-all duration-300"
                >
                  {/* FAVORITE BUTTON */}
                  <button
                    onClick={() => dispatch(toggleFavorite(product))}
                    className="absolute top-6 right-16 z-20 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <span className={`material-symbols-outlined text-[20px] transition-colors ${isFavorited ? 'text-red-500 filled' : 'text-zinc-400 hover:text-red-400'}`}>
                      favorite
                    </span>
                  </button>

                  {/* CART BUTTON */}
                  <button
                    onClick={() => {
                      dispatch(addToCart({ ...product, qty: 1 }));
                      alert(`${product.title} added to cart!`);
                    }}
                    className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-md text-primary-container p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-primary-container hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                  </button>

                  {/* PRODUCT IMAGE */}
                  <Link
                    to={`/product/${product._id}`}
                    className="w-full aspect-[4/3] bg-white/50 rounded-[1.5rem] overflow-hidden relative mb-5 shadow-inner border border-white/60 block z-10"
                  >
                    <img
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
                      src={product.img}
                    />
                    {product.tag && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                        {product.tag}
                      </div>
                    )}
                  </Link>

                  {/* PRODUCT INFO */}
                  <div className="px-2 flex flex-col flex-1">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="font-bold text-zinc-800 text-[15px] leading-snug hover:text-primary-container transition-colors line-clamp-2 h-11 mb-3">
                        {product.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2.5 flex-wrap mb-2">
                      <span className="text-zinc-800 font-black text-xl tracking-tight">
                        {displayPrice(product.price)}
                      </span>
                      {product.oldPrice && (
                        <span className="text-zinc-400 line-through text-xs font-medium">
                          {displayPrice(product.oldPrice)}
                        </span>
                      )}
                      {discountPercent && (
                        <span className="text-green-600 font-black text-xs bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                </ScrollReveal>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
};

export default Shop;