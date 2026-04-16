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