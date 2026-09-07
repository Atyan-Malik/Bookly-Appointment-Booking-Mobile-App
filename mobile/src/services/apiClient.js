// services/apiClient.js

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL, STORAGE_KEYS } from '../constants/index';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(
      STORAGE_KEYS.ACCESS_TOKEN
    );

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📤 API REQUEST');
    console.log('➡️ Method:', config.method?.toUpperCase());
    console.log('➡️ Base URL:', API_URL);
    console.log('➡️ URL:', config.url);
    console.log('➡️ Full URL:', `${config.baseURL}${config.url}`);
    console.log('➡️ Params:', config.params);
    console.log('➡️ Data:', config.data);
    console.log('➡️ Has Access Token:', !!token);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('❌ REQUEST INTERCEPTOR ERROR');
    console.log(error);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return Promise.reject(error);
  }
);

// ============================================================
// TOKEN REFRESH
// ============================================================

let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  console.log('🔄 Processing pending request queue');
  console.log('📦 Queue size:', pendingQueue.length);
  console.log('❌ Queue error:', error);
  console.log('🔑 New token available:', !!token);

  pendingQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });

  pendingQueue = [];
};

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

apiClient.interceptors.response.use(
  (response) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 API RESPONSE SUCCESS');
    console.log('⬅️ Status:', response.status);
    console.log('⬅️ URL:', response.config?.url);
    console.log('⬅️ Full URL:', `${response.config?.baseURL}${response.config?.url}`);
    console.log('⬅️ Response Data:', response.data);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return response;
  },

  async (error) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('❌ API RESPONSE ERROR');
    console.log('❌ Message:', error.message);
    console.log('❌ Code:', error.code);
    console.log('❌ Status:', error.response?.status);
    console.log('❌ URL:', error.config?.url);
    console.log(
      '❌ Full URL:',
      error.config
        ? `${error.config.baseURL}${error.config.url}`
        : 'Unknown'
    );
    console.log('❌ Response Data:', error.response?.data);
    console.log('❌ Request Data:', error.config?.data);
    console.log('❌ Error Object:', error);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const originalRequest = error.config;
    const status = error.response?.status;

    // ========================================================
    // NETWORK ERROR
    // ========================================================

    if (!error.response) {
      console.log('🚨 NO RESPONSE FROM SERVER');
      console.log('🚨 This means Axios did not receive an HTTP response.');
      console.log('🚨 Possible timeout, connection failure, or server issue.');
      console.log('🚨 API_URL:', API_URL);

      return Promise.reject({
        success: false,
        message: 'Network error. Please check your connection and try again.',
        isNetworkError: true,
      });
    }

    // ========================================================
    // 401 TOKEN REFRESH
    // ========================================================

    if (status === 401 && !originalRequest._retry) {
      console.log('🔐 401 UNAUTHORIZED');
      console.log('🔄 Attempting token refresh...');

      if (isRefreshing) {
        console.log('⏳ Refresh already in progress. Queueing request.');

        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((token) => {
            console.log('🔑 Retrying queued request with new token');

            originalRequest.headers.Authorization = `Bearer ${token}`;

            return apiClient(originalRequest);
          })
          .catch((err) => {
            console.log('❌ Queued request failed:', err);
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync(
          STORAGE_KEYS.REFRESH_TOKEN
        );

        console.log('🔑 Refresh token exists:', !!refreshToken);

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        console.log('🔄 Sending refresh request...');

        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {
            refreshToken,
          }
        );

        console.log('✅ Refresh response:', data);

        const newAccessToken = data?.data?.accessToken;

        console.log(
          '🔑 New access token received:',
          !!newAccessToken
        );

        if (!newAccessToken) {
          throw new Error('Refresh response did not contain accessToken');
        }

        await SecureStore.setItemAsync(
          STORAGE_KEYS.ACCESS_TOKEN,
          newAccessToken
        );

        console.log('💾 New access token saved');

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        console.log('🔁 Retrying original request');

        return apiClient(originalRequest);

      } catch (refreshError) {
        console.log('❌ TOKEN REFRESH FAILED');
        console.log('❌ Refresh error:', refreshError);

        processQueue(refreshError, null);

        await SecureStore.deleteItemAsync(
          STORAGE_KEYS.ACCESS_TOKEN
        );

        await SecureStore.deleteItemAsync(
          STORAGE_KEYS.REFRESH_TOKEN
        );

        console.log('🗑️ Tokens deleted');

        return Promise.reject({
          success: false,
          message: 'Session expired. Please log in again.',
          isAuthError: true,
        });

      } finally {
        isRefreshing = false;
        console.log('🔓 Refresh lock released');
      }
    }

    // ========================================================
    // NORMAL SERVER ERROR
    // ========================================================

    console.log('⚠️ Returning server error to caller');

    return Promise.reject(
      error.response?.data || {
        success: false,
        message: 'Something went wrong. Please try again.',
      }
    );
  }
);

export default apiClient;