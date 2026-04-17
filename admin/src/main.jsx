import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#142016',
              fontFamily: 'Lato, sans-serif',
              border: '1px solid #c4bfb3',
              boxShadow: '0 8px 24px rgba(20, 32, 22, 0.12)',
            },
            success: { iconTheme: { primary: '#1e7a4c', secondary: '#ffffff' } },
            error: { iconTheme: { primary: '#c0392b', secondary: '#ffffff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
