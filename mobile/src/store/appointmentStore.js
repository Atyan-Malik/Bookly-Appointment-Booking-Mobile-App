import { create } from 'zustand';
import appointmentService from '../services/appointmentService';

export const useAppointmentStore = create((set, get) => ({
  appointments: [],
  isLoading: false,
  error: null,

  fetchAppointments: async (status) => {
    set({ isLoading: true, error: null });
    try {
      const result = await appointmentService.list(status ? { status } : {});
      set({ appointments: result.items, isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: e.message || 'Failed to load appointments' });
    }
  },

  createAppointment: async (payload) => {
    const appointment = await appointmentService.create(payload);
    set({ appointments: [appointment, ...get().appointments] });
    return appointment;
  },

  cancelAppointment: async (id) => {
    const updated = await appointmentService.cancel(id);
    set({
      appointments: get().appointments.map((a) => (a._id === id ? updated : a)),
    });
    return updated;
  },
}));

export default useAppointmentStore;