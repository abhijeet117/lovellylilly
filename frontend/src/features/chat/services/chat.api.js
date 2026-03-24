import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

export const getConversations = () => api.get('/chats').then(r => r.data);
export const deleteConversation = (id) => api.delete(`/chats/${id}`).then(r => r.data);
export const renameConversation = (id, title) => api.patch(`/chats/${id}/rename`, { title }).then(r => r.data);
export const toggleSaveConversation = (id) => api.patch(`/chats/${id}/save`).then(r => r.data);
export const getMessages = (chatId) => api.get(`/messages/${chatId}`).then(r => r.data);
