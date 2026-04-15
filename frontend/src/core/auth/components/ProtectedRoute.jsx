import { getCookie } from '../../lib/cookies';

export const ProtectedRoute = ({ children }) => {
  // ✅ Leer de cookie primero, luego localStorage
  const token = getCookie('token') || localStorage.getItem('token');
  const user = getCookie('user') || localStorage.getItem('user');
  
  if (!token || !user) {
    window.location.href = 'https://jgsystemsgt.com/login';
    return null;
  }
  
  return children;
};