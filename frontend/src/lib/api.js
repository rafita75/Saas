import axios from 'axios';
import { clearAuthCookies, getSessionData } from './cookies';
import { getMainUrl, API_URL } from '../config/domains';

// ✅ Función para obtener token (cookie primero, luego localStorage)
const getToken = () => {
  return getSessionData('token');
};

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // ✅ Importante para cookies HttpOnly
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token (solo si existe en memoria o localStorage antiguo)
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
      // ✅ URL dinámica
      window.location.href = `${getMainUrl()}/login`;
    }
    return Promise.reject(error);
  }
);

export default api;