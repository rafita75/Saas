import { useEffect, useState } from 'react';

// ✅ Función para leer cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // ✅ Leer de cookie primero, luego de localStorage
    const token = getCookie('token') || localStorage.getItem('token');
    
    if (!token) {
      window.location.href = 'https://jgsystemsgt.com/login';
      return;
    }

    setAuthenticated(true);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">
        <div className="text-slate-400">Cargando...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return children;
};