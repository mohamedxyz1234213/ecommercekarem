import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1A2E0A 0%, #2D5016 50%, #8B7355 100%)',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'white',
          borderRadius: 20,
          padding: 48,
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              color: '#1A2E0A',
              marginBottom: 8,
            }}
          >
            Admin Panel
          </h1>
          <p style={{ color: '#8B7355', fontSize: '0.9rem' }}>
            Perfume Store Management
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.85rem', color: '#1A1A1A' }}>
              Email Address
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #e0d8cc',
                borderRadius: 10,
                padding: '0 14px',
                transition: 'border-color 0.2s',
              }}
            >
              <MdEmail size={18} style={{ color: '#8B7355', flexShrink: 0 }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@perfume.com"
                required
                style={{
                  flex: 1,
                  padding: '12px 10px',
                  border: 'none',
                  fontSize: '0.9rem',
                  background: 'transparent',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.85rem', color: '#1A1A1A' }}>
              Password
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #e0d8cc',
                borderRadius: 10,
                padding: '0 14px',
              }}
            >
              <MdLock size={18} style={{ color: '#8B7355', flexShrink: 0 }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  flex: 1,
                  padding: '12px 10px',
                  border: 'none',
                  fontSize: '0.9rem',
                  background: 'transparent',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', color: '#8B7355', padding: 4 }}
              >
                {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#8B7355' : '#2D5016',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: '1rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
