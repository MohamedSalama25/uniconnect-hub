import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { API_CONFIG } from './api.config';
import { useAuthStore } from '@/store/useAuthStore';

const clientAxios = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor: add auth token
clientAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If data is FormData, let browser set Content-Type with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor: handle errors and refresh token
clientAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const isAuthPath = originalRequest.url?.includes('/api/Accounts/login') || 
                      originalRequest.url?.includes('/api/Accounts/refreshToken') ||
                      originalRequest.url?.includes('/api/Accounts/registerAsStudent') ||
                      originalRequest.url?.includes('/api/Accounts/registerAsService');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthPath) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return clientAxios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { authService } = await import('@/features/auth/services/auth.service');
        const result = await authService.refreshToken();
        
        if (result.success && result.data?.accessToken) {
          const newToken = result.data.accessToken;
          const user = useAuthStore.getState().user;
          
          if (user) {
            useAuthStore.getState().login({
              ...user,
              token: newToken
            });
          }

          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return clientAxios(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default clientAxios;
