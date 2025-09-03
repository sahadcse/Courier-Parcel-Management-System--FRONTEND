// lib/axios.ts

import { AxiosError } from 'axios';
import api from './api'; 
import { store } from './store';

// State for managing a single token refresh process
let isRefreshing = false;
let failedRequestsQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void; }[] = [];

// This is the response interceptor that handles auth logic
api.interceptors.response.use(
  (response) => response, // Directly return successful responses
  async (error: AxiosError) => {
    // console.log("Interceptor caught an error:", error.response?.status);

    const originalRequest = error.config;

    // 1. Check if the error is a 401 and the request has a config
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error); // Reject all other errors
    }

    // console.log("Error is 401. Attempting to refresh token...");

    // 2. Prevent infinite loops for the refresh endpoint itself
    if (originalRequest.url === '/auth/refresh' || originalRequest._retry) {
      return Promise.reject(error);
    }

    // console.log("No active refresh token request. Proceeding with token refresh...");

    // 3. Handle concurrent requests
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({ resolve, reject });
      });
    }

    // console.log("Setting up a new refresh token request...");

    originalRequest._retry = true;
    isRefreshing = true;

    // 4. The core refresh logic
    try {
      // Make the request to get a new token
      await api.post('/auth/refresh');

      console.log("Token refreshed successfully.");

      // Retry the original failed request with the new token
      const response = await api(originalRequest);

      // console.log("Retried original request successfully.");

      // Process all other failed requests that were queued
      failedRequestsQueue.forEach(promise => promise.resolve(api(originalRequest)));
      failedRequestsQueue = [];

      // console.log("All queued requests have been retried.");
      // console.log("Final response:", response);
      return response;
    } catch (refreshError) {
      // If the refresh token is also invalid, log the user out
      store.dispatch({ type: 'auth/logout/fulfilled' });
      
      failedRequestsQueue.forEach(promise => promise.reject(refreshError));
      failedRequestsQueue = [];
      
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);