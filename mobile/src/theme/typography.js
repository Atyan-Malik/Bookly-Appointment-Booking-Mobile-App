// theme/typography.js
import { colors } from './colors';

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    color: colors.textPrimary,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
    color: colors.textPrimary,
  },
  h4: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    color: colors.textPrimary,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textPrimary,
  },
  bodySecondary: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.textMuted,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: colors.textSecondary,
  },
};

export default typography;
