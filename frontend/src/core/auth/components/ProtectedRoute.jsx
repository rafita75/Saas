import { getSessionData, clearAuthCookies } from '../../../lib/cookies';
import { getMainUrl } from '../../../config/domains';

// ✅ Función para verificar si el token JWT ha expirado
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Decodificar el payload del JWT (sin verificar firma)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp ? payload.exp < now : true;
  } catch (error) {
    // Si no se puede decodificar, asumimos que es inválido
    return true;
  }
};

// ✅ Función para verificar consistencia de sesión
const isSessionValid = () => {
  const token = getSessionData('token');
  const user = getSessionData('user');
  const tenant = getSessionData('tenant');
  
  // Validar presencia absoluta
  if (!token || !user || !tenant) return false;
  
  // Validar expiración del token
  if (isTokenExpired(token)) return false;
  
  return true;
};

export const ProtectedRoute = ({ children }) => {
  const isValid = isSessionValid();
  
  if (!isValid) {
    // Limpiar sesión corrupta o expirada
    clearAuthCookies();
    localStorage.clear();
    window.location.href = `${getMainUrl()}/login`;
    return null;
  }
  
  return children;
};