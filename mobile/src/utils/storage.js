// utils/storage.js
// Thin wrapper around Expo SecureStore for the handful of places outside
// authStore that need to read/write a persisted value directly (e.g. a
// "don't show onboarding again" flag). Auth tokens and user data always go
// through store/authStore.js instead — never duplicate that logic here.
import * as SecureStore from 'expo-secure-store';

export async function getItem(key) {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

export async function setItem(key, value) {
  try {
    await SecureStore.setItemAsync(key, value);
    return true;
  } catch {
    return false;
  }
}

export async function removeItem(key) {
  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch {
    return false;
  }
}
