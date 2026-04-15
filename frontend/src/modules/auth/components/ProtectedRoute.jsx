import { getCookie } from '../../../lib/cookies';

export const ProtectedRoute = ({ children }) => {
  const token = getCookie('token') || localStorage.getItem('token');
  
  if (!token) {
    window.location.href = 'https://jgsystemsgt.com/login';
    return null;
  }
  
  return children;
};