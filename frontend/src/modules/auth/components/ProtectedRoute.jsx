import { useEffect, useState } from 'react';
import { getCookie } from '../../../lib/cookies';
import api from '../../../lib/api';

export const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = getCookie('token') || localStorage.getItem('token');
      
      if (!token) {
        window.location.href = 'https://jgsystemsgt.com/login';
        return;
      }

      try {
        // Verificar token con el backend
        await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setValid(true);
      } catch (error) {
        // Token inválido o expirado
        localStorage.clear();
        window.location.href = 'https://jgsystemsgt.com/login';
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-slate-400">Verificando sesión...</div>
      </div>
    );
  }

  if (!valid) {
    return null;
  }

  return children;
};