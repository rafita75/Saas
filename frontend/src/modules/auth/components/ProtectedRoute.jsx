import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';

export const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Verificar token con el backend
        await api.get('/auth/me');
        setAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">
        <div className="text-slate-400">Cargando...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="https://jgsystemsgt.com/login" replace />;
  }

  return children;
};