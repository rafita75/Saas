import { getSessionData } from '../../lib/cookies';

export const ProtectedRoute = ({ children }) => {
  const token = getSessionData('token');
  const user = getSessionData('user');
  
  if (!token || !user) {
    window.location.href = 'https://jgsystemsgt.com/login';
    return null;
  }
  
  return children;
};