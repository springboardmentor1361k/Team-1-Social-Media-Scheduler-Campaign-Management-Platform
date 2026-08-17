import api from './api';

const analyticsService = {
  getAnalytics: async () => {
    try {
      const response = await api.get('/analytics');
      console.log("Analytics API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch analytics from API:", error);
      throw error;
    }
  }
};

export default analyticsService;
