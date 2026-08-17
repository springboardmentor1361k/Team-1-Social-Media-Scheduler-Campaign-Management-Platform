import api from './api';

const socialAccountService = {
  getAccounts: async () => {
    try {
      const response = await api.get('/social-accounts');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch social accounts:", error);
      throw error;
    }
  },

  connectAccount: async (accountData) => {
    try {
      const response = await api.post('/social-accounts', accountData);
      return response.data;
    } catch (error) {
      console.error("Failed to connect social account:", error);
      throw error;
    }
  },

  disconnectAccount: async (id) => {
    try {
      const response = await api.delete(`/social-accounts/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to disconnect social account:", error);
      throw error;
    }
  }
};

export default socialAccountService;
