import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { API_CONFIG } from './api.config';
import { useAuthStore } from '@/store/useAuthStore';

const clientAxios = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

// Request interceptor: add auth token
clientAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor: handle errors
clientAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      // Optional: Redirect to login if needed, or rely on ProtectedRoute reacting to state change
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default clientAxios;
