import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ScrollReveal from '../components/ScrollReveal.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { useGetProductsQuery } from '../features/api/apiSlice.js';
import { toggleFavorite } from '../features/wishlist/wishlistSlice.js';
import { addToCart } from '../features/cart/cartSlice';

const ageCategories = [
  '0–18 Months', '18–36 Months', '3–5 Years', 
  '5–7 Years', '7–9 Years', '9–12 Years', 
  '12–14 Years', '14+ Years'
];

const Shop = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || []);
  
  // URL Search Params
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchQuery);
  
  // Backend Pagination State
  const [page, setPage] = useState(1);

  // --- ADVANCED FILTER STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Active filters applied to the grid
  const [activeFilters, setActiveFilters] = useState({
    availability: { inStock: false, outOfStock: false },
    minPrice: 0,
    maxPrice: 2000,
    selectedAges: []
  });

  // Temporary filters for the sidebar (so grid doesn't update until "Apply" is clicked)
  const [tempFilters, setTempFilters] = useState(activeFilters);

  // Fetch products from backend (Search and Pagination applied on server)
  const { data: responseData, isLoading, error } = useGetProductsQuery({ 
      keyword: searchQuery,
      page, 
      limit: 12 
  });

  // Extract base products
  const baseProducts = responseData?.products || [];
  const totalPages = responseData?.pages || 1;

  // --- CLIENT-SIDE FILTERING LOGIC ---
  const filteredProducts = useMemo(() => {
    return baseProducts.filter(product => {
      // 1. Price Filter
      const productPrice = Number(product.price) || 0;
      if (productPrice < activeFilters.minPrice || productPrice > activeFilters.maxPrice) {
        return false;
      }

      // 2. Availability Filter
      const { inStock, outOfStock } = activeFilters.availability;
      if (inStock !== outOfStock) { 
        const isProductInStock = product.inStock !== false;
        if (inStock && !isProductInStock) return false;
        if (outOfStock && isProductInStock) return false;
      }

      // 3. Age Filter
      if (activeFilters.selectedAges.length > 0) {
        const productAge = product.ageGroup || product.tag;
        if (!activeFilters.selectedAges.includes(productAge)) {
          return false;
        }
      }

      return true;
    });
  }, [baseProducts, activeFilters]);

  // Formatting helpers
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

  // --- HANDLERS ---
  const handleLocalSearch = (e) => {
    e.preventDefault();
    setPage(1); 
    if (localSearch.trim()) {
      setSearchParams({ search: localSearch.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setLocalSearch('');
    setSearchParams({});
    setPage(1);
  };

  const openSidebar = () => {
    setTempFilters(activeFilters);
    setIsSidebarOpen(true);
    document.body.style.overflow = 'hidden'; 
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    document.body.style.overflow = 'unset';
  };

  const applyFilters = () => {
    setActiveFilters(tempFilters);
    setPage(1);
    closeSidebar();
  };

  const clearFilters = () => {
    const defaultFilters = {
      availability: { inStock: false, outOfStock: false },
      minPrice: 0,
      maxPrice: 2000,
      selectedAges: []
    };
    setTempFilters(defaultFilters);
    setActiveFilters(defaultFilters);
    setPage(1);
    closeSidebar();
  };

  const handleAgeToggle = (age) => {
    setTempFilters(prev => ({
      ...prev,
      selectedAges: prev.selectedAges.includes(age) 
        ? prev.selectedAges.filter(a => a !== age) 
        : [...prev.selectedAges, age]
    }));
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <h2 className="text-2xl font-bold text-red-500">Failed to load products.</h2>
      </div>
    );
  }

  return (
    <>
      {/* ================= SIDEBAR OVERLAY & PANEL ================= */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeSidebar}
      />

      <div 
        className={`fixed top-0 left-0 h-full w-[320px] bg-white z-[110] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-black text-zinc-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">tune</span> Filters
          </h2>
          <button onClick={closeSidebar} className="p-2 text-zinc-400 hover:text-zinc-800 rounded-full hover:bg-zinc-100 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Filter Sections */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* A. Availability */}
          <div>
            <h3 className="font-bold text-zinc-800 mb-4 uppercase tracking-wider text-xs">Availability</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={tempFilters.availability.inStock}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, availability: { ...prev.availability, inStock: e.target.checked } }))}
                  className="w-5 h-5 rounded border-zinc-300 text-primary-container focus:ring-primary-container transition-all focus:ring-0 outline-none"
                />
                <span className="text-zinc-600 font-medium group-hover:text-zinc-900 transition-colors">In Stock</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={tempFilters.availability.outOfStock}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, availability: { ...prev.availability, outOfStock: e.target.checked } }))}
                  className="w-5 h-5 rounded border-zinc-300 text-primary-container focus:ring-primary-container transition-all focus:ring-0 outline-none"
                />
                <span className="text-zinc-600 font-medium group-hover:text-zinc-900 transition-colors">Out of Stock</span>
              </label>
            </div>
          </div>

          {/* B. Price Range */}
          <div>
            <h3 className="font-bold text-zinc-800 mb-5 uppercase tracking-wider text-xs flex justify-between items-center">
              Price Range 
              <span className="text-primary-container font-black bg-primary-container/10 px-2 py-1 rounded-md">
                ₹{tempFilters.minPrice} - ₹{tempFilters.maxPrice}
              </span>
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold">₹</span>
                <input 
                  type="number" 
                  value={tempFilters.minPrice}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                  className="w-full pl-7 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-container focus:outline-none transition-all"
                  min="0" max={tempFilters.maxPrice}
                />
              </div>
              <span className="text-zinc-300 font-black">-</span>
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold">₹</span>
                <input 
                  type="number" 
                  value={tempFilters.maxPrice}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                  className="w-full pl-7 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-container focus:outline-none transition-all"
                  min={tempFilters.minPrice} max="2000"
                />
              </div>
            </div>
            {/* Visual indicator line */}
            <div className="mt-5 h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden relative">
                <div 
                    className="absolute h-full bg-primary-container rounded-full" 
                    style={{ 
                        left: `${(tempFilters.minPrice / 2000) * 100}%`, 
                        width: `${((tempFilters.maxPrice - tempFilters.minPrice) / 2000) * 100}%` 
                    }}
                ></div>
            </div>
          </div>

          {/* C. Shop by Age */}
          <div>
            <h3 className="font-bold text-zinc-800 mb-4 uppercase tracking-wider text-xs">Shop by Age</h3>
            <div className="space-y-3">
              {ageCategories.map((age) => (
                <label key={age} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={tempFilters.selectedAges.includes(age)}
                    onChange={() => handleAgeToggle(age)}
                    className="w-5 h-5 rounded border-zinc-300 text-primary-container focus:ring-primary-container transition-colors focus:ring-0 outline-none"
                  />
                  <span className={`transition-colors ${tempFilters.selectedAges.includes(age) ? 'text-zinc-900 font-black' : 'text-zinc-600 font-medium group-hover:text-zinc-900'}`}>
                    {age}
                  </span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar Footer Buttons */}
        <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex flex-col gap-3">
          <button 
            onClick={applyFilters}
            className="w-full py-4 bg-primary-container hover:bg-primary-container/90 text-white font-black rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Apply Filters
          </button>
          <button 
            onClick={clearFilters}
            className="w-full py-2 text-zinc-500 hover:text-red-500 font-bold text-sm transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
      {/* ================= END SIDEBAR ================= */}

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
          <ScrollReveal delay={50} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
                {searchQuery ? `Results for "${searchQuery}"` : 'Magical Collection'}
              </h1>
              {!isLoading && (
                <p className="text-zinc-500 font-medium mt-1">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              )}
            </div>

            {/* SEARCH BAR & FILTER BUTTON CONTAINER */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto relative z-10">
              
              {/* Trigger Sidebar Button */}
              <button 
                onClick={openSidebar}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-inner border-none backdrop-blur-md bg-white/80 text-zinc-700 hover:bg-white focus:outline-none focus:ring-0"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                Filters
                {(activeFilters.selectedAges.length > 0 || activeFilters.minPrice > 0 || activeFilters.maxPrice < 2000 || activeFilters.availability.inStock || activeFilters.availability.outOfStock) && (
                  <span className="bg-primary-container text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                    !
                  </span>
                )}
              </button>

              {/* Inline Search Bar */}
              <form
                onSubmit={handleLocalSearch}
                className="flex items-center gap-2 bg-white/80 rounded-full px-5 py-2.5 shadow-inner w-full sm:w-80 border-none focus-within:shadow-md transition-shadow"
              >
                <span className="material-symbols-outlined text-primary-container text-[20px]">search</span>
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search toys..."
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none font-medium text-sm text-zinc-800 placeholder:text-zinc-400 w-full"
                />
                {localSearch && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </form>
            </div>
          </ScrollReveal>

          {/* ACTIVE SEARCH BADGE */}
          {searchQuery && (
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-sm font-bold text-zinc-500">Search:</span>
              <span className="flex items-center gap-2 bg-primary-container/10 border border-primary-container/20 text-primary-container font-bold text-sm px-4 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-[16px]">search</span>
                "{searchQuery}"
                <button onClick={clearSearch} className="hover:text-red-500 transition-colors ml-1 focus:outline-none">
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
          {!isLoading && filteredProducts.length === 0 && (
            <div className="card-surface rounded-[3rem] p-20 flex flex-col items-center justify-center text-center shadow-soft mt-8">
              <span className="material-symbols-outlined text-[80px] text-zinc-300 mb-6">search_off</span>
              <h2 className="text-2xl font-black text-zinc-800 mb-3">
                No toys found.
              </h2>
              <p className="text-zinc-500 mb-8 max-w-md">
                Try adjusting your search keywords or clearing your filters to see more results.
              </p>
              <button
                onClick={() => { clearSearch(); clearFilters(); }}
                className="px-8 py-4 bg-primary-container text-white font-black rounded-full hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* PRODUCT GRID */}
          {!isLoading && filteredProducts.length > 0 && (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8 mt-4">
              {filteredProducts.map((product, index) => {
                const isFavorited = wishlistItems.some((wItem) => wItem._id === product._id);
                const discountPercent = getDiscountPercent(product.price, product.oldPrice);

                return (
                  <ScrollReveal
                    as="div"
                    key={product._id}
                    delay={(index % 12) * 50}
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

                    {/* PRODUCT IMAGE — rounded-[1.5rem] added to <img> to fix GPU clipping bug */}
                    <Link
                      to={`/product/${product._id}`}
                      className="w-full aspect-[4/3] bg-white/50 rounded-[1.5rem] overflow-hidden relative mb-5 shadow-inner border border-white/60 block z-10 isolate transform-gpu"
                    >
                      <img
                        alt={product.title}
                        className="w-full h-full object-cover rounded-[1.5rem] group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
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

          {/* PAGINATION CONTROLS */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 sm:gap-6 mt-16 pb-8">
              <button
                onClick={() => setPage(page > 1 ? page - 1 : 1)}
                disabled={page === 1}
                className={`px-5 py-3 rounded-full font-black flex items-center gap-2 transition-all ${
                  page === 1
                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                    : 'bg-white text-zinc-800 shadow-md hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span> Prev
              </button>
              <span className="font-bold text-zinc-600 bg-white/50 px-4 py-2 rounded-full border border-white">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                disabled={page === totalPages}
                className={`px-5 py-3 rounded-full font-black flex items-center gap-2 transition-all ${
                  page === totalPages
                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                    : 'bg-primary-container text-white shadow-md hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                Next <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          )}

        </div>
      </main>
    </>
  );
};

export default Shop;