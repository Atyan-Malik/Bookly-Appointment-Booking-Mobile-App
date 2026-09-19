import apiClient from './apiClient';

export const professionalService = {
  // ==========================================
  // CUSTOMER
  // ==========================================

  list: (params) =>
    apiClient
      .get('/professionals', { params })
      .then((r) => r.data.data),

  getById: (id) =>
    apiClient
      .get(`/professionals/${id}`)
      .then((r) => r.data.data),

  getServices: (id) =>
    apiClient
      .get(`/professionals/${id}/services`)
      .then((r) => r.data.data),

  getAvailability: (id, date, duration) =>
    apiClient
      .get(`/professionals/${id}/availability`, {
        params: { date, duration },
      })
      .then((r) => r.data.data),

  getReviews: (id) =>
    apiClient
      .get(`/reviews/professional/${id}`)
      .then((r) => r.data.data),

 
};

export default professionalService;