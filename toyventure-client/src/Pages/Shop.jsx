import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion'; 
import toast from 'react-hot-toast'; 
import ScrollReveal from '../components/ScrollReveal.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { apiSlice, useGetProductsQuery } from '../features/api/apiSlice.js';
import { toggleFavorite } from '../features/wishlist/wishlistSlice.js';
import { addToCart } from '../features/cart/cartSlice';

const ageCategories = ['0-2 Years', '3-5 Years', '6-8 Years', '9+ Years'];
const tagCategories = ['Unique', 'Educational', 'Soft Toys'];

const defaultFilters = {
  availability: { inStock: false, outOfStock: false },
  minPrice: '',
  maxPrice: '', 
  selectedAges: [], 
  minRating: '',
  sort: 'newest'
};

const EMPTY_ARRAY = []; 

// Reusable Multi-Select Checkbox Component
const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? 'bg-orange-500 border-orange-500 text-white shadow-md' : 'bg-white border-zinc-300 text-transparent group-hover:border-orange-400'}`}>
      <span className="material-symbols-outlined text-[14px] font-black">check</span>
    </div>
    <span className={`text-sm font-bold ${checked ? 'text-zinc-900' : 'text-zinc-500 group-hover:text-zinc-800'}`}>{label}</span>
  </label>
);

const Shop = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || EMPTY_ARRAY);
  const prefetchProduct = apiSlice.usePrefetch('getProductById');

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [page, setPage] = useState(1);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(defaultFilters);
  const [tempFilters, setTempFilters] = useState(defaultFilters);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setPage(1); 
        if (localSearch.trim()) {
          setSearchParams({ search: localSearch.trim() });
        } else {
          setSearchParams({});
        }
      }
    }, 500); 
    return () => clearTimeout(delayDebounceFn);
  }, [localSearch, setSearchParams, searchQuery]);

  // Construct query arguments using Active Filters for the Backend
  const queryArgs = useMemo(() => ({
    keyword: searchQuery,
    tags: activeFilters.selectedAges.join(','),
    minPrice: activeFilters.minPrice,
    maxPrice: activeFilters.maxPrice,
    minRating: activeFilters.minRating,
    sort: activeFilters.sort,
    inStock: activeFilters.availability.inStock ? 'true' : '',
    outOfStock: activeFilters.availability.outOfStock ? 'true' : '',
    page, 
    limit: 12 
  }), [searchQuery, activeFilters, page]);

  const { data: responseData, isLoading, isFetching, error } = useGetProductsQuery(queryArgs);

  const filteredProducts = responseData?.products || EMPTY_ARRAY;
  const totalPages = responseData?.pages || 1;

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

  const handleLocalSearchSubmit = (e) => e.preventDefault(); 
  const clearSearch = () => { setLocalSearch(''); setSearchParams({}); setPage(1); };

  const openSidebar = () => { setTempFilters(activeFilters); setIsSidebarOpen(true); document.body.style.overflow = 'hidden'; };
  const closeSidebar = () => { setIsSidebarOpen(false); document.body.style.overflow = 'unset'; };
  const applyFilters = () => { setActiveFilters(tempFilters); setPage(1); closeSidebar(); };
  
  const clearFilters = () => {
    setTempFilters(defaultFilters); 
    setActiveFilters(defaultFilters); 
    setPage(1); 
    closeSidebar();
  };

  const handleTagToggle = (tag) => {
    setTempFilters(prev => ({
      ...prev,
      selectedAges: prev.selectedAges.includes(tag) 
        ? prev.selectedAges.filter(a => a !== tag) 
        : [...prev.selectedAges, tag]
    }));
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setActiveFilters(prev => ({ ...prev, sort: val }));
    setTempFilters(prev => ({ ...prev, sort: val }));
    setPage(1);
  };

  if (error) return <div className="min-h-screen flex items-center justify-center bg-surface"><h2 className="text-2xl font-bold text-red-500">Failed to load products.</h2></div>;

  return (
    <>
      {/* SIDEBAR OVERLAY & PANEL */}
      <div className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={closeSidebar} />
      <div className={`fixed top-0 left-0 h-full w-[340px] bg-white z-[110] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-zinc-50/50">
          <h2 className="text-xl font-black text-zinc-800 flex items-center gap-2"><span className="material-symbols-outlined text-primary-container">tune</span> Filters</h2>
          <button onClick={closeSidebar} className="p-2 text-zinc-400 hover:text-zinc-800 rounded-full hover:bg-zinc-100 transition-colors"><span className="material-symbols-outlined">close</span></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          <div>
            <h3 className="font-bold text-zinc-800 mb-4 uppercase tracking-wider text-xs">Categories</h3>
            <div className="space-y-3">
              {tagCategories.map((tag) => (
                <Checkbox key={tag} label={tag} checked={tempFilters.selectedAges.includes(tag)} onChange={() => handleTagToggle(tag)} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-zinc-800 mb-4 uppercase tracking-wider text-xs">Shop by Age</h3>
            <div className="space-y-3">
              {ageCategories.map((age) => (
                <Checkbox key={age} label={age} checked={tempFilters.selectedAges.includes(age)} onChange={() => handleTagToggle(age)} />
              ))}
            </div>
          </div>

          {/* FIXED PRICE FILTER (Restored robust radio buttons) */}
          <div>
            <h3 className="font-black text-zinc-900 mb-4 uppercase tracking-widest text-xs">Price Range</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="radio" name="price" className="hidden" checked={tempFilters.minPrice === '' && tempFilters.maxPrice === ''} onChange={() => setTempFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }))} />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${tempFilters.minPrice === '' && tempFilters.maxPrice === '' ? 'border-orange-500' : 'border-zinc-300 group-hover:border-orange-400'}`}>
                  {tempFilters.minPrice === '' && tempFilters.maxPrice === '' && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>}
                </div>
                <span className={`text-sm font-bold ${tempFilters.minPrice === '' && tempFilters.maxPrice === '' ? 'text-zinc-900' : 'text-zinc-500'}`}>Any Price</span>
              </label>
              
              {[
                { label: 'Under ₹500', min: '0', max: '500' },
                { label: '₹500 - ₹1000', min: '500', max: '1000' },
                { label: '₹1000 - ₹2000', min: '1000', max: '2000' },
                { label: 'Over ₹2000', min: '2000', max: '999999' }
              ].map((range) => (
                <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="price" className="hidden" checked={tempFilters.minPrice === range.min && tempFilters.maxPrice === range.max} onChange={() => setTempFilters(prev => ({ ...prev, minPrice: range.min, maxPrice: range.max }))} />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${tempFilters.minPrice === range.min && tempFilters.maxPrice === range.max ? 'border-orange-500' : 'border-zinc-300 group-hover:border-orange-400'}`}>
                    {tempFilters.minPrice === range.min && tempFilters.maxPrice === range.max && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>}
                  </div>
                  <span className={`text-sm font-bold ${tempFilters.minPrice === range.min && tempFilters.maxPrice === range.max ? 'text-zinc-900' : 'text-zinc-500'}`}>{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-zinc-800 mb-4 uppercase tracking-wider text-xs">Customer Rating</h3>
            <div className="space-y-3">
              {[
                { label: '4 Stars & Up', val: '4' },
                { label: '3 Stars & Up', val: '3' },
                { label: 'Any Rating', val: '' }
              ].map((r) => (
                <label key={r.label} className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="rating" className="hidden" checked={tempFilters.minRating === r.val} onChange={() => setTempFilters(prev => ({ ...prev, minRating: r.val }))} />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${tempFilters.minRating === r.val ? 'border-orange-500' : 'border-zinc-300 group-hover:border-orange-400'}`}>
                    {tempFilters.minRating === r.val && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>}
                  </div>
                  <span className={`text-sm font-bold flex items-center gap-1 ${tempFilters.minRating === r.val ? 'text-zinc-900' : 'text-zinc-500'}`}>
                    {r.label} {r.val && <span className="material-symbols-outlined text-[16px] text-amber-400 filled">star</span>}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-zinc-800 mb-4 uppercase tracking-wider text-xs">Availability</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group"><input type="checkbox" checked={tempFilters.availability.inStock} onChange={(e) => setTempFilters(prev => ({ ...prev, availability: { ...prev.availability, inStock: e.target.checked } }))} className="w-5 h-5 rounded border-zinc-300 text-primary-container focus:ring-primary-container transition-all focus:ring-0 outline-none" /><span className="text-zinc-600 font-medium group-hover:text-zinc-900 transition-colors">In Stock Only</span></label>
              <label className="flex items-center gap-3 cursor-pointer group"><input type="checkbox" checked={tempFilters.availability.outOfStock} onChange={(e) => setTempFilters(prev => ({ ...prev, availability: { ...prev.availability, outOfStock: e.target.checked } }))} className="w-5 h-5 rounded border-zinc-300 text-primary-container focus:ring-primary-container transition-all focus:ring-0 outline-none" /><span className="text-zinc-600 font-medium group-hover:text-zinc-900 transition-colors">Include Out of Stock</span></label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex flex-col gap-3">
          <button onClick={applyFilters} className="w-full py-4 bg-primary-container hover:bg-orange-600 text-white font-black rounded-xl shadow-md transition-all hover:-translate-y-0.5">Apply Filters</button>
          <button onClick={clearFilters} className="w-full py-2 text-zinc-500 hover:text-red-500 font-bold text-sm transition-colors">Clear All Filters</button>
        </div>
      </div>

      <motion.main 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
        className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative"
      >
        <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

        <div className="max-w-[1440px] mx-auto px-6 relative z-10">

          <ScrollReveal className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-6">
            <Link to="/" className="hover:text-primary-container flex items-center transition-colors"><span className="material-symbols-outlined text-[16px] mr-1">home</span> HOME</Link><span>/</span><span className="text-zinc-800">SHOP</span>
          </ScrollReveal>

          <ScrollReveal delay={50} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter">{searchQuery ? `Results for "${searchQuery}"` : 'Magical Collection'}</h1>
              {!isLoading && <p className="text-zinc-500 font-medium mt-1">Showing {filteredProducts.length} items of {responseData?.totalProducts || 0} total</p>}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto relative z-10">
              <button onClick={openSidebar} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-inner border-none backdrop-blur-md bg-white/80 text-zinc-700 hover:bg-white focus:outline-none">
                <span className="material-symbols-outlined text-[18px]">tune</span> Filters
                {(activeFilters.selectedAges.length > 0 || activeFilters.minPrice !== '' || activeFilters.minRating !== '' || activeFilters.availability.inStock || activeFilters.availability.outOfStock) && (<span className="bg-primary-container text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">!</span>)}
              </button>

              <select 
                value={activeFilters.sort} 
                onChange={handleSortChange} 
                className="w-full sm:w-auto bg-white/80 border-none backdrop-blur-md text-zinc-800 font-bold text-sm rounded-full px-5 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-inner"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Best Rated</option>
              </select>

              <form onSubmit={handleLocalSearchSubmit} className="flex items-center gap-2 bg-white/80 rounded-full px-5 py-2.5 shadow-inner w-full sm:w-80 border-none focus-within:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-primary-container text-[20px]">search</span>
                <input type="text" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} placeholder="Search toys..." className="flex-1 bg-transparent border-none outline-none focus:ring-0 font-medium text-sm text-zinc-800 placeholder:text-zinc-400 w-full" />
                {localSearch && <button type="button" onClick={clearSearch} className="text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"><span className="material-symbols-outlined text-[18px]">close</span></button>}
              </form>
            </div>
          </ScrollReveal>

          {(isLoading || isFetching) ? (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8 mt-4">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="card-surface rounded-[3rem] p-20 flex flex-col items-center justify-center text-center shadow-soft mt-8 border border-white">
              <span className="material-symbols-outlined text-[80px] text-zinc-300 mb-6">search_off</span>
              <h2 className="text-2xl font-black text-zinc-800 mb-3">No toys found.</h2>
              <p className="text-zinc-500 mb-8 max-w-md">Try adjusting your search keywords or clearing your filters to see more results.</p>
              <button onClick={() => { clearSearch(); clearFilters(); }} className="px-8 py-4 bg-primary-container text-white font-black rounded-full hover:-translate-y-1 hover:shadow-lg transition-all">Clear All Filters</button>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8 mt-4">
              {filteredProducts.map((product, index) => {
                const isFavorited = wishlistItems.some((wItem) => wItem._id === product._id);
                const discountPercent = getDiscountPercent(product.price, product.oldPrice);

                return (
                  <ScrollReveal 
                    as="div" 
                    key={product._id} 
                    delay={(index % 12) * 50} 
                    onMouseEnter={() => prefetchProduct(product._id)} 
                    className="flex flex-col group relative card-surface p-4 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl border border-white"
                  >
                    <button onClick={() => { dispatch(toggleFavorite(product)); isFavorited ? toast.error('Removed from favorites') : toast.success('Added to favorites!'); }} className="absolute top-6 right-16 z-20 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-zinc-100">
                      <span className={`material-symbols-outlined text-[20px] transition-colors ${isFavorited ? 'text-red-500 filled' : 'text-zinc-400 hover:text-red-400'}`}>favorite</span>
                    </button>

                    <button onClick={() => { 
                        if(product.countInStock > 0) { 
                          dispatch(addToCart({ ...product, qty: 1 })); 
                          toast.success(`${product.title} added to cart!`); 
                        }
                      }} 
                      className={`absolute top-6 right-6 z-20 backdrop-blur-md p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-zinc-100 ${product.countInStock > 0 ? 'bg-white/90 text-primary-container hover:bg-primary-container hover:text-white' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{product.countInStock === 0 ? 'notifications' : 'shopping_cart'}</span>
                    </button>

                    <Link to={`/product/${product._id}`} className="w-full aspect-square bg-slate-50 rounded-[2rem] overflow-hidden relative mb-5 shadow-inner border border-slate-100/50 block z-10 isolate transform-gpu flex items-center justify-center p-4">
                      {product.tag && (
                        <div className="absolute top-3 left-3 bg-white/90 text-zinc-900 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm z-10">
                          {product.tag}
                        </div>
                      )}
                      {product.countInStock === 0 && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                          <span className="bg-red-500 text-white font-black px-4 py-2 rounded-full text-xs uppercase tracking-widest shadow-lg transform -rotate-12">Out of Stock</span>
                        </div>
                      )}
                      <img alt={product.title} className="w-full h-full object-contain group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700 ease-out mix-blend-multiply" src={product.img} />
                    </Link>

                    <div className="px-2 flex flex-col flex-1 justify-between">
                      <div>
                        {product.rating > 0 && (
                          <div className="flex items-center gap-1 mb-2">
                            <span className="material-symbols-outlined text-[14px] text-amber-400 filled">star</span>
                            <span className="text-xs font-bold text-zinc-600">{product.rating.toFixed(1)}</span>
                          </div>
                        )}
                        <Link to={`/product/${product._id}`}><h3 className="font-bold text-zinc-800 text-[15px] leading-snug hover:text-primary-container transition-colors line-clamp-2 h-11 mb-2">{product.title}</h3></Link>
                      </div>
                      
                      <div className="flex items-center gap-2.5 flex-wrap mt-2">
                        <span className="text-zinc-800 font-black text-xl tracking-tight">{displayPrice(product.price)}</span>
                        {product.oldPrice > 0 && <span className="text-zinc-400 line-through text-xs font-medium">{displayPrice(product.oldPrice)}</span>}
                        {discountPercent > 0 && <span className="text-green-600 font-black text-xs bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">{discountPercent}% OFF</span>}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 sm:gap-6 mt-16 pb-8">
              <button onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1} className={`px-5 py-3 rounded-full font-black flex items-center gap-2 transition-all ${page === 1 ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-white text-zinc-800 shadow-md hover:-translate-y-1'}`}><span className="material-symbols-outlined text-[20px]">arrow_back</span> Prev</button>
              <span className="font-bold text-zinc-600 bg-white/50 px-4 py-2 rounded-full border border-white shadow-sm">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(page < totalPages ? page + 1 : totalPages)} disabled={page === totalPages} className={`px-5 py-3 rounded-full font-black flex items-center gap-2 transition-all ${page === totalPages ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-primary-container text-white shadow-md hover:-translate-y-1'}`}>Next <span className="material-symbols-outlined text-[20px]">arrow_forward</span></button>
            </div>
          )}

        </div>
      </motion.main>
    </>
  );
};

export default Shop;