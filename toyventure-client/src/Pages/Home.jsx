import React from 'react';
import ScrollReveal from '../components/ScrollReveal.jsx';

const Home = () => {
  const marqueeCategories = [
    { name: "Action Figures", icon: "sports_martial_arts" },
    { name: "Building Blocks", icon: "extension" },
    { name: "Dolls & Accessories", icon: "child_care" },
    { name: "Educational & STEM", icon: "school" },
    { name: "Outdoor Play", icon: "sports_soccer" },
    { name: "Puzzles", icon: "extension_off" },
    { name: "RC Vehicles", icon: "toys" },
    { name: "Arts & Crafts", icon: "palette" }
  ];
  const duplicatedCategories = [...marqueeCategories, ...marqueeCategories];

  const brands = ["BlockMaster", "SpeedWheels", "CuddleCo", "EcoPlay", "TechTot", "BrainyKids"];

  const flashDeals = [
    { title: "360° RC Stunt Car", price: "₹499", oldPrice: "₹999", img: "https://images.unsplash.com/photo-1594787317666-41793740284e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", tag: "50% OFF", desc: "Performs amazing flips & spins!" },
    { title: "Push & Go Dino Car", price: "₹199", oldPrice: "₹399", img: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", tag: "HOT DEAL", desc: "Friction powered for toddlers." },
    { title: "Diecast Metal Thar", price: "₹299", oldPrice: "₹599", img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", tag: "BEST SELLER", desc: "Detailed collectible model." }
  ];

  const ages = [
    { label: "0-18m", title: "Babies", bgClass: "bg-primary-fixed", textClass: "text-primary-container", hoverClass: "hover:bg-primary-container" },
    { label: "1-3y", title: "Toddlers", bgClass: "bg-secondary-fixed", textClass: "text-secondary-container", hoverClass: "hover:bg-secondary-container" },
    { label: "3-5y", title: "Preschool", bgClass: "bg-tertiary-fixed", textClass: "text-tertiary", hoverClass: "hover:bg-tertiary" },
    { label: "5-7y", title: "Big Kids", bgClass: "bg-primary-fixed", textClass: "text-primary-container", hoverClass: "hover:bg-primary-container" },
    { label: "8-12y", title: "Tweens", bgClass: "bg-secondary-fixed", textClass: "text-secondary-container", hoverClass: "hover:bg-secondary-container" },
    { label: "13+", title: "Teens", bgClass: "bg-tertiary-fixed", textClass: "text-tertiary", hoverClass: "hover:bg-tertiary" }
  ];

  const products = [
    { title: "Eco-Wooden Rail Express", price: "₹899", age: "AGES 3-5", rating: 5, img: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", tag: "Eco Friendly", desc: "Sustainably sourced, hours of imaginative play!" },
    { title: "Diecast Metal Truck", price: "₹599", age: "AGES 8+", rating: 5, img: "https://images.unsplash.com/photo-1594787317666-41793740284e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", tag: "Collectible", desc: "Realistic detail, perfect for car enthusiasts." },
    { title: "Building Blocks Set", price: "₹1,199", age: "AGES 5-7", rating: 4, img: "https://images.unsplash.com/photo-1555448248-2571daf6344b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", tag: "STEM", desc: "Learn counting, colors, and engineering principles." },
    { title: "Deluxe Art & Craft Kit", price: "₹699", age: "AGES 6+", rating: 5, img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", tag: "Creative Play", desc: "Complete kit for drawing, coloring, and crafting fun." }
  ];

  const reviews = [
    { name: "Priya S.", comment: "Got the RC stunt car for my son's 5th birthday. The battery life is amazing and he loves the 360 spins!", rating: 5, location: "Delhi" },
    { name: "Rahul M.", comment: "The diecast metal cars are incredibly detailed. Very fast shipping, highly recommended for collectors.", rating: 5, location: "Mumbai" },
    { name: "Anjali D.", comment: "Excellent quality push and go toys. The plastic is very sturdy, completely safe for my toddler.", rating: 4, location: "Bangalore" }
  ];

  const articles = [
    { title: "5 Screen-Free Activities for Rainy Days", category: "Parenting", image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", date: "Oct 12, 2024" },
    { title: "How to Choose the Right STEM Toy", category: "Education", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", date: "Oct 08, 2024" },
    { title: "The Benefits of Wooden Toys", category: "Eco-Friendly", image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", date: "Oct 01, 2024" }
  ];

  const faqs = [
    { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express 1-2 day delivery is available at checkout." },
    { q: "Are your toys tested for safety?", a: "Absolutely. 100% of our products exceed international child safety standards." },
    { q: "What is your return policy?", a: "We offer a 30-day hassle-free return policy. Send it back for a full refund." },
    { q: "Do you offer gift wrapping?", a: "Yes! You can select our signature gift wrapping and add a note at checkout." }
  ];

  return (
    <main className="pt-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      {/* Background Doodle overlay */}
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      {/* ================= HERO SECTION ================= */}
      <ScrollReveal as="section" className="px-6 py-12 max-w-[1440px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative h-[350px] rounded-[2.5rem] overflow-hidden group shadow-card cursor-pointer">
            <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Adventure Toys" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col items-center justify-end p-8 text-center">
              <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-3 drop-shadow-md">DINO-MITE<br/>ADVENTURE</h2>
              <span className="bg-primary-container text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-orange-500 transition-colors">Roar into Fun!</span>
            </div>
          </div>

          <div className="relative h-[350px] rounded-[2.5rem] overflow-hidden group shadow-card cursor-pointer md:-translate-y-4">
            <img src="https://images.unsplash.com/photo-1558060370-d644479cb6f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Wonderland Toys" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-transparent to-black/60 flex flex-col items-center justify-between p-8 text-center">
              <h2 className="text-3xl lg:text-4xl font-black text-yellow-300 leading-tight drop-shadow-lg mt-4">WONDERLAND<br/>FESTIVAL</h2>
              <div className="flex items-center gap-2 text-white font-bold bg-white/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-soft">Explore Now <span className="material-symbols-outlined text-sm">arrow_forward</span></div>
            </div>
          </div>

          <div className="relative h-[350px] rounded-[2.5rem] overflow-hidden group shadow-card cursor-pointer">
            <img src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Construction Toys" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent flex flex-col items-start justify-end p-8">
              <h2 className="text-3xl lg:text-4xl font-black text-blue-200 leading-tight mb-3 drop-shadow-md">THE GREAT<br/>BUILD ZONE</h2>
              <span className="bg-secondary-container text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-red-700 transition-colors">Start Building</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ================= MARQUEE ================= */}
      <ScrollReveal delay={100} className="bg-primary-container text-white py-4 overflow-hidden relative pause-marquee shadow-inner my-6 z-10">
        <div className="animate-marquee flex items-center gap-12 pl-12">
          {duplicatedCategories.map((category, index) => (
            <a key={index} href="#" className="flex items-center gap-3 whitespace-nowrap group hover:scale-110 transition-transform cursor-pointer">
              <span className="material-symbols-outlined text-2xl group-hover:text-yellow-300 transition-colors">{category.icon}</span>
              <span className="text-xl font-black uppercase tracking-wider group-hover:text-yellow-300 transition-colors">{category.name}</span>
            </a>
          ))}
        </div>
      </ScrollReveal>

      {/* ================= BRANDS BANNER ================= */}
      <ScrollReveal as="section" delay={150} className="py-10 bg-surface-container-highest border-y border-surface-variant/50 relative z-10">
        <div className="max-w-[1440px] mx-auto px-6">
          <p className="text-center text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Trusted by top toy makers</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {brands.map((brand, index) => (
              <div key={index} className="text-2xl md:text-3xl font-black text-zinc-400 tracking-tighter hover:text-primary-container hover:opacity-100 transition-all cursor-pointer">{brand}</div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* ================= FLASH SALE ================= */}
      <ScrollReveal as="section" className="px-6 py-16 max-w-[1440px] mx-auto relative z-10">
        <div className="bg-gradient-to-r from-secondary-container to-red-800 rounded-4xl p-8 md:p-12 text-white shadow-card">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-yellow-300 text-3xl">bolt</span>
                <h2 className="text-4xl font-black tracking-tighter">Flash Deals</h2>
              </div>
              <p className="text-white/80 font-medium mb-4">Grab these deep discounts on our hottest items updated daily!</p>
            </div>
            <div className="flex gap-4 shrink-0">
              <div className="bg-white/20 px-5 py-3 rounded-2xl text-center backdrop-blur-md shadow-soft border border-white/30">
                <span className="block text-3xl font-black">04</span><span className="text-xs uppercase font-bold text-white/90">Hours</span>
              </div>
              <div className="bg-white/20 px-5 py-3 rounded-2xl text-center backdrop-blur-md shadow-soft border border-white/30">
                <span className="block text-3xl font-black">45</span><span className="text-xs uppercase font-bold text-white/90">Mins</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {flashDeals.map((deal, index) => (
              <div key={index} className="card-surface rounded-3xl p-6 flex flex-col sm:flex-row gap-6 items-center group cursor-pointer hover:-translate-y-1 transition-all duration-300">
                <div className="relative w-32 h-32 shrink-0 rounded-2xl overflow-hidden bg-zinc-100 p-2 shadow-inner">
                  <img src={deal.img} alt={deal.title} className="w-full h-full object-contain mix-blend-multiply" />
                  <span className="absolute top-2 left-2 bg-primary-container text-white text-[10px] font-black px-2.5 py-1.5 rounded-full uppercase tracking-wider">{deal.tag}</span>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-on-surface text-xl leading-snug mb-2 group-hover:text-primary-container transition-colors">{deal.title}</h3>
                  <p className="text-zinc-500 text-sm mb-4 font-medium">{deal.desc}</p>
                  <div className="flex items-baseline gap-3 justify-center sm:justify-start mb-4">
                    <span className="text-3xl font-black text-secondary-container">{deal.price}</span>
                    <span className="text-base font-medium text-zinc-400 line-through">{deal.oldPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* ================= FEATURED CATEGORIES ================= */}
      <ScrollReveal as="section" className="px-6 py-12 max-w-[1440px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative h-80 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-card hover:-translate-y-1 transition-transform duration-300">
            <img src="https://images.unsplash.com/photo-1594787318286-3d835c1d207f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Metal Cars" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="px-3 py-1 bg-primary-container text-white text-xs font-black uppercase rounded-full mb-3 inline-block">Trending</span>
              <h3 className="text-3xl font-black text-white mb-2">Diecast Metal Cars</h3>
              <a href="/metal-cars" className="text-white flex items-center gap-2 font-bold hover:text-primary-fixed transition-colors">Explore Collection <span className="material-symbols-outlined text-sm">arrow_forward</span></a>
            </div>
          </div>

          <div className="group relative h-80 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-card hover:-translate-y-1 transition-transform duration-300">
            <img src="https://images.unsplash.com/photo-1555448248-2571daf6344b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Toys for Boys" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h3 className="text-3xl font-black text-white mb-2">Action & Adventure</h3>
              <a href="/boys" className="text-white flex items-center gap-2 font-bold hover:text-primary-fixed transition-colors">Shop Boys <span className="material-symbols-outlined text-sm">arrow_forward</span></a>
            </div>
          </div>

          <div className="group relative h-80 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-card hover:-translate-y-1 transition-transform duration-300">
            <img src="https://images.unsplash.com/photo-1558060370-d644479cb6f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Toys for Girls" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h3 className="text-3xl font-black text-white mb-2">Creative & Crafty</h3>
              <a href="/girls" className="text-white flex items-center gap-2 font-bold hover:text-primary-fixed transition-colors">Shop Girls <span className="material-symbols-outlined text-sm">arrow_forward</span></a>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ================= SHOP BY AGE ================= */}
      <ScrollReveal as="section" className="px-6 py-20 max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-4xl font-black tracking-tighter mb-4 text-on-surface">Shop by Age</h2>
          <div className="w-24 h-2 bg-primary-container rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {ages.map((age, index) => (
            <button key={index} className={`group flex flex-col items-center gap-4 p-8 card-surface rounded-[2rem] transition-all duration-300 hover:-translate-y-2 ${age.hoverClass}`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center group-hover:bg-white transition-colors shadow-sm ${age.bgClass} ${age.textClass}`}>
                <span className="text-2xl font-black">{age.label}</span>
              </div>
              <span className="font-bold text-on-surface group-hover:text-white">{age.title}</span>
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* ================= NEW ARRIVALS ================= */}
      <ScrollReveal as="section" delay={100} className="px-6 py-24 bg-surface-container-low/60 backdrop-blur-sm rounded-[3rem] shadow-card relative z-10 mt-8 border border-white/50">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-16 gap-6 flex-wrap">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface mb-3">Fresh Arrivals</h2>
              <p className="text-zinc-600 font-medium text-lg">Fresh from the toy factory, just for you!</p>
            </div>
            <a className="px-6 py-3 card-surface text-primary-container rounded-full font-bold text-base flex items-center gap-2.5 hover:bg-primary-container hover:text-white transition-all shadow-soft shrink-0" href="/new-arrivals">
              View All New <span className="material-symbols-outlined text-sm font-bold">arrow_forward_ios</span>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product, index) => (
              <div key={index} className="group card-surface rounded-[2rem] overflow-hidden hover:-translate-y-2 transition-all duration-400">
                <div className="relative h-72 overflow-hidden bg-zinc-50/50 p-6 flex items-center justify-center border-b border-white/60">
                  <img alt={product.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" src={product.img}/>
                  <div className="absolute top-5 left-5 bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">{product.tag}</div>
                </div>
                <div className="p-8 space-y-5">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded text-[11px] font-bold tracking-wider">{product.age}</span>
                    <div className="flex text-orange-400 text-sm gap-0.5">
                      {[...Array(product.rating)].map((_, i) => <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-on-surface leading-tight mb-2 group-hover:text-primary-container transition-colors line-clamp-2 h-14">{product.title}</h3>
                  <p className="text-zinc-500 text-sm font-medium line-clamp-2 h-10">{product.desc}</p>
                  <div className="flex items-center justify-between gap-4 pt-3 border-t border-surface-variant/50">
                    <span className="text-3xl font-black text-on-surface">{product.price}</span>
                    <button className="w-14 h-14 bg-primary-container text-white rounded-full flex items-center justify-center shadow-soft active:scale-95 transition-transform hover:bg-orange-600">
                      <span className="material-symbols-outlined text-2xl">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* ================= STANDARD ================= */}
      <ScrollReveal as="section" delay={150} className="px-6 py-24 max-w-[1440px] mx-auto relative z-10">
        <div className="bg-gradient-to-br from-primary-fixed to-orange-100 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-card border border-white/50">
          <div className="absolute top-10 right-10 opacity-20 transform rotate-12 float-soft">
            <span className="material-symbols-outlined text-[120px] text-primary-container">rocket_launch</span>
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-on-primary-fixed leading-tight tracking-tighter mb-6">The ToyVenture Standard</h2>
              <p className="text-xl text-on-primary-fixed-variant mb-12 max-w-lg">We deliver safe, sustainable, and joyful experiences that last a lifetime.</p>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 shrink-0 bg-white/80 backdrop-blur rounded-2xl flex items-center justify-center text-primary-container shadow-sm border border-white"><span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span></div>
                  <div><h4 className="text-xl font-bold text-on-primary-fixed mb-1">100% Safe</h4><p className="text-on-primary-fixed-variant">Rigorously tested to exceed safety standards.</p></div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 shrink-0 bg-white/80 backdrop-blur rounded-2xl flex items-center justify-center text-secondary shadow-sm border border-white"><span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>construction</span></div>
                  <div><h4 className="text-xl font-bold text-on-primary-fixed mb-1">Built Sturdy</h4><p className="text-on-primary-fixed-variant">Made with high-impact, non-toxic materials.</p></div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 shrink-0 bg-white/80 backdrop-blur rounded-2xl flex items-center justify-center text-tertiary shadow-sm border border-white"><span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>nature_people</span></div>
                  <div><h4 className="text-xl font-bold text-on-primary-fixed mb-1">Eco-Sourced</h4><p className="text-on-primary-fixed-variant">Using sustainable woods and recycled plastics.</p></div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/40 rounded-[2.5rem] blur-2xl"></div>
                <img alt="Happy child" className="relative rounded-[2.5rem] shadow-card rotate-3 hover:rotate-0 transition-transform duration-700 w-full h-[500px] object-cover border-4 border-white/50" src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"/>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ================= TESTIMONIALS ================= */}
      <ScrollReveal as="section" className="px-6 py-24 max-w-[1440px] mx-auto relative z-10 mt-10">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface mb-3">Loved by Parents & Kids Alike</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {reviews.map((review, index) => (
            <div key={index} className="card-surface p-10 rounded-4xl relative space-y-6 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300">
              <span className="absolute top-8 right-8 text-primary-fixed/60 material-symbols-outlined text-6xl">format_quote</span>
              <div>
                <div className="flex text-orange-400 mb-5 gap-0.5">
                  {[...Array(review.rating)].map((_, i) => <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                </div>
                <p className="text-on-surface-variant font-medium text-xl mb-6 relative z-10 leading-relaxed">"{review.comment}"</p>
              </div>
              <div className="flex items-center gap-4 pt-6 border-t border-surface-variant/70">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tertiary-fixed to-purple-200 flex items-center justify-center text-tertiary font-black text-xl shadow-inner border border-white">{review.name.charAt(0)}</div>
                <div>
                  <span className="font-bold text-on-surface text-lg block">{review.name}</span>
                  <span className="text-sm text-zinc-500 font-medium">{review.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* ================= BLOG ================= */}
      <ScrollReveal as="section" className="px-6 py-24 max-w-[1440px] mx-auto relative z-10">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-on-surface mb-2">The ToyVenture Playbook</h2>
            <p className="text-zinc-600 font-medium">Tips, tricks, and guides for raising happy, creative kids.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div key={index} className="group cursor-pointer card-surface p-4 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 card-surface px-3 py-1 rounded-full text-xs font-black text-on-surface uppercase">{article.category}</div>
              </div>
              <div className="px-2 pb-2">
                <div className="text-sm font-bold text-zinc-400 mb-2">{article.date}</div>
                <h3 className="text-2xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">{article.title}</h3>
                <p className="font-bold text-primary flex items-center gap-1 text-sm">Read Article <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span></p>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* ================= FAQ ================= */}
      <ScrollReveal as="section" delay={100} className="px-6 py-20 bg-surface-container-low/50 backdrop-blur-sm relative z-10 border-t border-white/50">
        <div className="max-w-[1000px] mx-auto text-center">
          <h2 className="text-4xl font-black tracking-tighter text-on-surface mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {faqs.map((faq, index) => (
              <div key={index} className="card-surface p-8 rounded-3xl hover:shadow-soft transition-shadow duration-300">
                <h3 className="text-xl font-bold text-on-surface mb-3 flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container">help</span>{faq.q}
                </h3>
                <p className="text-zinc-600 font-medium pl-9 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* ================= NEWSLETTER ================= */}
      <ScrollReveal as="section" className="px-6 py-20 max-w-[1440px] mx-auto my-16 relative z-10">
        <div className="bg-gradient-to-r from-tertiary-container to-purple-700 rounded-[3rem] p-10 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 shadow-card border border-purple-300/50">
          <div className="text-center md:text-left flex-1 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">Join the Adventure & Save 15%!</h2>
            <p className="text-white/80 text-xl font-medium max-w-xl">Subscribe to our playful newsletter for exclusive offers, early access to new drops, and fun parenting tips.</p>
          </div>
          <form className="w-full md:w-auto flex flex-col sm:flex-row gap-5 shrink-0 bg-white/10 p-6 rounded-[2.5rem] backdrop-blur-md shadow-soft border border-white/20" onSubmit={(e) => e.preventDefault()}>
            <input className="px-8 py-4 bg-white/90 text-on-tertiary-container placeholder:text-zinc-500 rounded-full focus:ring-4 focus:ring-purple-300/50 focus:border-white transition-all w-full sm:w-96 outline-none font-bold text-lg shadow-inner" placeholder="Your playful email..." type="email" required/>
            <button type="submit" className="px-12 py-4 bg-primary-container text-white font-black text-xl rounded-full hover:bg-orange-600 transition-colors shadow-lg shrink-0">Subscribe</button>
          </form>
        </div>
      </ScrollReveal>

    </main>
  );
};

export default Home;