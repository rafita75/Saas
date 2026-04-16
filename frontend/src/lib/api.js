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

// Interceptor para agregar token y slug de tenant
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ Inyectar SLUG del subdominio actual para que el backend lo reconozca
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  const isLocalhost = hostname.includes('localhost');
  const isAdmin = hostname.startsWith('admin.');
  
  let slug = null;
  if (!isAdmin) {
    if (isLocalhost && parts.length >= 2 && parts[0] !== 'localhost') slug = parts[0];
    else if (!isLocalhost && parts.length >= 3 && parts[0] !== 'www') slug = parts[0];
  }

  if (slug) {
    config.headers['x-tenant-slug'] = slug;
  }
  
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config?.url?.includes('/auth/login');
    const isMeEndpoint = error.config?.url?.includes('/auth/me');
    
    if (error.response?.status === 401 && !isLoginEndpoint) {
      // ✅ Solo redirigir si NO estamos ya en una ruta pública
      const publicPaths = ['/login', '/register', '/', '/select-tenant'];
      const isPublicPath = publicPaths.includes(window.location.pathname) || 
                          window.location.pathname === '';

      if (!isPublicPath) {
        clearAuthCookies();
        localStorage.clear();
        window.location.href = `${getMainUrl()}/login`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;