// Guardar cookie accesible desde subdominios
export const setCookie = (name, value, days = 7) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; domain=.jgsystemsgt.com; path=/; secure; samesite=lax`;
  };
  
  // Obtener cookie
  export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  
  // Eliminar cookie
  export const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.jgsystemsgt.com; path=/;`;
  };
  
  // Limpiar todas las cookies de auth
  export const clearAuthCookies = () => {
    deleteCookie('token');
    deleteCookie('tenant');
    deleteCookie('user');
  };