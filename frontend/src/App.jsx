import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import LoadingSpinner from './components/LoadingSpinner';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import InstapayPayment from './pages/InstapayPayment';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderDetail from './pages/OrderDetail';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <CartDrawer />
      <main style={{ minHeight: '100vh' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instapay-payment"
              element={
                <ProtectedRoute>
                  <InstapayPayment />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}

export default App;
