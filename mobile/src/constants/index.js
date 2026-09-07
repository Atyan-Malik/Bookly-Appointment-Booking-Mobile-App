// constants/index.js

export const APP_NAME = 'Bookly'; // placeholder brand name — swap freely

export const USER_ROLES = {
  CUSTOMER: 'customer',
  PROVIDER: 'provider',
  ADMIN: 'admin',
};

export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
};

export const CATEGORIES = [
  { id: 'doctor', label: 'Doctor', icon: 'Stethoscope' },
  { id: 'dentist', label: 'Dentist', icon: 'Smile' },
  { id: 'salon', label: 'Salon', icon: 'Scissors' },
  { id: 'fitness', label: 'Fitness', icon: 'Dumbbell' },
  { id: 'consultant', label: 'Consultant', icon: 'Briefcase' },
  { id: 'tutor', label: 'Tutor', icon: 'BookOpen' },
  { id: 'therapist', label: 'Therapist', icon: 'HeartHandshake' },
  { id: 'beauty', label: 'Beauty', icon: 'Sparkles' },
];

export const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'rating', label: 'Rating' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'nearest', label: 'Nearest' },
  { id: 'popular', label: 'Most Popular' },
];

export const NOTIFICATION_TYPES = {
  APPOINTMENT_CONFIRMED: 'APPOINTMENT_CONFIRMED',
  APPOINTMENT_REMINDER: 'APPOINTMENT_REMINDER',
  APPOINTMENT_CANCELLED: 'APPOINTMENT_CANCELLED',
  APPOINTMENT_RESCHEDULED: 'APPOINTMENT_RESCHEDULED',
  NEW_MESSAGE: 'NEW_MESSAGE',
  PROMOTIONAL: 'PROMOTIONAL',
};

// Secure-store keys — centralized so we never typo a key across the app
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'bookly_access_token',
  REFRESH_TOKEN: 'bookly_refresh_token',
  USER: 'bookly_user',
};

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.52:5000/api';
