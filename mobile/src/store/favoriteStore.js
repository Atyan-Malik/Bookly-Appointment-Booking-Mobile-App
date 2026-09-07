import { create } from 'zustand';
import favoriteService from '../services/favoriteService';

export const useFavoritesStore = create((set, get) => ({
  favorites: [],
  isLoading: false,

  fetchFavorites: async () => {
    set({ isLoading: true });
    try {
      const favorites = await favoriteService.list();
      set({ favorites, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  isFavorite: (professionalId) =>
    get().favorites.some((f) => f.professional?._id === professionalId),

  toggleFavorite: async (professionalId) => {
    const existing = get().favorites.find((f) => f.professional?._id === professionalId);
    if (existing) {
      await favoriteService.remove(professionalId);
      set({ favorites: get().favorites.filter((f) => f.professional?._id !== professionalId) });
    } else {
      const favorite = await favoriteService.add(professionalId);
      set({ favorites: [...get().favorites, favorite] });
    }
  },
}));

export default useFavoritesStore;