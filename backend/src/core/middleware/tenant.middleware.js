import { Tenant } from '../models/Tenant.js';

/**
 * Middleware para resolver el tenant por subdominio, header o params
 * NO sobrescribe req.tenant - usa req.requestedTenant
 */
export const tenantResolver = async (req, res, next) => {
  try {
    let slug = null;

    // 1. PRIORIDAD MÁXIMA: Header (Para comunicación Vercel -> Render)
    if (req.headers['x-tenant-slug']) {
      slug = req.headers['x-tenant-slug'];
    }
    
    // 2. Prioridad: params de la URL
    if (!slug && req.params.slug) {
      slug = req.params.slug;
    }
    
    // 3. Subdominio (Solo si no hay nada anterior)
    if (!slug) {
      const hostname = req.headers.host || '';
      const parts = hostname.split('.');
      const isLocalhost = hostname.includes('localhost');
      const isRender = hostname.includes('onrender.com');
      
      // No intentar extraer slug si estamos en el dominio base de Render
      if (isLocalhost) {
        if (parts.length >= 2 && parts[0] !== 'localhost' && parts[0] !== 'admin') {
          slug = parts[0];
        }
      } else if (!isRender) {
        // Solo en dominios personalizados (ej. tienda.jgsystemsgt.com)
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
      // ✅ Asegurar que slug sea string para prevenir NoSQL Injection
      const slugStr = String(slug);
      const isOfficialDomain = hostname.endsWith('jgsystemsgt.com') || hostname === 'jgsystemsgt.com';
      const isAdminSubdomain = hostname.startsWith('admin.');

      let requestedTenant = null;

      // 1. Si es subdominio admin o estamos en localhost/render con slug en URL
      // buscamos por el slug administrativo fijo.
      if (isAdminSubdomain || (!isOfficialDomain && req.params.slug)) {
        requestedTenant = await Tenant.findOne({ slug: slugStr, status: 'active' });
      } else {
        // 2. Si es subdominio directo (ej. tienda.jgsystemsgt.com)
        // buscamos por el publicSlug.
        requestedTenant = await Tenant.findOne({ publicSlug: slugStr, status: 'active' });

        // ✅ FALLBACK: Si no lo encuentra por publicSlug, buscar por slug normal (Para negocios antiguos)
        if (!requestedTenant) {
          requestedTenant = await Tenant.findOne({ slug: slugStr, status: 'active' });
        }
      }

      if (requestedTenant) {
        req.requestedTenant = requestedTenant;
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