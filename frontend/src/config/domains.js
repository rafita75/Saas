// Dominios según entorno
const isProduction = import.meta.env.PROD;
const hostname = window.location.hostname;

export const API_URL = 'https://saas-cohr.onrender.com';

export const DOMAINS = {
  main: isProduction ? 'jgsystemsgt.com' : 'localhost:5173',
  admin: isProduction ? 'admin.jgsystemsgt.com' : 'admin.localhost:5173',
  api: API_URL,
};

export const getMainUrl = () => {
  const protocol = window.location.protocol;
  return `${protocol}//${DOMAINS.main}`;
};

export const getAdminUrl = (slug = '') => {
  const protocol = window.location.protocol;
  const base = `${protocol}//${DOMAINS.admin}`;
  return slug ? `${base}/${slug}` : base;
};

export const getPublicUrl = (publicSlug = '') => {
  const protocol = window.location.protocol;
  const isOfficialDomain = hostname === 'jgsystemsgt.com' || hostname.endsWith('.jgsystemsgt.com');
  
  if (isOfficialDomain) {
    return `${protocol}//${publicSlug}.jgsystemsgt.com`;
  }
  
  // En Vercel o Localhost, la URL pública es la misma pero con un parámetro o ruta distinta
  // Por ahora, asumimos que la vista pública estará en /p/:slug
  return `${protocol}//${hostname}/p/${publicSlug}`;
};