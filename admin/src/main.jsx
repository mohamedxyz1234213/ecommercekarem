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
              background: '#1A2E0A',
              color: '#FAF8F5',
              fontFamily: 'Lato, sans-serif',
            },
            success: { iconTheme: { primary: '#C4A265', secondary: '#FAF8F5' } },
            error: { iconTheme: { primary: '#e74c3c', secondary: '#FAF8F5' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
