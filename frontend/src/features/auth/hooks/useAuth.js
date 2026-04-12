import { useCallback, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import * as authService from '../services/auth.api';
import { signInWithGoogle, signInWithGithub, firebaseSignOutUser } from '../../../lib/firebase';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  const { setUser, setLoading, setError, ...state } = context;

  const handleLogin = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await authService.login(email, password);
      if (response.user) setUser(response.user);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  }, [setUser, setError]);

  const handleSignup = useCallback(async (userData) => {
    setError(null);
    try {
      const response = await authService.register(userData);
      if (response.user) setUser(response.user);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Signup failed';
      setError(message);
      throw new Error(message);
    }
  }, [setUser, setError]);

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
      // Also sign out of Firebase so the next popup doesn't auto-skip
      await firebaseSignOutUser().catch(() => {});
    } finally {
      setUser(null);
    }
  }, [setUser]);

  // ── Firebase OAuth helpers ───────────────────────────────────────────────

  const handleOAuth = useCallback(async (providerFn, providerName) => {
    setError(null);
    try {
      const idToken = await providerFn();              // opens popup
      const response = await authService.firebaseLogin(idToken); // exchange for session
      if (response.user) setUser(response.user);
      return response;
    } catch (err) {
      // Firebase popup-cancelled errors have code 'auth/popup-closed-by-user'
      if (err?.code === 'auth/popup-closed-by-user') return null;
      const message = err.response?.data?.message || err.message || `${providerName} sign-in failed`;
      setError(message);
      throw new Error(message);
    }
  }, [setUser, setError]);

  const googleSignIn  = useCallback(() => handleOAuth(signInWithGoogle,  'Google'),  [handleOAuth]);
  const githubSignIn  = useCallback(() => handleOAuth(signInWithGithub,  'GitHub'),  [handleOAuth]);

  return {
    ...state,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    googleSignIn,
    githubSignIn,
  };
}
