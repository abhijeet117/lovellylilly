import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

export const getProfile = () => api.get('/user/profile').then(r => r.data);
export const updateProfile = (data) => api.patch('/user/profile', data).then(r => r.data);
export const changePassword = (data) => api.patch('/user/password', data).then(r => r.data);
export const deleteAccount = () => api.delete('/user/account').then(r => r.data);
export const uploadAvatar = (file) => {
  const form = new FormData();
  form.append('avatar', file);
  return api.post('/user/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};

// API key management
export const getApiKeys = () => api.get('/user/api-keys').then(r => r.data);
export const createApiKey = (name) => api.post('/user/api-keys', { name }).then(r => r.data);
export const deleteApiKey = (keyId) => api.delete(`/user/api-keys/${keyId}`).then(r => r.data);
