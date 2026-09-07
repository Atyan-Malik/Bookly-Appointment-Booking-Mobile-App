import { create } from 'zustand';
import notificationService from '../services/notificationService';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const { notifications, unreadCount } = await notificationService.list();
      set({ notifications, unreadCount, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  markRead: async (id) => {
    await notificationService.markRead(id);
    set({
      notifications: get().notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      unreadCount: Math.max(0, get().unreadCount - 1),
    });
  },
}));

export default useNotificationStore;