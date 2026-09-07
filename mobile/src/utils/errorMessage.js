// utils/errorMessage.js
// Every apiClient rejection is already normalized to { message, ... } by the
// response interceptor (see services/apiClient.js), but this helper gives
// screens one safe place to unwrap any error shape without crashing on
// `undefined.message`.
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (Array.isArray(error.errors) && error.errors.length > 0) return error.errors[0];
  return fallback;
}
