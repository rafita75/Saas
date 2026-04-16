// Dominios según entorno
const isProduction = import.meta.env.PROD;
const hostname = window.location.hostname;

// 1. Configuración de la API (Render Backend)
export const API_URL = 'https://saas-cohr.onrender.com';

// 2. Detectar si estamos en el dominio oficial
const isOfficialDomain = hostname === 'jgsystemsgt.com' || hostname.endsWith('.jgsystemsgt.com');
const isVercel = hostname.includes('vercel.app');

export const DOMAINS = {
  main: isOfficialDomain ? 'jgsystemsgt.com' : hostname,
  // Restauramos subdominios si es el dominio oficial.
  // Si es Vercel o localhost, no usamos subdominios para evitar pérdida de sesión.
  admin: isOfficialDomain ? `admin.jgsystemsgt.com` : hostname,
  api: API_URL,
};

export const getMainUrl = () => {
  const protocol = window.location.protocol;
  if (isOfficialDomain) return `${protocol}//jgsystemsgt.com`;
  return `${protocol}//${hostname}`;
};

export const getAdminUrl = (slug = '') => {
  const protocol = window.location.protocol;
  
  if (isOfficialDomain) {
    const base = `${protocol}//admin.jgsystemsgt.com`;
    return slug ? `${base}/${slug}` : base;
  }

  // Fallback para Vercel/Local: misma URL
  const base = `${protocol}//${hostname}`;
  return slug ? `${base}/${slug}` : base;
};