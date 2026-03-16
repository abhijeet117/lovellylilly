import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_URL, withCredentials: true });

export const getDocuments = () => api.get('/documents').then(r => r.data);
export const uploadDocument = (formData) => api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const deleteDocument = (id) => api.delete(`/documents/${id}`).then(r => r.data);
export const chatWithDocument = (id, message) => api.post(`/documents/${id}/chat`, { message }).then(r => r.data);
