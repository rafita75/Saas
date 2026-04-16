import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../../lib/api';
import { clearAuthCookies, getSessionData } from '../../../lib/cookies';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      // Intentar obtener perfil del servidor
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        setUser(response.data.user);
        setTenant(response.data.tenant);
        setIsAuthenticated(true);
      } else {
        throw new Error('No autorizado');
      }
    } catch (error) {
      setUser(null);
      setTenant(null);
      setIsAuthenticated(false);
      // Solo limpiar si no estamos en rutas públicas
      const publicPaths = ['/', '/login', '/register'];
      if (!publicPaths.includes(window.location.pathname)) {
        clearAuthCookies();
        localStorage.clear();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData, tenantData) => {
    setUser(userData);
    setTenant(tenantData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setTenant(null);
    setIsAuthenticated(false);
    clearAuthCookies();
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, tenant, loading, isAuthenticated, checkAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};