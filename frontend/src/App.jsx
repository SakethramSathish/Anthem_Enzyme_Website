import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthModal from './components/AuthModal';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import RefundPolicy from './pages/RefundPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Products from './pages/Products';
import ProductDetailsA from './pages/ProductDetailsA';
import ProductDetailsB from './pages/ProductDetailsB';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import Dashboard from './pages/Dashboard';
import AdminPricing from './pages/AdminPricing';
import ShipmentTracking from './pages/ShipmentTracking';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthProvider';
import { LocalizationProvider } from './context/LocalizationContext';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const { user, userData, isAuthModalOpen, authMode, openAuthModal, closeAuthModal } = useAuth();

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 dark:bg-slate-950">
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} defaultMode={authMode} />
        
        <NavBar user={user} userData={userData} openAuthModal={openAuthModal} />

        <main className="flex-grow pt-[72px]">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/a" element={<ProductDetailsA openAuthModal={openAuthModal} />} />
            <Route path="/product/b" element={<ProductDetailsB openAuthModal={openAuthModal} />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            
            {/* Protected Routes */}
            <Route path="/cart" element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'manager', 'product_manager']}>
                <Cart user={user} openAuthModal={openAuthModal} />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'manager', 'product_manager']}>
                <Dashboard user={user} userData={userData} />
              </ProtectedRoute>
            } />
            <Route path="/admin/pricing" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPricing />
              </ProtectedRoute>
            } />

            <Route path="/shipment-tracking" element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'manager']}>
                <ShipmentTracking user={user} />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'manager', 'product_manager']}>
                <Checkout user={user} openAuthModal={openAuthModal} />
              </ProtectedRoute>
            } />
            <Route path="/invoice" element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'manager', 'product_manager']}>
                <Invoice user={user} />
              </ProtectedRoute>
            } />
            <Route path="/product" element={<Navigate to="/products" replace />} />
            <Route path="*" element={<NotFound openAuthModal={openAuthModal} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocalizationProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </LocalizationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
