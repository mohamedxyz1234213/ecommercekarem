import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'placeholder-client-id'}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#163022',
                  color: '#E6F1E9',
                  fontFamily: "'Lato', sans-serif",
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
                  border: '1px solid #2A4A38',
                },
                success: {
                  iconTheme: { primary: '#2f7a3f', secondary: '#163022' },
                },
                error: {
                  iconTheme: { primary: '#DC2626', secondary: '#163022' },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
