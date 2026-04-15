import { getCookie } from '../../../lib/cookies';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }) => {
  const token = getCookie('token') || localStorage.getItem('token');
  
  // ✅ Forzar verificación en cada render
  if (!token) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 border border-red-500/30 text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">🔒 Acceso Denegado</h2>
          <p className="text-slate-400 mb-6">
            Debes iniciar sesión para acceder al panel de administración.
          </p>
          <a 
            href="https://jgsystemsgt.com/login"
            className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-medium"
          >
            Ir a Iniciar Sesión
          </a>
        </div>
      </div>
    );
  }
  
  return children;
};