import apiClient from './apiClient';

export const favoriteService = {
  list: () => apiClient.get('/favorites').then((r) => r.data.data),
  add: (professionalId) => apiClient.post('/favorites', { professionalId }).then((r) => r.data.data),
  remove: (professionalId) => apiClient.delete(`/favorites/${professionalId}`).then((r) => r.data),
};

export default favoriteService;
