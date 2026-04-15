import { useEffect } from 'react';

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  useEffect(() => {
    if (!token || !user) {
      window.location.href = 'https://jgsystemsgt.com/login';
    }
  }, [token, user]);
  
  if (!token || !user) {
    return null; // No renderizar nada mientras redirige
  }
  
  return children;
};