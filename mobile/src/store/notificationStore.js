import { create } from 'zustand';

import notificationService from '../services/notificationService';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const result =
        await notificationService.list();

      console.log(
        '🔔 Notification store result:',
        result
      );

      set({
        notifications: result?.notifications || [],
        unreadCount: result?.unreadCount || 0,
        loading: false,
      });
    } catch (error) {
      console.error(
        '❌ Fetch notifications error:',
        error
      );

      set({
        notifications: [],
        unreadCount: 0,
        loading: false,
        error:
          error?.message ||
          'Failed to load notifications',
      });
    }
  },

  markAsRead: async (id) => {
    try {
      await notificationService.markRead(id);

      set((state) => {
        const notifications =
          state.notifications.map(
            (notification) =>
              notification._id === id
                ? {
                    ...notification,
                    isRead: true,
                  }
                : notification
          );

        return {
          notifications,
          unreadCount: notifications.filter(
            (notification) => !notification.isRead
          ).length,
        };
      });
    } catch (error) {
      console.error(
        '❌ Mark notification read error:',
        error
      );
    }
  },

  getUnreadCount: () => {
    return get().unreadCount;
  },
}));

export default useNotificationStore;