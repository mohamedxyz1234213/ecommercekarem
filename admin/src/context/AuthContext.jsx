import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await API.get('/auth/me');
      const currentUser = data.user || data;
      if (currentUser && currentUser.role === 'admin') {
        setUser(currentUser);
      } else {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        toast.error('Access denied. Admin only.');
      }
    } catch {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      const currentUser = data.user || data;
      if (!currentUser || currentUser.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        return false;
      }
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(currentUser));
      setUser(currentUser);
      toast.success('Welcome back, Admin!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
