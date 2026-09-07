import apiClient from './apiClient';

export const appointmentService = {
  create: (payload) => apiClient.post('/appointments', payload).then((r) => r.data.data),
  list: (params) => apiClient.get('/appointments', { params }).then((r) => r.data.data),
  getById: (id) => apiClient.get(`/appointments/${id}`).then((r) => r.data.data),
  updateStatus: (id, status) =>
    apiClient.patch(`/appointments/${id}`, { status }).then((r) => r.data.data),
  cancel: (id) => apiClient.patch(`/appointments/${id}`, { status: 'CANCELLED' }).then((r) => r.data.data),
};

export default appointmentService;
