// store/authStore.js
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isLoading: true, // true until we've checked SecureStore on boot
  isAuthenticated: false,

  // Called once from App.jsx on startup to restore a persisted session.
  hydrate: async () => {
    try {
      const [token, userJson] = await Promise.all([
        SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
        SecureStore.getItemAsync(STORAGE_KEYS.USER),
      ]);

      if (token && userJson) {
        set({
          accessToken: token,
          user: JSON.parse(userJson),
          isAuthenticated: true,
        });
      }
    } catch (e) {
      // Corrupted store — fail safe into logged-out state.
      console.warn('Auth hydrate failed', e);
    } finally {
      set({ isLoading: false });
    }
  },

  // Called after a successful login/register API response.
  setSession: async ({ user, accessToken, refreshToken }) => {
    await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user));

    set({ user, accessToken, isAuthenticated: true });
  },

  updateUser: async (partialUser) => {
    const updated = { ...get().user, ...partialUser };
    await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(updated));
    set({ user: updated });
  },

  logout: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.USER),
    ]);
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
