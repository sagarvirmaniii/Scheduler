import api from './api';

export const getAvailability = () => api.get('/availability');
export const saveAvailability = (data) => api.put('/availability', data);
export const getPublicAvailability = (slug) => api.get(`/availability/public/${slug}`);
