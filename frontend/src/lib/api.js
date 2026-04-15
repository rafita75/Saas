import axios from 'axios';
import { clearAuthCookies, getSessionData } from './cookies';

// ✅ Función para obtener token (cookie primero, luego localStorage)
const getToken = () => {
  return getSessionData('token');
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config?.url?.includes('/auth/login');
    
    if (error.response?.status === 401 && !isLoginEndpoint) {
      // Limpiar cookies y localStorage
      clearAuthCookies();
      localStorage.clear();
      window.location.href = 'https://jgsystemsgt.com/login';
    }
    return Promise.reject(error);
  }
);

export default api;