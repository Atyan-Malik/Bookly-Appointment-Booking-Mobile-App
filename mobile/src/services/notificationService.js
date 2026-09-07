import apiClient from './apiClient';

export const notificationService = {
  list: () => apiClient.get('/notifications').then((r) => r.data.data),
  markRead: (id) => apiClient.patch(`/notifications/${id}/read`).then((r) => r.data),
};

export default notificationService;
