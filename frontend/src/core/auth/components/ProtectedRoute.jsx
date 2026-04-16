import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMainUrl } from '../../../config/domains';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    window.location.href = `${getMainUrl()}/login`;
    return null;
  }
  
  return children;
};