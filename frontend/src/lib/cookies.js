// Obtener el dominio base
const getDomain = () => {
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname.includes("127.0.0.1")) {
    return null;
  }
  // Forzar dominio oficial para compartir entre subdominios
  if (hostname.endsWith(".jgsystemsgt.com") || hostname === "jgsystemsgt.com") {
    return ".jgsystemsgt.com";
  }
  return null;
};

// Guardar cookie accesible desde subdominios
export const setCookie = (name, value, days = 7) => {
  const encodedValue = encodeURIComponent(value);
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  const domain = getDomain();
  const isSecure = window.location.protocol === "https:";
  const domainPart = domain ? `domain=${domain}; ` : "";

  document.cookie = `${name}=${encodedValue}; ${expires}; ${domainPart}path=/; ${isSecure ? "secure; " : ""}samesite=lax`;
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
  const domainPart = domain ? `domain=${domain}; ` : "";
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${domainPart}path=/;`;
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

// Parsear JSON de sesión de forma segura (evita romper la app si hay datos corruptos)
export const parseSessionJSON = (key, fallback = {}) => {
  const rawValue = getSessionData(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return fallback;
  }
};
