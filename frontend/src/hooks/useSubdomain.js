import { useState, useEffect } from 'react';

export const useSubdomain = () => {
  const [subdomain, setSubdomain] = useState(null);
  const [isMainDomain, setIsMainDomain] = useState(true);

  useEffect(() => {
    const hostname = window.location.hostname;
    
    // Detectar si es subdominio
    const parts = hostname.split('.');
    
    if (parts.length > 2 || (parts.length === 3 && parts[0] !== 'www')) {
      // Es un subdominio
      const sub = parts[0];
      setSubdomain(sub);
      setIsMainDomain(false);
    } else {
      // Es dominio principal
      setSubdomain(null);
      setIsMainDomain(true);
    }
  }, []);

  return { subdomain, isMainDomain };
};