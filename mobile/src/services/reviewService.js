import apiClient from './apiClient';

export const reviewService = {
  create: (payload) => apiClient.post('/reviews', payload).then((r) => r.data.data),
};

export default reviewService;