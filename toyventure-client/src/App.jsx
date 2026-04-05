import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './Pages/Home';
import Shop from './Pages/Shop'; 
import ProductDetail from './Pages/ProductDetail'; 
import Cart from './Pages/Cart'; 
import Checkout from './Pages/Checkout'; 
import Auth from './Pages/Auth'; 
import Favorites from './Pages/Favorites'; 
import Profile from './Pages/Profile';
import AdminDashboard from './Pages/AdminDashboard'; // <-- NEW IMPORT

function App() {
  return (
    <Router>
      <ScrollToTop />
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/favorites" element={<Favorites />} /> 
            <Route path="/profile" element={<Profile />} />
            
            {/* NEW: Admin Route */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            <Route path="*" element={
              <div className="flex-grow flex flex-col items-center justify-center pt-32 pb-24 text-center px-6">
                <h1 className="text-[120px] md:text-[150px] leading-none font-black bg-gradient-to-br from-primary-container to-purple-600 text-transparent bg-clip-text mb-4 drop-shadow-md">
                  404
                </h1>
                <h2 className="text-3xl font-black text-zinc-800 mb-4 tracking-tighter">Oops! Page Not Found</h2>
                <p className="text-zinc-500 font-medium mb-8 text-lg">We can't seem to find the magical page you're looking for.</p>
                <Link to="/" className="bg-primary-container text-white px-10 py-4 rounded-full font-black shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all hover:-translate-y-1 active:scale-95">
                  Go Back Home
                </Link>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>

      <div className="fixed bottom-10 right-10 z-40">
        <button className="w-16 h-16 bg-primary-container text-white rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 hover:scale-110 active:scale-95 transition-transform hover:bg-orange-600">
          <span className="material-symbols-outlined text-3xl">chat_bubble</span>
        </button>
      </div>
    </Router>
  );
}

export default App;