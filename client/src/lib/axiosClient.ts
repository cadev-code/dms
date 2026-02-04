import { queryClient } from '@/config/queryClient';
import axios from 'axios';

const baseURL = import.meta.env.DEV
  ? 'http://localhost:8080'
  : import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const axiosClient = axios.create({
  baseURL,
  withCredentials: true, // Incluir cookies en las solicitudes
});

// Interceptor de request para cambiar timeout dinámicamente
axiosClient.interceptors.request.use((config) => {
  // Identificar por URL o método
  if (config.url?.includes('/download') || config.url?.includes('/export')) {
    config.timeout = 30000; // 30 segundos para descargas
  } else if (config.url?.includes('/auth')) {
    config.timeout = 10000; // 10 segundos para autenticación
  } else if (config.method === 'get') {
    config.timeout = 10000; // 10 segundos para GETs normales
  } else if (config.method === 'post' || config.method === 'put') {
    config.timeout = 60000; // 60 segundos para POST/PUT
  } else if (config.method === 'delete') {
    config.timeout = 60000; // 60 segundos para POST/PUT
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Solo limpiar y redirigir si NO estamos en /login
      if (window.location.pathname !== '/login') {
        queryClient.removeQueries({ queryKey: ['currentUser'] });
        window.location.href = '/login';
      }
    }

    // Propagar el error para que React Query lo detecte
    return Promise.reject(error);
  },
);
