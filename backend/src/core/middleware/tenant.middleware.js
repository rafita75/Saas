import { Tenant } from '../models/Tenant.js';

/**
 * Middleware para resolver el tenant por subdominio, header o params
 * NO sobrescribe req.tenant - usa req.requestedTenant
 */
export const tenantResolver = async (req, res, next) => {
  try {
    let slug = null;

    // 1. PRIORIDAD MÁXIMA: Header (Fundamental para Vercel -> Render)
    if (req.headers['x-tenant-slug']) {
      slug = req.headers['x-tenant-slug'];
    }
    
    // 2. Prioridad: params de la URL (Rutas tipo /:slug/...)
    if (!slug && req.params.slug) {
      slug = req.params.slug;
    }
    
    // 3. Subdominio (Fallback si no hay lo anterior)
    if (!slug) {
      const hostname = req.headers.host || '';
      const parts = hostname.split('.');
      const isLocalhost = hostname.includes('localhost');
      
      if (isLocalhost && parts.length >= 2 && parts[0] !== 'localhost') {
        slug = parts[0];
      } else if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'admin') {
        slug = parts[0];
      }
    }

    if (slug) {
      const slugStr = String(slug).toLowerCase().trim();
      
      // Intentar encontrar por publicSlug (Nuevo) o slug (Antiguo)
      let requestedTenant = await Tenant.findOne({ 
        $or: [{ publicSlug: slugStr }, { slug: slugStr }],
        status: 'active' 
      });

      if (requestedTenant) {
        req.requestedTenant = requestedTenant;
      }
    }
    
    next();
  } catch (error) {
    console.error('Error en tenantResolver:', error);
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