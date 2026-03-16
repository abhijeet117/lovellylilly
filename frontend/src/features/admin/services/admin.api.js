import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_URL, withCredentials: true });

export const getUsers = () => api.get('/admin/users').then(r => r.data);
export const getStats = () => api.get('/admin/stats').then(r => r.data);
export const banUser = (id) => api.post(`/admin/users/${id}/ban`).then(r => r.data);
export const unbanUser = (id) => api.post(`/admin/users/${id}/unban`).then(r => r.data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then(r => r.data);
