import api from './api';

const activityService = {
  getActivities: async () => {
    try {
      const response = await api.get('/activity');
      return response.data;
    } catch (error) {
      console.warn("[API MOCK] Fallback activities");
      return [
        { id: '1', log: "LinkedIn post for 'Summer Launch 2026' campaign was successfully published.", time: "10 minutes ago", type: 'success' },
        { id: '2', log: "Campaign budget limit reached warning: 'Summer Product Launch' is at 95% threshold.", time: "1 hour ago", type: 'warning' },
        { id: '3', log: "Scheduled Instagram post for tomorrow was updated by Jane Doe.", time: "4 hours ago", type: 'info' },
        { id: '4', log: "New Twitter Account linked to workspace.", time: "1 day ago", type: 'info' }
      ];
    }
  }
};

export default activityService;
