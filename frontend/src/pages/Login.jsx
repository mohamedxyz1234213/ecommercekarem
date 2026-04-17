import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import AnimatedSection from '../components/AnimatedSection';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const Login = () => {
  const { login, googleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      // error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        await googleLogin(response.access_token);
        navigate('/');
      } catch {
        // error handled in context
      }
    },
    onError: () => toast.error('Google login failed'),
  });

  const handleAppleLogin = () => {
    toast('Apple login coming soon!', { icon: '🍎' });
  };

  /* Cream card + dark type: site --white is a green tint, so avoid it for auth surfaces */
  const c = {
    cardBg: '#FAF8F5',
    ink: '#0f1a12',
    inkMuted: '#3d4d3a',
    line: '#D4CFC4',
    fieldBg: '#FFFFFF',
    fieldBorder: '#B8C4B0',
    googleBorder: '#DADCE0',
    googleText: '#2c3136',
  };

  const styles = {
    page: {
      paddingTop: '100px',
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: { width: '100%', maxWidth: '440px', padding: '2rem 1.5rem 4rem' },
    card: {
      backgroundColor: c.cardBg,
      borderRadius: 'var(--radius-md)',
      padding: '2.5rem',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    header: { textAlign: 'center', marginBottom: '2rem' },
    logo: {
      fontFamily: 'var(--font-body)',
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.28em',
      textTransform: 'uppercase',
      color: '#1a3d12',
      marginBottom: '0.75rem',
    },
    title: {
      fontFamily: 'var(--font-heading)',
      fontSize: '1.85rem',
      fontWeight: 500,
      marginBottom: '0.5rem',
      color: c.ink,
    },
    subtitle: { fontSize: '0.95rem', color: c.inkMuted, lineHeight: 1.5 },
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    inputWrapper: { position: 'relative' },
    icon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#3d5045',
      fontSize: '1rem',
    },
    input: {
      width: '100%',
      padding: '0.85rem 1rem 0.85rem 2.75rem',
      border: `1.5px solid ${c.fieldBorder}`,
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.95rem',
      backgroundColor: c.fieldBg,
      color: c.ink,
    },
    eyeBtn: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#3d5045',
      cursor: 'pointer',
      fontSize: '1rem',
    },
    forgotLink: {
      textAlign: 'right',
      fontSize: '0.85rem',
      color: '#014421',
      fontWeight: 600,
      cursor: 'pointer',
    },
    submitBtn: {
      width: '100%',
      padding: '0.95rem',
      backgroundColor: '#014421',
      color: '#fff',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.95rem',
      fontWeight: 600,
      letterSpacing: '0.06em',
      cursor: 'pointer',
    },
    divider: { display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' },
    dividerLine: { flex: 1, height: '1px', backgroundColor: c.line },
    dividerText: {
      fontSize: '0.72rem',
      color: '#5a635c',
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      fontWeight: 600,
    },
    googleBtn: {
      width: '100%',
      padding: '0.85rem 1rem',
      border: `1px solid ${c.googleBorder}`,
      borderRadius: '10px',
      backgroundColor: '#FFFFFF',
      fontSize: '0.9rem',
      fontWeight: 600,
      color: c.googleText,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      boxShadow: '0 1px 2px rgba(60, 64, 67, 0.08)',
    },
    appleBtn: {
      width: '100%',
      padding: '0.85rem 1rem',
      border: 'none',
      borderRadius: '10px',
      backgroundColor: '#111827',
      fontSize: '0.9rem',
      fontWeight: 600,
      color: '#F9FAFB',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
    },
    socialBtns: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    registerLink: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: c.inkMuted },
    registerAnchor: { color: '#014421', fontWeight: 700, marginLeft: '0.35rem' },
  };

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div style={styles.container}>
        <AnimatedSection>
          <div style={styles.card}>
            <div style={styles.header}>
              <p style={styles.logo}>VYBE SCENT</p>
              <h1 style={styles.title}>Welcome Back</h1>
              <p style={styles.subtitle}>Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputWrapper}>
                <FiMail style={styles.icon} />
                <input
                  className="auth-page-input"
                  style={styles.input}
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div style={styles.inputWrapper}>
                <FiLock style={styles.icon} />
                <input
                  className="auth-page-input"
                  style={styles.input}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" style={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <div style={styles.forgotLink}>Forgot password?</div>

              <motion.button
                type="submit"
                style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </motion.button>
            </form>

            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>or</span>
              <div style={styles.dividerLine} />
            </div>

            <div style={styles.socialBtns}>
              <motion.button
                style={styles.googleBtn}
                whileHover={{ boxShadow: '0 2px 8px rgba(60, 64, 67, 0.18)', y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleGoogleLogin()}
                type="button"
              >
                <FcGoogle size={22} /> Continue with Google
              </motion.button>

              <motion.button
                style={styles.appleBtn}
                whileHover={{ opacity: 0.92, y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleAppleLogin}
                type="button"
              >
                <FaApple size={22} /> Continue with Apple
              </motion.button>
            </div>

            <p style={styles.registerLink}>
              Don&apos;t have an account?
              <Link to="/register" style={styles.registerAnchor}>Create one</Link>
            </p>
          </div>
        </AnimatedSection>
      </div>
      <style>{`
        .auth-page-input::placeholder {
          color: #6d766f;
        }
      `}</style>
    </motion.div>
  );
};

export default Login;
