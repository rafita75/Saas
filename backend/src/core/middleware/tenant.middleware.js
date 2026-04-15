import { Tenant } from '../models/Tenant.js';

/**
 * Middleware para resolver el tenant por subdominio o header
 */
export const tenantResolver = async (req, res, next) => {
  try {
    // 1. Intentar obtener slug del subdominio
    const hostname = req.headers.host || '';
    const parts = hostname.split('.');
    
    let slug = null;
    
    // Si es subdominio (ej: mi-tienda.admin.localhost)
    if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'admin') {
      slug = parts[0];
    }
    
    // 2. Si no hay subdominio, buscar en header personalizado
    if (!slug) {
      slug = req.headers['x-tenant-slug'];
    }
    
    // 3. Si aún no hay slug, buscar en query param
    if (!slug) {
      slug = req.query.tenant;
    }
    
    // 4. Si encontramos slug, buscar el tenant
    if (slug) {
      const tenant = await Tenant.findOne({ slug, status: 'active' });
      
      if (tenant) {
        req.tenant = tenant;
      }
    }
    
    next();
  } catch (error) {
    console.error('Error en tenantResolver:', error);
    next();
  }
};

/**
 * Middleware para exigir que haya un tenant resuelto
 */
export const requireTenant = (req, res, next) => {
  if (!req.tenant) {
    return res.status(400).json({
      success: false,
      error: 'No se pudo determinar el negocio. Especifica un subdominio o tenant válido.',
    });
  }
  
  next();
};