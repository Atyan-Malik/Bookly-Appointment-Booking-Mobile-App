import apiClient from './apiClient';

const categoryService = {
  list: async () => {
    const response = await apiClient.get(
      '/services/categories'
    );

    return response.data.data;
  },
};

export default categoryService;
