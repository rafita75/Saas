import { useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // ✅ Redirección nativa, NO React Router
        window.location.href = 'https://jgsystemsgt.com/login';
        return;
      }

      setAuthenticated(true);
      setLoading(false);
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
    return null; // Ya redirigió
  }

  return children;
};