import api from './api';

const searchService = {
  search: async (query) => {
    try {
      const response = await api.get('/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error("Global search failed:", error);
      throw error;
    }
  }
};

export default searchService;
