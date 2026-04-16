import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Import Pages
import Home from './Pages/Home';
import Shop from './Pages/Shop';
import ProductDetail from './Pages/ProductDetail';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import Auth from './Pages/Auth';
import Profile from './Pages/Profile';
import SafetyStandards from './Pages/SafetyStandards';
import NotFound from './Pages/NotFound';

// --- NEW PAGE IMPORTS ADDED HERE ---
import About from './Pages/About';
import Contact from './Pages/Contact';
import ShippingInfo from './Pages/ShippingInfo';
import Returns from './Pages/Returns';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import Terms from './Pages/Terms';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ScrollToTop ensures the page resets to the top when navigating */}
      <ScrollToTop /> 
      
      {/* Navbar stays at the top of every page */}
      <Navbar />

      {/* Main content area where different pages will load */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/safety-standards" element={<SafetyStandards />} />
          
          {/* --- NEW ROUTES ADDED HERE --- */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Catch-all route for 404 pages */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer stays at the bottom of every page */}
      <Footer />
    </div>
  );
}

export default App;