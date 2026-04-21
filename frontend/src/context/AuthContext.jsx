import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const extractErrorMessage = (error, fallbackMessage) => {
    const backendErrors = error.response?.data?.errors;
    if (Array.isArray(backendErrors) && backendErrors.length > 0) {
      return backendErrors.map((item) => item.msg).join(', ');
    }
    return error.response?.data?.message || fallbackMessage;
  };

  const normalizeAuthResponse = (data) => {
    // Support both `{ token, user }` and flattened user payloads from backend.
    const normalizedUser =
      data.user ||
      (data._id
        ? {
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
            avatar: data.avatar,
          }
        : null);

    return {
      token: data.token,
      user: normalizedUser,
    };
  };

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      const authData = normalizeAuthResponse(data);
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
      setUser(authData.user);
      toast.success('Welcome back!');
      return authData;
    } catch (error) {
      const msg = extractErrorMessage(error, 'Login failed');
      toast.error(msg);
      throw error;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      const authData = normalizeAuthResponse(data);
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
      setUser(authData.user);
      toast.success('Account created successfully!');
      return authData;
    } catch (error) {
      const msg = extractErrorMessage(error, 'Registration failed');
      toast.error(msg);
      throw error;
    }
  }, []);

  const googleLogin = useCallback(async (credential) => {
    try {
      const { data } = await API.post('/auth/google', { credential });
      const authData = normalizeAuthResponse(data);
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
      setUser(authData.user);
      toast.success('Welcome!');
      return authData;
    } catch (error) {
      const msg = error.response?.data?.message || 'Google login failed';
      toast.error(msg);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      const { data } = await API.put('/auth/me', updates);
      const updatedUser = data.user || data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Profile updated!');
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Update failed';
      toast.error(msg);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        googleLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
