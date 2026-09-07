import apiClient from './apiClient';

const providerService = {
  // =========================
  // CATEGORIES
  // =========================
  getCategories: async () => {
    const response = await apiClient.get("/services/categories");
    return response.data.data;
  },

  // =========================
  // SERVICES
  // =========================
  listMyServices: async () => {
    const response = await apiClient.get('/services/my');
    return response.data.data;
  },

  createService: async (serviceData) => {
    const response = await apiClient.post('/services', serviceData);
    return response.data.data;
  },

  deleteService: async (serviceId) => {
    const response = await apiClient.delete(`/services/${serviceId}`);
    return response.data.data;
  },

  // =========================
  // PROVIDER CALENDAR
  // =========================
  getMyAvailability: async () => {
    const response = await apiClient.get(
      '/professionals/me/availability'
    );

    return response.data.data;
  },

  updateAvailability: async (availabilityData) => {
    const response = await apiClient.put(
      '/professionals/me/availability',
      availabilityData
    );

    return response.data.data;
  },
};

export default providerService;