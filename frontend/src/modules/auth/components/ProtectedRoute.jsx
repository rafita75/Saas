import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">Cargando...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};