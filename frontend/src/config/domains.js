// Dominios según entorno
const isProduction = import.meta.env.PROD;
const hostname = window.location.hostname;

// Si estamos en producción pero no es el dominio final (ej. onrender.com)
// usamos el dominio actual como base.
const getBaseDomain = () => {
  if (!isProduction) return 'localhost:5173';
  
  if (hostname === 'jgsystemsgt.com' || hostname.endsWith('.jgsystemsgt.com')) {
    return 'jgsystemsgt.com';
  }

  // Fallback para Render/Vercel: usar el dominio actual quitando subdominios si los hay
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    const base = parts.slice(-2).join('.');
    return base;
  }
  
  return hostname;
};

const BASE_DOMAIN = getBaseDomain();

export const DOMAINS = {
  main: BASE_DOMAIN,
  admin: BASE_DOMAIN === 'localhost:5173' ? `admin.${BASE_DOMAIN}` : `admin.${BASE_DOMAIN}`,
  api: import.meta.env.VITE_API_URL || (isProduction ? `https://api.${BASE_DOMAIN}` : 'http://localhost:3000'),
};

// Ajuste especial para Render donde la API suele estar en un subdominio diferente o URL distinta
if (hostname.includes('onrender.com')) {
  DOMAINS.api = 'https://saas-cohr.onrender.com'; // URL específica del usuario
}

export const getMainUrl = () => {
  const protocol = isProduction ? 'https' : 'http';
  // En localhost no usamos subdominios para la landing
  return `${protocol}://${DOMAINS.main}`;
};

export const getAdminUrl = (slug = '') => {
  const protocol = isProduction ? 'https' : 'http';
  
  // En entornos de prueba como Render, no usamos subdominio 'admin.' 
  // porque rompe las cookies/localStorage.
  if (hostname.includes('onrender.com')) {
    const base = `${protocol}://${hostname}`;
    return slug ? `${base}/${slug}` : base;
  }

  const base = `${protocol}://${DOMAINS.admin}`;
  return slug ? `${base}/${slug}` : base;
};