import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './Pages/Home';
import Shop from './Pages/Shop';
import ProductDetail from './Pages/ProductDetail';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import Profile from './Pages/Profile';
import Auth from './Pages/Auth';
import Favorites from './Pages/Favorites';
import About from './Pages/About';       
import Contact from './Pages/Contact';   
import AdminDashboard from './Pages/AdminDashboard';
import AdminCatalog from './Pages/AdminCatalog';
import ScrollToTop from './components/ScrollToTop';
import Loader from './components/Loader'; 

// === NEW: Import the Footer Pages ===
import SafetyStandards from './Pages/SafetyStandards';
import ShippingInfo from './Pages/ShippingInfo';
import Returns from './Pages/Returns';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import Terms from './Pages/Terms';

// ==========================================
// SECURE ADMIN ROUTE GATEKEEPER
// ==========================================
const AdminRoute = ({ children }) => {
  const userInfoData = localStorage.getItem('userInfo');
  let userInfo = null;
  
  try {
    if (userInfoData && userInfoData !== 'null' && userInfoData !== 'undefined') {
      userInfo = JSON.parse(userInfoData);
    }
  } catch (e) {
    console.error("Error parsing user info");
  }
  
  if (userInfo && userInfo.role === 'admin') {
    return children;
  }
  
  return <Navigate to="/auth?redirect=/admin" replace />;
};

const App = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1500);

    return () => clearTimeout(splashTimer);
  }, []);

  if (isAppLoading) {
    return <Loader />;
  }

  return (
    <Router>
      <ScrollToTop />
      
      {/* Global Toast Notification Container */}
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            borderRadius: '16px',
            background: '#fff',
            color: '#27272a',
            fontWeight: '900',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f4f4f5'
          },
          success: {
            iconTheme: { primary: '#16a34a', secondary: '#fff' },
          },
        }}
      />

      <Navbar />
      <div className="flex-grow">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />       
          <Route path="/contact" element={<Contact />} />   
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} /> 
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />

          {/* === NEW: FOOTER PAGE ROUTES === */}
          <Route path="/safety-standards" element={<SafetyStandards />} />
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />

          {/* SECURE ADMIN ROUTES */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/catalog" element={<AdminRoute><AdminCatalog /></AdminRoute>} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;