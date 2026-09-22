import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth-store';

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3333/api/v1';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const url = originalRequest?.url ?? '';
    const isAuthEntrypoint = url.includes('/auth/login') || url.includes('/auth/refresh');

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isAuthEntrypoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push(() => resolve(apiClient(originalRequest)));
      });
    }

    isRefreshing = true;
    try {
      const { data } = await apiClient.post('/auth/refresh');
      useAuthStore.getState().setSession(data.accessToken, data.user);
      pendingRequests.forEach((run) => run());
      pendingRequests = [];
      return apiClient(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().clearSession();
      pendingRequests = [];
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
