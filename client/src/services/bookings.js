import api from './api';

export const getBookings = (filter = 'upcoming') => api.get(`/bookings?filter=${filter}`);
export const createBooking = (data) => api.post('/bookings', data);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`);
