import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_URL, withCredentials: true });

export const generateImage = (data) => api.post('/studio/image/generate', data).then(r => r.data);
export const generateVideo = (data) => api.post('/studio/video/generate', data).then(r => r.data);
export const buildWebsite = (data) => api.post('/studio/website/build', data).then(r => r.data);
export const getHistory = (type) => api.get(`/studio/${type}/history`).then(r => r.data);
