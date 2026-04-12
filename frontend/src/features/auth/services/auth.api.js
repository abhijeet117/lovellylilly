import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

const getUserFromPayload = (payload) => payload?.user ?? payload?.data?.user ?? null;
const normalizeAuthPayload = (payload = {}) => ({
  ...payload,
  user: getUserFromPayload(payload),
});

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return normalizeAuthPayload(data);
};

export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  const normalized = normalizeAuthPayload(data);
  return {
    ...normalized,
    requiresVerification: normalized.requiresVerification ?? !normalized.user
  };
};

export const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/get-me');
  return normalizeAuthPayload(data);
};

export const verifyEmail = async (token) => {
  const { data } = await api.get(`/auth/verify-email/${token}`);
  return data;
};

export const resendVerification = async (email) => {
  const { data } = await api.post('/auth/resend-verification', { email });
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await api.post(`/auth/reset-password/${token}`, { password });
  return data;
};

/**
 * Exchange a Firebase ID token (from Google/GitHub sign-in) for our
 * own session cookie. The backend verifies the token via Firebase Admin SDK,
 * then finds-or-creates the user in MongoDB.
 */
export const firebaseLogin = async (idToken) => {
  const { data } = await api.post('/auth/firebase', { idToken });
  return normalizeAuthPayload(data);
};

export default api;
