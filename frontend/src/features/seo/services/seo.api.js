import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

export const analyzeSeo = (url) => api.post('/seo/analyze', { url }).then(r => r.data);
export const getSeoHistory = (page = 1, limit = 10) =>
  api.get('/seo/history', { params: { page, limit } }).then(r => r.data);
