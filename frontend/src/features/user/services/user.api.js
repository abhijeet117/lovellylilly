import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

export const getProfile = () => api.get('/user/profile').then(r => r.data);
export const updateProfile = (data) => api.patch('/user/profile', data).then(r => r.data);
export const changePassword = (data) => api.patch('/user/password', data).then(r => r.data);
export const deleteAccount = () => api.delete('/user/account').then(r => r.data);
