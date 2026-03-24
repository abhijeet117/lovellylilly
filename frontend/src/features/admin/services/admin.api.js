import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

export const getUsers = () => api.get('/admin/users').then(r => r.data);
export const getStats = () => api.get('/admin/stats').then(r => r.data);
export const banUser = (id) => api.post(`/admin/users/${id}/ban`).then(r => r.data);
export const unbanUser = (id) => api.post(`/admin/users/${id}/unban`).then(r => r.data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then(r => r.data);
