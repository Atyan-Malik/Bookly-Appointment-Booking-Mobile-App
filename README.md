# Bookly — Appointment Booking Platform

Full-stack appointment booking app: **React Native (Expo)** mobile client + **Node/Express/MongoDB** backend.

This is **Module 1 — Project Setup**. Nothing here is fake/mocked UI — the screens are real navigable placeholders wired to real navigation and a real (currently route-empty) API, ready to be filled in module by module.

---

## What's in this module

```
appointment-app/
├── mobile/                     Expo React Native app
│   ├── App.jsx                 Root entry — hydrates auth, mounts navigation
│   ├── app.json                Expo config (permissions, plugins, icons)
│   ├── babel.config.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── theme/               colors.js, spacing.js, typography.js, shadows.js, index.js
│       ├── constants/            roles, categories, appointment status, storage keys, API_URL
│       ├── services/apiClient.js axios instance + JWT + refresh-ready interceptors
│       ├── store/                Zustand: authStore (full), appointmentStore/favoritesStore/notificationStore (stubs)
│       ├── navigation/           RootNavigator, AuthNavigator, CustomerTabNavigator, ProviderTabNavigator
│       ├── screens/auth/SplashScreen.jsx   real branded splash
│       └── components/ui/PlaceholderScreen.jsx   stand-in for not-yet-built screens
│
└── backend/                    Node/Express API
    ├── src/
    │   ├── server.js            entry point (connects DB, starts listener, graceful shutdown)
    │   ├── app.js                Express app: helmet, cors, rate limiting, sanitize, routes, error handler
    │   ├── config/                env.js (typed env loader), database.js (Mongoose connection)
    │   ├── middlewares/           errorHandler.js, rateLimiter.js, auth.js (stub), validate.js (Zod)
    │   ├── utils/                 apiResponse.js, AppError.js, catchAsync.js
    │   └── routes/index.js        aggregator — feature routers added module by module
    ├── uploads/                  local file storage for dev (Cloudinary-ready in code)
    ├── package.json
    ├── .env.example
    └── nodemon.json
```

## Why it's structured this way

- **Controllers → Services → Models** pattern is set up via `catchAsync` + `AppError` + `apiResponse` helpers, so every controller written from Module 2 onward follows the same shape: no repeated try/catch, no inconsistent response format.
- **Every error path already returns the standard shape** (`{ success, message, data }` / `{ success, message, errors }`), including duplicate-key errors translated into human messages (e.g. a double-booked slot → *"That appointment slot was just booked. Please choose another time."* instead of a raw Mongo error).
- **The mobile navigation shell is fully wired** — Auth stack, Customer tabs, Provider tabs, and a role-aware `RootNavigator` — using `PlaceholderScreen` so you can already run the app and tap through the whole shape of the product before a single "real" screen exists.
- **Zustand `authStore` is fully implemented** (hydrate on boot, persist to SecureStore, logout) because every other module depends on knowing who's logged in. The other stores are stubs with the same shape, filled in when their module lands.
- **The API client already speaks refresh-token** even though `/api/auth/refresh` doesn't exist yet — so Module 2 only has to add the route, not touch this file.

---

## Running it

### Backend

```bash
cd backend
cp .env.example .env        # then fill in MONGODB_URI at minimum
npm install
npm run dev                 # nodemon, watches src/
```

Visit `http://localhost:5000/health` → should return `{ success: true, message: "Bookly API is running", ... }`.
Visit `http://localhost:5000/api` → confirms the API is mounted.

You need a MongoDB instance — either local (`mongod`) or a free Atlas cluster. Nothing else is required to boot the server; there are no routes yet, so there's nothing to fail on missing models.

### Mobile

```bash
cd mobile
cp .env.example .env        # EXPO_PUBLIC_API_URL — point at your backend
npm install
npx expo start
```

Scan the QR code with Expo Go (or run `npm run android` / `npm run ios` with a simulator).

You should see:
1. The branded pink→purple splash screen briefly (auth hydration).
2. Land on the Auth stack → "Onboarding" placeholder screen (real onboarding slides come in Module 2).
3. Bottom tab navigators for both Customer and Provider roles exist and are reachable once `authStore.setSession()` is called with a `user.role` — which happens for real once login is built.

### Common errors & fixes

| Problem | Fix |
|---|---|
| `Missing required environment variable: MONGODB_URI` | Copy `.env.example` to `.env` in `backend/` and set a real connection string. |
| Metro bundler can't resolve `expo-secure-store` etc. | Run `npm install` inside `mobile/`, then restart with `npx expo start -c` to clear cache. |
| `react-native-reanimated` crashes on app open | Confirm `'react-native-reanimated/plugin'` is the **last** entry in `babel.config.js` plugins array, then `npx expo start -c`. |
| iOS/Android build fails on maps | `react-native-maps` needs a Google Maps API key for Android — added when Module 4 (professional profile map) is built; not needed to run Module 1. |
| CORS error calling API from Expo Go | Set `CLIENT_URL` in backend `.env` to `*` during development, or to your Expo dev server origin. |

---

## Next: Module 2 — Authentication

Will replace the Auth stack placeholders with real screens (Onboarding, Login, Register, Forgot/Reset Password, OTP) and build out `backend/src/models/User.js`, `authController`, `authService`, `authRoutes`, and JWT issuing/verification wired into `middlewares/auth.js`.
