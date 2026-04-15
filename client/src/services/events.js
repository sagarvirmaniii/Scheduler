import api from './api';

export const getEvents = () => api.get('/events');
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const getPublicEvent = (slug) => api.get(`/events/public/${slug}`);
export const getPublicUserEvents = (username) => api.get(`/events/public/user/${username}`);
