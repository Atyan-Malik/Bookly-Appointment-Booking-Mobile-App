import apiClient from './apiClient';

export const authService = {
  register: (payload) => apiClient.post('/auth/register', payload).then((r) => r.data.data),
  login: (payload) => apiClient.post('/auth/login', payload).then((r) => r.data.data),
  logout: () => apiClient.post('/auth/logout'),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }).then((r) => r.data),
  getMe: () => apiClient.get('/users/me').then((r) => r.data.data),
  updateMe: (payload) => apiClient.put('/users/me', payload).then((r) => r.data.data),
};

export default authService;