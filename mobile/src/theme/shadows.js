// theme/shadows.js
// Cross-platform soft shadow presets (iOS uses shadow*, Android uses elevation).

export const shadows = {
  sm: {
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  lg: {
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  card: {
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
};

export default shadows;
