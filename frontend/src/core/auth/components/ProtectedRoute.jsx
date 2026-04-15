export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    window.location.href = 'https://jgsystemsgt.com/login';
    return null;
  }
  
  return children;
};