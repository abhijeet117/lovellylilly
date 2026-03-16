import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL, withCredentials: true });

export const getConversations = () => api.get('/chat/conversations').then(r => r.data);
export const getConversation = (id) => api.get(`/chat/conversations/${id}`).then(r => r.data);
export const createConversation = (title) => api.post('/chat/conversations', { title }).then(r => r.data);
export const deleteConversation = (id) => api.delete(`/chat/conversations/${id}`).then(r => r.data);
export const renameConversation = (id, title) => api.patch(`/chat/conversations/${id}`, { title }).then(r => r.data);
export const sendMessage = (conversationId, content) => api.post(`/chat/conversations/${conversationId}/messages`, { content }).then(r => r.data);
