import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_URL, withCredentials: true });

export const getProfile = () => api.get('/user/profile').then(r => r.data);
export const updateProfile = (data) => api.patch('/user/profile', data).then(r => r.data);
export const changePassword = (data) => api.post('/user/change-password', data).then(r => r.data);
export const deleteAccount = () => api.delete('/user/account').then(r => r.data);
