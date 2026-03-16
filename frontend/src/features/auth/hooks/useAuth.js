import { useCallback, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import * as authService from '../services/auth.api';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { setUser, setLoading, setError, ...state } = context;

  const handleLogin = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      // Assuming response structure is { success: true, user: { ... } }
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError]);

  const handleSignup = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Signup failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError]);

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, [setUser]);

  return {
    ...state,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout
  };
}
