import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

export const getDocuments = () => api.get('/documents').then(r => r.data);
export const uploadDocument = (formData) => api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const deleteDocument = (id) => api.delete(`/documents/${id}`).then(r => r.data);
export const chatWithDocument = (id, message) => api.post(`/documents/${id}/chat`, { message }).then(r => r.data);
