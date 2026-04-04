import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop'; 
import ProductDetail from './pages/ProductDetail'; 
import Cart from './pages/Cart'; 
import Checkout from './pages/Checkout'; 
import Auth from './pages/Auth'; 

function App() {
  return (
    <Router>
      {/* 1. Wrap the whole app in a flex column that takes at least the full screen height */}
      <div className="flex flex-col min-h-screen">
        
        <Navbar />
        
        {/* 2. Wrap Routes in a main tag with 'flex-grow'. 
               This forces this section to stretch and push the footer to the bottom! */}
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Updated 404 Route to also flex properly inside the new layout */}
            <Route path="*" element={
              <div className="flex-grow flex flex-col items-center justify-center pt-32 pb-24 text-center">
                <h1 className="text-[120px] leading-none font-black text-zinc-100 mb-2 drop-shadow-sm">404</h1>
                <h2 className="text-3xl font-black text-zinc-800 mb-4 tracking-tighter">Oops! Page Not Found</h2>
                <p className="text-zinc-500 font-medium mb-8">We can't seem to find the magical page you're looking for.</p>
                <a href="/" className="bg-primary-container text-white px-8 py-4 rounded-full font-black shadow-lg hover:bg-orange-600 transition-colors hover:scale-105 active:scale-95">
                  Go Back Home
                </a>
              </div>
            } />
          </Routes>
        </main>

        <Footer />

      </div>

      {/* Floating Action Button (Kept outside the flex layout so it floats properly) */}
      <div className="fixed bottom-10 right-10 z-40">
        <button className="w-16 h-16 bg-primary-container text-white rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 hover:scale-110 active:scale-95 transition-transform hover:bg-orange-600">
          <span className="material-symbols-outlined text-3xl">chat_bubble</span>
        </button>
      </div>
    </Router>
  );
}

export default App;