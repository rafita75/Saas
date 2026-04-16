// Dominios según entorno
const isProduction = import.meta.env.PROD;
const hostname = window.location.hostname;

// 1. Configuración de la API (Render Backend)
// Forzamos la URL de Render para el backend, ya que el frontend está en Vercel
export const API_URL = 'https://saas-cohr.onrender.com';

// 2. Detectar si estamos en el dominio oficial
const isOfficialDomain = hostname === 'jgsystemsgt.com' || hostname.endsWith('.jgsystemsgt.com');

export const DOMAINS = {
  main: hostname,
  // Solo usamos subdominio 'admin.' si estamos en el dominio oficial final.
  // En Vercel o Localhost, usamos el mismo dominio base para evitar problemas de cookies.
  admin: isOfficialDomain ? `admin.jgsystemsgt.com` : hostname,
  api: API_URL,
};

export const getMainUrl = () => {
  const protocol = window.location.protocol;
  // Si estamos en admin.jgsystemsgt.com, el main es jgsystemsgt.com
  if (isOfficialDomain && hostname.startsWith('admin.')) {
    return `${protocol}//jgsystemsgt.com`;
  }
  return `${protocol}//${hostname}`;
};

export const getAdminUrl = (slug = '') => {
  const protocol = window.location.protocol;

  // Si estamos en el dominio oficial, usamos el subdominio admin
  if (isOfficialDomain) {
    const base = `${protocol}//admin.jgsystemsgt.com`;
    return slug ? `${base}/${slug}` : base;
  }

  // En Vercel o Localhost, nos quedamos en el mismo dominio actual
  const base = `${protocol}//${hostname}`;
  return slug ? `${base}/${slug}` : base;
};