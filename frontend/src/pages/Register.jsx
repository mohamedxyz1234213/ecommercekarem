import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
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

const Register = () => {
  const { register, googleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch {
      // error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        await googleLogin(response.access_token);
        navigate('/');
      } catch {
        // error handled in context
      }
    },
    onError: () => toast.error('Google signup failed'),
  });

  const handleAppleSignup = () => {
    toast('Apple signup coming soon!', { icon: '🍎' });
  };

  const styles = {
    page: { paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--light)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    container: { width: '100%', maxWidth: '440px', padding: '2rem 1.5rem 4rem' },
    card: { backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' },
    header: { textAlign: 'center', marginBottom: '2rem' },
    logo: { fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '3px', color: 'var(--primary)', marginBottom: '0.5rem' },
    title: { fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 500, marginBottom: '0.5rem' },
    subtitle: { fontSize: '0.9rem', color: 'var(--gray-500)' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    inputWrapper: { position: 'relative' },
    icon: { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', fontSize: '1rem' },
    input: {
      width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
      border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-sm)',
      fontSize: '0.9rem', backgroundColor: 'var(--light)',
    },
    eyeBtn: { position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', fontSize: '1rem' },
    submitBtn: {
      width: '100%', padding: '0.9rem', backgroundColor: 'var(--primary)', color: '#fff',
      border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', fontWeight: 600,
      letterSpacing: '1px', cursor: 'pointer',
    },
    divider: { display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' },
    dividerLine: { flex: 1, height: '1px', backgroundColor: 'var(--gray-200)' },
    dividerText: { fontSize: '0.8rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '1px' },
    socialBtn: {
      width: '100%', padding: '0.8rem', border: '1.5px solid var(--gray-200)',
      borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--white)',
      fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
    },
    socialBtns: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    loginLink: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--gray-500)' },
    loginAnchor: { color: 'var(--primary)', fontWeight: 600, marginLeft: '0.25rem' },
  };

  return (
    <motion.div style={styles.page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div style={styles.container}>
        <AnimatedSection>
          <div style={styles.card}>
            <div style={styles.header}>
              <p style={styles.logo}>KARÉME</p>
              <h1 style={styles.title}>Create Account</h1>
              <p style={styles.subtitle}>Join our fragrance community</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputWrapper}>
                <FiUser style={styles.icon} />
                <input style={styles.input} name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
              </div>

              <div style={styles.inputWrapper}>
                <FiMail style={styles.icon} />
                <input style={styles.input} type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} />
              </div>

              <div style={styles.inputWrapper}>
                <FiLock style={styles.icon} />
                <input
                  style={styles.input}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button type="button" style={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <div style={styles.inputWrapper}>
                <FiLock style={styles.icon} />
                <input
                  style={styles.input}
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <motion.button
                type="submit"
                style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </motion.button>
            </form>

            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>or</span>
              <div style={styles.dividerLine} />
            </div>

            <div style={styles.socialBtns}>
              <motion.button
                style={styles.socialBtn}
                whileHover={{ borderColor: 'var(--primary)', y: -1 }}
                onClick={() => handleGoogleSignup()}
                type="button"
              >
                <FcGoogle size={20} /> Sign up with Google
              </motion.button>

              <motion.button
                style={{ ...styles.socialBtn, backgroundColor: '#000', color: '#fff', border: 'none' }}
                whileHover={{ opacity: 0.9, y: -1 }}
                onClick={handleAppleSignup}
                type="button"
              >
                <FaApple size={20} /> Sign up with Apple
              </motion.button>
            </div>

            <p style={styles.loginLink}>
              Already have an account?
              <Link to="/login" style={styles.loginAnchor}>Sign in</Link>
            </p>
          </div>
        </AnimatedSection>
      </div>
    </motion.div>
  );
};

export default Register;
