import api from './api';

const userService = {
  // Get logged-in user's profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    }
  },

  // Update logged-in user's profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put(`/users/${userData.id}`, userData);
      return response.data;
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  },

  // Update user's password
  updatePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/users/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error("Failed to update password:", error);
      throw error;
    }
  }
};

export default userService;