import api from './api';

const DEFAULT_NOTIFICATIONS = [
  {
    id: "ntf_1",
    title: "Post Published Successfully",
    message: "Your post on LinkedIn '🚀 Exciting news! Antigravity AI...' has been published successfully.",
    timestamp: "10 mins ago",
    type: "success",
    read: false
  },
  {
    id: "ntf_2",
    title: "Failed to Publish Post",
    message: "Your post on Instagram 'Weekly design highlights...' failed to upload media. Click to retry.",
    timestamp: "2 hours ago",
    type: "error",
    read: false
  },
  {
    id: "ntf_3",
    title: "Campaign Reaching End Date",
    message: "Your summer promo campaign 'Q3 Holiday Sale Promo' is reaching its scheduled end date in 3 days.",
    timestamp: "1 day ago",
    type: "warning",
    read: true
  },
  {
    id: "ntf_4",
    title: "New Account Connected",
    message: "Facebook page 'SocialPilot Developer' has been successfully linked to your workspace.",
    timestamp: "3 days ago",
    type: "info",
    read: true
  }
];

const getLocalStorageNotifications = () => {
  const data = localStorage.getItem('socialpilot_notifications');
  if (!data) {
    localStorage.setItem('socialpilot_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
    return DEFAULT_NOTIFICATIONS;
  }
  return JSON.parse(data);
};

const saveLocalStorageNotifications = (notifications) => {
  localStorage.setItem('socialpilot_notifications', JSON.stringify(notifications));
};

const notificationService = {
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return getLocalStorageNotifications();
    } catch (error) {
      console.warn("[API MOCK] Using fallback localStorage notifications");
      return getLocalStorageNotifications();
    }
  },

  markAsRead: async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      return { success: true };
    } catch (error) {
      console.warn(`[API MOCK] Marking notification ${id} as read in localStorage`);
      const notifications = getLocalStorageNotifications();
      const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
      saveLocalStorageNotifications(updated);
      return { success: true };
    }
  },

  markAllAsRead: async () => {
    try {
      await api.put('/notifications/read-all');
      return { success: true };
    } catch (error) {
      console.warn("[API MOCK] Marking all notifications as read in localStorage");
      const notifications = getLocalStorageNotifications();
      const updated = notifications.map(n => ({ ...n, read: true }));
      saveLocalStorageNotifications(updated);
      return { success: true };
    }
  },

  deleteNotification: async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      return { success: true };
    } catch (error) {
      console.warn(`[API MOCK] Deleting notification ${id} from localStorage`);
      let notifications = getLocalStorageNotifications();
      notifications = notifications.filter(n => n.id !== id);
      saveLocalStorageNotifications(notifications);
      return { success: true };
    }
  },

  clearAll: async () => {
    try {
      await api.delete('/notifications');
      return { success: true };
    } catch (error) {
      console.warn("[API MOCK] Clearing notifications from localStorage");
      saveLocalStorageNotifications([]);
      return { success: true };
    }
  }
};

export default notificationService;
