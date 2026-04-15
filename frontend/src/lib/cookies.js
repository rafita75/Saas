// Obtener el dominio correcto según entorno
const getDomain = () => {
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname.includes("127.0.0.1")) {
    return "localhost";
  }
  return ".jgsystemsgt.com";
};

// Guardar cookie accesible desde subdominios
export const setCookie = (name, value, days = 7) => {
  const encodedValue = encodeURIComponent(value);
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  const domain = getDomain();
  const isSecure = window.location.protocol === "https:";

  document.cookie = `${name}=${encodedValue}; ${expires}; domain=${domain}; path=/; ${isSecure ? "secure;" : ""} samesite=lax`;
};

// Obtener cookie
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
  return null;
};

// Eliminar cookie
export const deleteCookie = (name) => {
  const domain = getDomain();
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${domain}; path=/;`;
};

// Limpiar todas las cookies de auth
export const clearAuthCookies = () => {
  deleteCookie("token");
  deleteCookie("tenant");
  deleteCookie("user");
};

// Obtener datos de sesión (cookie primero, luego localStorage)
export const getSessionData = (key) => {
  const cookieValue = getCookie(key);
  if (cookieValue) return cookieValue;
  return localStorage.getItem(key);
};
