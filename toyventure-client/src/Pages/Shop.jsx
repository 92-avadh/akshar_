import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <-- Imported Link here!

const Shop = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const products = [
    { 
      id: 1, 
      title: "G Patton Die-Cast Off-Road SUV Toy Car with Lights & Sounds", 
      price: "₹1,199.00", 
      oldPrice: "₹1,999.00", 
      discount: "[40% OFF]",
      clubPrice: "₹1,139.00",
      img: "https://images.unsplash.com/photo-1594787317666-41793740284e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 2, 
      title: "AMG G63 G Wagon Die-Cast Metal Car with Openable Doors", 
      price: "₹2,699.00", 
      oldPrice: "₹3,999.00", 
      discount: "[33% OFF]",
      clubPrice: "₹2,564.00",
      img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 3, 
      title: "Rolls Royce Phantom Diecast Car Model | Luxury Series", 
      price: "₹2,599.00", 
      oldPrice: "₹3,999.00", 
      discount: "[35% OFF]",
      clubPrice: "₹2,469.00",
      img: "https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 4, 
      title: "Range Rover Scale Model Car - Exclusive All Black Edition", 
      price: "₹2,699.00", 
      oldPrice: "₹3,999.00", 
      discount: "[33% OFF]",
      clubPrice: "₹2,564.00",
      img: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 5, 
      title: "Vintage Classic Beetle 1:32 Scale Diecast Pull Back Car", 
      price: "₹899.00", 
      oldPrice: "₹1,499.00", 
      discount: "[40% OFF]",
      clubPrice: "₹854.00",
      img: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 6, 
      title: "Lamborghini Aventador Sports Car Metal Replica", 
      price: "₹3,199.00", 
      oldPrice: "₹4,999.00", 
      discount: "[36% OFF]",
      clubPrice: "₹3,039.00",
      img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 7, 
      title: "Ford Mustang Shelby GT500 Die-Cast Collectible", 
      price: "₹1,899.00", 
      oldPrice: "₹2,999.00", 
      discount: "[36% OFF]",
      clubPrice: "₹1,804.00",
      img: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 8, 
      title: "Jeep Wrangler Rubicon Heavy Duty Metal Toy", 
      price: "₹1,499.00", 
      oldPrice: "₹2,499.00", 
      discount: "[40% OFF]",
      clubPrice: "₹1,424.00",
      img: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
    }
  ];

  return (
    <main className="pt-28 pb-24 max-w-[1440px] mx-auto px-6 min-h-screen">
      
      {/* ================= BREADCRUMBS ================= */}
      <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-6">
        <Link to="/" className="hover:text-primary-container flex items-center">
          <span className="material-symbols-outlined text-[16px] mr-1">home</span> HOME
        </Link>
        <span>/</span>
        <Link to="/store" className="hover:text-primary-container">STORE</Link>
        <span>/</span>
        <span className="text-zinc-800">METAL CARS</span>
      </div>

      {/* ================= PAGE TITLE ================= */}
      <h1 className="text-4xl md:text-5xl font-black text-on-surface mb-8 tracking-tighter">Metal Cars Collection</h1>

      {/* ================= TOP TOOLBAR ================= */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 mb-4 gap-4 border-b border-surface-variant/50 pb-6">
        
        {/* Left Side: Filter Button & Count */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors shadow-sm font-bold text-sm border ${isFilterOpen ? 'bg-primary-container text-white border-primary-container' : 'bg-white border-zinc-200 text-zinc-700 hover:border-primary-container hover:text-primary-container'}`}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span> 
            {isFilterOpen ? 'Close Filters' : 'Show Filters'}
          </button>
          <span className="text-zinc-500 font-medium text-sm hidden sm:block">Showing {products.length} magical items</span>
        </div>

        {/* Right Side: View Toggles & Sort Dropdown */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          
          {/* Grid View Toggles (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center bg-zinc-100 border border-zinc-200 rounded-full p-1 shadow-inner">
            <button className="bg-zinc-800 text-white px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-sm">
              <span className="material-symbols-outlined text-[16px]">grid_view</span> 4
            </button>
            <button className="text-zinc-500 hover:text-zinc-800 px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-colors">
              <span className="material-symbols-outlined text-[16px]">view_comfy</span> 5
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-sm bg-zinc-50 px-4 py-2 rounded-full border border-zinc-200">
            <span className="text-zinc-500 font-bold hidden sm:block">Sort:</span>
            <select className="border-none bg-transparent font-bold text-zinc-800 cursor-pointer focus:ring-0 p-0 pr-6 outline-none">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= EXPANDABLE TOP FILTER PANEL ================= */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isFilterOpen ? 'max-h-[500px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}`}>
        <div className="bg-surface-container-low border border-surface-variant p-8 rounded-[2rem] shadow-inner grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Filter Group 1 */}
          <div>
            <h4 className="font-black text-sm text-zinc-800 uppercase tracking-wider mb-4">Shop By Age</h4>
            <div className="space-y-3">
              {['0-3 Years', '3-5 Years', '5-8 Years', '8+ Years'].map(age => (
                <label key={age} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded text-primary-container focus:ring-primary-container border-zinc-300 cursor-pointer" />
                  <span className="text-sm font-medium text-zinc-600 group-hover:text-primary-container transition-colors">{age}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter Group 2 */}
          <div>
            <h4 className="font-black text-sm text-zinc-800 uppercase tracking-wider mb-4">Price Range</h4>
            <div className="space-y-3">
              {['Under ₹499', '₹500 - ₹999', '₹1000 - ₹1999', 'Above ₹2000'].map(price => (
                <label key={price} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded text-primary-container focus:ring-primary-container border-zinc-300 cursor-pointer" />
                  <span className="text-sm font-medium text-zinc-600 group-hover:text-primary-container transition-colors">{price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter Group 3 */}
          <div>
            <h4 className="font-black text-sm text-zinc-800 uppercase tracking-wider mb-4">Vehicle Type</h4>
            <div className="space-y-3">
              {['Sports Cars', 'Off-Road / SUVs', 'Classic / Vintage', 'Construction'].map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded text-primary-container focus:ring-primary-container border-zinc-300 cursor-pointer" />
                  <span className="text-sm font-medium text-zinc-600 group-hover:text-primary-container transition-colors">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex flex-col justify-end gap-3">
             <button className="w-full py-3 bg-primary-container text-white font-black rounded-xl hover:bg-orange-600 transition-colors shadow-md">Apply Filters</button>
             <button onClick={() => setIsFilterOpen(false)} className="w-full py-3 bg-white border border-zinc-200 text-zinc-600 font-bold rounded-xl hover:bg-zinc-50 transition-colors">Clear All</button>
          </div>

        </div>
      </div>

      {/* ================= FULL WIDTH PRODUCT GRID ================= */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-12">
        {products.map((product) => (
          /* Notice how this is now a <Link> component instead of a <div> */
          <Link to={`/product/${product.id}`} key={product.id} className="flex flex-col group cursor-pointer relative block">
            
            {/* Quick Add Button (Appears on Hover) - To prevent click-through on the link, we use e.preventDefault() */}
            <button 
              onClick={(e) => { e.preventDefault(); alert("Added to cart!"); }}
              className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm text-primary-container p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            </button>

            {/* Image Container */}
            <div className="w-full aspect-[4/3] bg-zinc-100 rounded-[2rem] overflow-hidden relative mb-4 shadow-sm border border-black/5">
              <img 
                alt={product.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" 
                src={product.img}
              />
              <div className="absolute bottom-3 right-3 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[12px]">toys</span>
              </div>
            </div>

            {/* Product Details */}
            <div className="px-1 flex flex-col flex-1">
              <h3 className="font-bold text-zinc-800 text-[15px] leading-snug group-hover:text-primary-container transition-colors line-clamp-2 h-11 mb-2">
                {product.title}
              </h3>
              
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-red-600 font-black text-lg tracking-tight">{product.price}</span>
                <span className="text-zinc-400 line-through text-xs font-medium">{product.oldPrice}</span>
                <span className="text-green-600 font-black text-xs tracking-wider">{product.discount}</span>
              </div>
              
              <p className="text-teal-700 font-black text-sm tracking-tight mt-auto">
                Club Price: {product.clubPrice}
              </p>
            </div>

          </Link>
        ))}
      </div>

      {/* Pagination / Load More */}
      <div className="mt-16 flex justify-center">
         <button className="bg-white border-2 border-zinc-200 text-zinc-800 font-black px-10 py-3 rounded-full hover:border-zinc-800 hover:shadow-lg transition-all">
            Load More Products
         </button>
      </div>

    </main>
  );
};

export default Shop;