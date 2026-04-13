import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion'; 
import toast from 'react-hot-toast'; 
import ScrollReveal from '../components/ScrollReveal.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { apiSlice, useGetProductsQuery } from '../features/api/apiSlice.js';
import { toggleFavorite } from '../features/wishlist/wishlistSlice.js';
import { addToCart, setPendingItem } from '../features/cart/cartSlice';

const ageCategories = ["0-12 MO", "12-36 MO", "2-5 YRS", "5-7 YRS", "7-10 YRS", "10-14 YRS", "14+ YRS"];
const tagCategories = [
  "Soft Toys", "Wooden Wonders", "Remote Control Cars", "Arts & Crafts", 
  "Mind Puzzles", "Metal Machines", "Outdoor Adventures", "Educational Games", "Building & STEM"
];

const MAX_SLIDER_PRICE = 5000;

const defaultFilters = {
  availability: { inStock: false, outOfStock: false },
  minPrice: 0,
  maxPrice: MAX_SLIDER_PRICE, 
  selectedAges: [], 
  selectedTags: [],
  minRating: '',
  sort: 'newest'
};

const EMPTY_ARRAY = []; 

// ==========================================
// Helper to resolve image paths correctly for backend uploads
// ==========================================
const resolveImage = (imgPath) => {
  if (!imgPath) return 'https://via.placeholder.com/400x400?text=No+Image';
  if (imgPath.startsWith('http') || imgPath.startsWith('data:')) return imgPath;
  
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const baseUrl = apiBaseUrl.replace('/api', '');
  return `${baseUrl}${imgPath}`;
};

const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <input 
      type="checkbox" 
      className="hidden" 
      checked={checked} 
      onChange={onChange} 
    />
    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? 'bg-orange-500 border-orange-500 text-white shadow-md' : 'bg-white border-zinc-300 text-transparent group-hover:border-orange-400'}`}>
      <span className="material-symbols-outlined text-[14px] font-black">check</span>
    </div>
    <span className={`text-sm font-bold ${checked ? 'text-zinc-900' : 'text-zinc-500 group-hover:text-zinc-800'}`}>{label}</span>
  </label>
);

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || EMPTY_ARRAY);
  const prefetchProduct = apiSlice.usePrefetch('getProductById');

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const initialAge = searchParams.get('age');
  const initialTag = searchParams.get('tag');
  
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isTyping, setIsTyping] = useState(false); 
  const [page, setPage] = useState(1);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [activeFilters, setActiveFilters] = useState({
    ...defaultFilters,
    selectedAges: initialAge ? initialAge.split(',') : [],
    selectedTags: initialTag ? initialTag.split(',') : []
  });
  
  const [tempFilters, setTempFilters] = useState({
    ...defaultFilters,
    selectedAges: initialAge ? initialAge.split(',') : [],
    selectedTags: initialTag ? initialTag.split(',') : []
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setIsTyping(false); 
      
      if (localSearch !== searchQuery) {
        setPage(1); 
        
        const currentParams = new URLSearchParams(searchParams);
        
        if (localSearch.trim()) {
          currentParams.set('search', localSearch.trim());
        } else {
          currentParams.delete('search');
        }
        
        setSearchParams(currentParams);
      }
    }, 700); 

    return () => clearTimeout(delayDebounceFn);
  }, [localSearch, searchQuery, searchParams, setSearchParams]);

  useEffect(() => {
    const currentAgeParam = searchParams.get('age');
    const currentTagParam = searchParams.get('tag');

    const urlAges = currentAgeParam ? currentAgeParam.split(',') : [];
    const urlTags = currentTagParam ? currentTagParam.split(',') : [];

    const agesMatch = urlAges.length === activeFilters.selectedAges.length && urlAges.every(a => activeFilters.selectedAges.includes(a));
    const tagsMatch = urlTags.length === activeFilters.selectedTags.length && urlTags.every(t => activeFilters.selectedTags.includes(t));

    if (!agesMatch || !tagsMatch) {
       setActiveFilters(prev => ({ ...prev, selectedAges: urlAges, selectedTags: urlTags }));
       setTempFilters(prev => ({ ...prev, selectedAges: urlAges, selectedTags: urlTags }));
    }
  }, [searchParams]);

  const queryArgs = useMemo(() => ({
    keyword: searchQuery,
    tags: activeFilters.selectedTags.join(','),
    category: activeFilters.selectedAges.join(','),
    minPrice: activeFilters.minPrice > 0 ? activeFilters.minPrice : '',
    maxPrice: activeFilters.maxPrice < MAX_SLIDER_PRICE ? activeFilters.maxPrice : '',
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
  
  const clearSearch = () => { 
    setLocalSearch(''); 
    setIsTyping(false);
    const currentParams = new URLSearchParams(searchParams);
    currentParams.delete('search');
    setSearchParams(currentParams);
    setPage(1); 
  };

  const openSidebar = () => { setTempFilters(activeFilters); setIsSidebarOpen(true); document.body.style.overflow = 'hidden'; };
  const closeSidebar = () => { setIsSidebarOpen(false); document.body.style.overflow = 'unset'; };
  
  const applyFilters = () => { 
      setActiveFilters(tempFilters); 
      setPage(1); 
      closeSidebar(); 
      
      const newParams = new URLSearchParams(searchParams);
      
      if (tempFilters.selectedAges.length > 0) {
         newParams.set('age', tempFilters.selectedAges.join(','));
      } else {
         newParams.delete('age');
      }
      
      if (tempFilters.selectedTags.length > 0) {
         newParams.set('tag', tempFilters.selectedTags.join(','));
      } else {
         newParams.delete('tag');
      }
      
      setSearchParams(newParams);
  };
  
  const clearFilters = () => {
    setTempFilters(defaultFilters); 
    setActiveFilters(defaultFilters); 
    setPage(1); 
    closeSidebar();
    
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('age');
    newParams.delete('tag');
    setSearchParams(newParams);
  };

  const handleFilterToggle = (type, value) => {
    setTempFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value) 
        ? prev[type].filter(item => item !== value) 
        : [...prev[type], value]
    }));
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setActiveFilters(prev => ({ ...prev, sort: val }));
    setTempFilters(prev => ({ ...prev, sort: val }));
    setPage(1);
  };

  const handleAddToCartClick = (product) => {
    const userInfoData = sessionStorage.getItem('userInfo');
    const userInfo = (userInfoData && userInfoData !== 'null' && userInfoData !== 'undefined') ? JSON.parse(userInfoData) : null;
    
    if (!userInfo) {
       dispatch(setPendingItem({ ...product, qty: 1 }));
       navigate('/cart');
    } else {
       dispatch(addToCart({ ...product, qty: 1 })); 
       if(product.countInStock === 0) {
         toast.error(`Added to cart waitlist (currently out of stock)`);
       } else {
         toast.success(`${product.title} added to cart!`); 
       }
    }
  };

  if (error) return <div className="min-h-screen flex items-center justify-center bg-surface"><h2 className="text-2xl font-bold text-red-500">Failed to load products.</h2></div>;

  return (
    <>
      <style>{`
        .custom-range-slider::-webkit-slider-thumb {
          pointer-events: auto;
          appearance: none;
          width: 22px;
          height: 22px;
          background-color: white;
          border: 2px solid #f97316;
          border-radius: 50%;
          cursor: grab;
          box-shadow: 0 2px 6px rgba(249, 115, 22, 0.3);
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
        }
        .custom-range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 10px rgba(249, 115, 22, 0.4);
        }
        .custom-range-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.05);
        }
        .custom-range-slider::-moz-range-thumb {
          pointer-events: auto;
          appearance: none;
          width: 22px;
          height: 22px;
          background-color: white;
          border: 2px solid #f97316;
          border-radius: 50%;
          cursor: grab;
          box-shadow: 0 2px 6px rgba(249, 115, 22, 0.3);
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
        }
        .custom-range-slider::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 10px rgba(249, 115, 22, 0.4);
        }
        .custom-range-slider::-moz-range-thumb:active {
          cursor: grabbing;
          transform: scale(1.05);
        }
      `}</style>

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
                <Checkbox key={tag} label={tag} checked={tempFilters.selectedTags.includes(tag)} onChange={() => handleFilterToggle('selectedTags', tag)} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-zinc-800 mb-4 uppercase tracking-wider text-xs">Shop by Age</h3>
            <div className="space-y-3">
              {ageCategories.map((age) => (
                <Checkbox key={age} label={age} checked={tempFilters.selectedAges.includes(age)} onChange={() => handleFilterToggle('selectedAges', age)} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-zinc-900 uppercase tracking-widest text-xs">Price Range</h3>
              <span className="text-[10px] font-black text-orange-600 bg-orange-50 border border-orange-100 px-2 py-1 rounded-md tracking-wider">
                ₹{tempFilters.minPrice} - {tempFilters.maxPrice >= MAX_SLIDER_PRICE ? `₹${MAX_SLIDER_PRICE}+` : `₹${tempFilters.maxPrice}`}
              </span>
            </div>
            
            <div className="relative w-full h-8 flex items-center group/slider mt-2">
              <div className="absolute w-full h-2 bg-zinc-100 rounded-full z-0 overflow-hidden shadow-inner"></div>
              
              <div 
                className="absolute h-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full z-10 transition-all duration-100 ease-out shadow-sm"
                style={{ 
                  left: `${(tempFilters.minPrice / MAX_SLIDER_PRICE) * 100}%`, 
                  right: `${100 - (tempFilters.maxPrice / MAX_SLIDER_PRICE) * 100}%` 
                }}
              ></div>

              <input 
                type="range" 
                min="0" 
                max={MAX_SLIDER_PRICE} 
                step="100"
                value={tempFilters.minPrice} 
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), tempFilters.maxPrice - 100);
                  setTempFilters(prev => ({ ...prev, minPrice: val }));
                }}
                className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-20 focus:outline-none custom-range-slider"
              />

              <input 
                type="range" 
                min="0" 
                max={MAX_SLIDER_PRICE} 
                step="100"
                value={tempFilters.maxPrice} 
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), tempFilters.minPrice + 100);
                  setTempFilters(prev => ({ ...prev, maxPrice: val }));
                }}
                className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-30 focus:outline-none custom-range-slider"
              />
            </div>
            
            <div className="flex justify-between text-[10px] font-bold text-zinc-400 mt-3">
              <span>₹0</span>
              <span>₹{MAX_SLIDER_PRICE / 2}</span>
              <span>₹{MAX_SLIDER_PRICE}+</span>
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
                {(activeFilters.selectedAges.length > 0 || activeFilters.selectedTags.length > 0 || activeFilters.minPrice > 0 || activeFilters.maxPrice < MAX_SLIDER_PRICE || activeFilters.minRating !== '' || activeFilters.availability.inStock || activeFilters.availability.outOfStock) && (<span className="bg-primary-container text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">!</span>)}
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

              <form onSubmit={handleLocalSearchSubmit} className="flex items-center gap-2 bg-white/80 rounded-full px-5 py-2.5 shadow-inner w-full sm:w-80 border-none focus-within:shadow-md transition-shadow relative">
                
                <div className="flex items-center justify-center w-6 h-6">
                  <AnimatePresence mode="wait">
                    {(isTyping || isFetching) ? (
                      <motion.span 
                        key="loading"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="material-symbols-outlined text-orange-500 text-[20px] animate-spin absolute"
                      >
                        progress_activity
                      </motion.span>
                    ) : (
                      <motion.span 
                        key="search"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="material-symbols-outlined text-primary-container text-[20px] absolute"
                      >
                        search
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <input 
                  type="text" 
                  value={localSearch} 
                  onChange={(e) => { 
                    setLocalSearch(e.target.value); 
                    setIsTyping(true); 
                  }} 
                  placeholder="Search toys..." 
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 font-medium text-sm text-zinc-800 placeholder:text-zinc-400 w-full" 
                />
                
                {localSearch && (
                  <button type="button" onClick={clearSearch} className="text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none flex items-center">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </form>
            </div>
          </ScrollReveal>

          {(!isTyping && isLoading && filteredProducts.length === 0) ? (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8 mt-4">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (!isTyping && filteredProducts.length === 0) ? (
            <div className="card-surface rounded-[3rem] p-20 flex flex-col items-center justify-center text-center shadow-soft mt-8 border border-white">
              <span className="material-symbols-outlined text-[80px] text-zinc-300 mb-6">search_off</span>
              <h2 className="text-2xl font-black text-zinc-800 mb-3">No toys found.</h2>
              <p className="text-zinc-500 mb-8 max-w-md">Try adjusting your search keywords or clearing your filters to see more results.</p>
              <button onClick={() => { clearSearch(); clearFilters(); }} className="px-8 py-4 bg-primary-container text-white font-black rounded-full hover:-translate-y-1 hover:shadow-lg transition-all">Clear All Filters</button>
            </div>
          ) : (
            <div className={`w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8 mt-4 transition-opacity duration-300 ${isFetching ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
              {filteredProducts.map((product, index) => {
                const isFavorited = wishlistItems.some((wItem) => wItem._id === product._id);
                const discountPercent = getDiscountPercent(product.price, product.oldPrice);
                
                // Determine if there is a second image to show on hover
                const hoverImage = (product.images && product.images.length > 1 && product.images[1] !== product.img) 
                    ? product.images[1] 
                    : null;

                return (
                  <ScrollReveal 
                    as="div" 
                    key={product._id} 
                    delay={(index % 12) * 50} 
                    onMouseEnter={() => prefetchProduct(product._id)} 
                    className="flex flex-col group relative card-surface p-4 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl border border-white"
                  >
                    {/* Top Right Favorite Icon Only */}
                    <button onClick={() => { dispatch(toggleFavorite(product)); isFavorited ? toast.error('Removed from favorites') : toast.success('Added to favorites!'); }} className="absolute top-6 right-6 z-30 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-zinc-100">
                      <span className={`material-symbols-outlined text-[20px] transition-colors ${isFavorited ? 'text-red-500 filled' : 'text-zinc-400 hover:text-red-400'}`}>favorite</span>
                    </button>

                    <Link to={`/product/${product._id}`} className="w-full aspect-square bg-slate-50 rounded-[2rem] overflow-hidden relative mb-5 shadow-inner border border-slate-100/50 flex flex-col items-center justify-center p-4 z-10 isolate transform-gpu">
                      {product.tag && (
                        <div className="absolute top-3 left-3 bg-white/90 text-zinc-900 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm z-20">
                          {product.tag}
                        </div>
                      )}
                      
                      {product.countInStock === 0 && (
                         <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-red-100 shadow-sm">
                            <span className="text-red-500 font-black text-[9px] uppercase tracking-widest flex items-center gap-1">
                               Out of Stock
                            </span>
                         </div>
                      )}

                      {/* Image Logic handling multiple images */}
                      <div className="relative w-full h-full flex items-center justify-center">
                        {hoverImage ? (
                          <>
                            <img alt={product.title} className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 mix-blend-multiply group-hover:opacity-0 group-hover:scale-95 ${product.countInStock === 0 ? 'opacity-60 grayscale-[50%]' : ''}`} src={resolveImage(product.img)} />
                            <img alt={`${product.title} alternate`} className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 mix-blend-multiply opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100 ${product.countInStock === 0 ? 'opacity-60 grayscale-[50%]' : ''}`} src={resolveImage(hoverImage)} />
                          </>
                        ) : (
                           <img alt={product.title} className={`w-full h-full object-contain transition-transform duration-700 ease-out mix-blend-multiply group-hover:scale-110 ${product.countInStock === 0 ? 'opacity-60 grayscale-[50%]' : ''}`} src={resolveImage(product.img)} />
                        )}
                      </div>

                      {/* Bottom Sliding Add To Cart Button */}
                      <div className="absolute -bottom-16 left-0 right-0 flex justify-center px-3 transition-all duration-300 group-hover:bottom-4 z-30">
                    <button
                        onClick={(e) => {
                      e.preventDefault(); // Prevent Link navigation
                      e.stopPropagation();
                      handleAddToCartClick(product);
                    }}
                    className={`w-full py-2.5 rounded-2xl backdrop-blur-md shadow-lg flex items-center justify-center gap-2 font-black transition-transform hover:scale-105 text-sm ${product.countInStock > 0 ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/30' : 'bg-red-50/90 text-red-500 border border-red-100 hover:bg-red-100'}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                    {product.countInStock > 0 ? 'Add to Cart' : 'Waitlist'}
                  </button>
                      </div>
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