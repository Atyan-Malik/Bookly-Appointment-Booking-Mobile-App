// theme/colors.js
// Central color palette. Never hardcode hex values in screens/components — import from here.

export const colors = {
  // Brand
  primary: '#EC4899',
  primaryDark: '#DB2777',
  primaryLight: '#FBCFE8',
  secondary: '#8B5CF6',
  secondaryDark: '#7C3AED',
  secondaryLight: '#DDD6FE',

  // Surfaces
  background: '#FFF9FC',
  card: '#FFFFFF',
  border: '#F3E8EF',
  overlay: 'rgba(23, 23, 23, 0.5)',

  // Text
  textPrimary: '#171717',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Status
  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Appointment status colors
  status: {
    PENDING: '#F59E0B',
    CONFIRMED: '#22C55E',
    COMPLETED: '#8B5CF6',
    CANCELLED: '#EF4444',
    NO_SHOW: '#6B7280',
  },

  // Gradients (used with expo-linear-gradient)
  gradients: {
    hero: ['#EC4899', '#8B5CF6'],
    heroSoft: ['#FCE7F3', '#EDE9FE'],
    primaryButton: ['#EC4899', '#DB2777'],
  },

  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
};

export default colors;
