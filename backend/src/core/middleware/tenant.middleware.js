import { Tenant } from '../models/Tenant.js';

/**
 * Middleware para resolver el tenant por subdominio, header o params
 * NO sobrescribe req.tenant - usa req.requestedTenant
 */
export const tenantResolver = async (req, res, next) => {
  try {
    let slug = null;
    
    // 1. Prioridad: params de la URL
    if (req.params.slug) {
      slug = req.params.slug;
    }
    
    // 2. Subdominio
    if (!slug) {
      const hostname = req.headers.host || '';
      const parts = hostname.split('.');
      const isLocalhost = hostname.includes('localhost');
      
      // En localhost: tienda.localhost:3000 (2 partes)
      // En producción: tienda.midominio.com (3 partes)
      if (isLocalhost) {
        if (parts.length >= 2 && parts[0] !== 'localhost' && parts[0] !== 'admin') {
          slug = parts[0];
        }
      } else {
        if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'admin') {
          slug = parts[0];
        }
      }
    }
    
    // 3. Header
    if (!slug) {
      slug = req.headers['x-tenant-slug'];
    }
    
    // 4. Query
    if (!slug) {
      slug = req.query.tenant;
    }
    
    if (slug) {
      const requestedTenant = await Tenant.findOne({ slug, status: 'active' });
      if (requestedTenant) {
        req.requestedTenant = requestedTenant;  // ✅ No sobrescribir req.tenant
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

/**
 * Valida que el tenant solicitado coincida con el autenticado
 * y establece req.tenant para compatibilidad
 */
export const validateTenantAccess = (req, res, next) => {
  // Si hay un tenant solicitado, debe coincidir con el autenticado
  if (req.requestedTenant && req.authenticatedTenant) {
    if (req.requestedTenant._id.toString() !== req.authenticatedTenant._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'No tienes acceso a este negocio',
      });
    }
  }
  
  // Para compatibilidad, mantener req.tenant
  req.tenant = req.authenticatedTenant || req.requestedTenant;
  
  if (!req.tenant) {
    return res.status(400).json({
      success: false,
      error: 'No se pudo determinar el negocio',
    });
  }
  
  next();
};

/**
 * Middleware para exigir que haya un tenant resuelto
 * (usar después de validateTenantAccess)
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