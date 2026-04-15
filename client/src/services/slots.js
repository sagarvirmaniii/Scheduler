import api from './api';

export const getSlots = (eventTypeId, date) =>
  api.get(`/slots?eventTypeId=${eventTypeId}&date=${date}`);
