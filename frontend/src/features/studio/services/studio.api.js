import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

export const generateImage = (data) => api.post('/images/generate', data).then(r => r.data);
export const getImages = () => api.get('/images').then(r => r.data);
export const deleteImage = (id) => api.delete(`/images/${id}`).then(r => r.data);

export const generateVideo = (data) => api.post('/videos/generate', data).then(r => r.data);
export const getVideoStatus = (id) => api.get(`/videos/${id}/status`).then(r => r.data);
export const getVideos = () => api.get('/videos').then(r => r.data);
export const deleteVideo = (id) => api.delete(`/videos/${id}`).then(r => r.data);

export const generateWebsite = (data) => api.post('/websites/generate', data).then(r => r.data);
export const getWebsitePreview = (id) => api.get(`/websites/${id}/preview`).then(r => r.data);
export const getWebsites = () => api.get('/websites').then(r => r.data);
export const deleteWebsite = (id) => api.delete(`/websites/${id}`).then(r => r.data);
