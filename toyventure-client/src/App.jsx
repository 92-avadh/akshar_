import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import About from './Pages/About';       // NEW: Imported About page
import Contact from './Pages/Contact';   // NEW: Imported Contact page
import AdminDashboard from './Pages/AdminDashboard';
import AdminCatalog from './Pages/AdminCatalog';
import ScrollToTop from './components/ScrollToTop';

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
  
  // If user exists AND has the admin role, allow them in.
  if (userInfo && userInfo.role === 'admin') {
    return children;
  }
  
  // Otherwise, kick them to the login screen and save the URL they tried to visit
  return <Navigate to="/auth?redirect=/admin" replace />;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <div className="flex-grow">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />       {/* NEW: Added About Route */}
          <Route path="/contact" element={<Contact />} />   {/* NEW: Added Contact Route */}
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} /> 
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />

          {/* SECURE ADMIN ROUTES (Wrapped in Gatekeeper) */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/catalog" 
            element={
              <AdminRoute>
                <AdminCatalog />
              </AdminRoute>
            } 
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;