// Dominios según entorno
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

export const DOMAINS = {
  main: isProduction ? 'jgsystemsgt.com' : 'localhost:5173',
  admin: isProduction ? 'admin.jgsystemsgt.com' : 'admin.localhost:5173',
  api: isProduction 
    ? 'https://api.jgsystemsgt.com' 
    : import.meta.env.VITE_API_URL || 'http://localhost:3000',
};

export const getMainUrl = () => {
  const protocol = isProduction ? 'https' : 'http';
  return `${protocol}://${DOMAINS.main}`;
};

export const getAdminUrl = (slug = '') => {
  const protocol = isProduction ? 'https' : 'http';
  const base = `${protocol}://${DOMAINS.admin}`;
  return slug ? `${base}/${slug}` : base;
};