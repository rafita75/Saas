import axios from 'axios';

// ✅ Función para obtener token (cookie primero, luego localStorage)
const getToken = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return localStorage.getItem('token');
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
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.jgsystemsgt.com; path=/;';
      document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.jgsystemsgt.com; path=/;';
      document.cookie = 'tenant=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.jgsystemsgt.com; path=/;';
      localStorage.clear();
      window.location.href = 'https://jgsystemsgt.com/login';
    }
    return Promise.reject(error);
  }
);

export default api;