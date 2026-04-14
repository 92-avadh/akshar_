import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 

// CRITICAL/CORE COMPONENTS (Load Immediately)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Loader from './components/Loader'; 
import CloudSyncManager from './components/CloudSyncManager'; 
import ErrorBoundary from './components/ErrorBoundary'; 

// ==========================================
// PRODUCTION ROUTE CODE SPLITTING
// ==========================================
const Home = lazy(() => import('./Pages/Home'));
const Shop = lazy(() => import('./Pages/Shop'));
const ProductDetail = lazy(() => import('./Pages/ProductDetail'));
const Cart = lazy(() => import('./Pages/Cart'));
const Checkout = lazy(() => import('./Pages/Checkout'));
const Profile = lazy(() => import('./Pages/Profile'));
const Auth = lazy(() => import('./Pages/Auth'));
const Favorites = lazy(() => import('./Pages/Favorites'));
const About = lazy(() => import('./Pages/About'));       
const Contact = lazy(() => import('./Pages/Contact'));   
const AdminDashboard = lazy(() => import('./Pages/AdminDashboard'));
const AdminCatalog = lazy(() => import('./Pages/AdminCatalog'));
const NotFound = lazy(() => import('./Pages/NotFound'));

// Footer Pages (Lazy loaded)
const SafetyStandards = lazy(() => import('./Pages/SafetyStandards'));
const ShippingInfo = lazy(() => import('./Pages/ShippingInfo'));
const Returns = lazy(() => import('./Pages/Returns'));
const PrivacyPolicy = lazy(() => import('./Pages/PrivacyPolicy'));
const Terms = lazy(() => import('./Pages/Terms'));

// ==========================================
// SECURE ADMIN ROUTE GATEKEEPER
// ==========================================
const AdminRoute = ({ children }) => {
  const userInfoData = sessionStorage.getItem('userInfo');
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

  return (
    <Router>
      <CloudSyncManager /> 
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

      {/* Wrapper to fix footer sticking to bottom nicely across all pages */}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <ErrorBoundary>
            <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><Loader fullScreen={false} /></div>}>
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

                {/* FOOTER PAGE ROUTES */}
                <Route path="/safety-standards" element={<SafetyStandards />} />
                <Route path="/shipping" element={<ShippingInfo />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />

                {/* SECURE ADMIN ROUTES */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/catalog" element={<AdminRoute><AdminCatalog /></AdminRoute>} />

                {/* 404 CATCH-ALL ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;