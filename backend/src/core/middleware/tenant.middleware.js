import { Tenant } from '../models/Tenant.js';

/**
 * Middleware para resolver el tenant por subdominio o header
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
      if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'admin') {
        slug = parts[0];
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

export const updateMemberRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const member = await TenantUser.findOne({
      tenantId: req.tenant._id,
      userId,
    });

    // ✅ Validación
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Miembro no encontrado',
      });
    }

    if (member.role === 'owner') {
      return res.status(403).json({
        success: false,
        error: 'No se puede cambiar el rol del dueño',
      });
    }

    member.role = role;
    await member.save();

    res.json({ success: true, message: 'Rol actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;

    const member = await TenantUser.findOne({
      tenantId: req.tenant._id,
      userId,
    });

    // ✅ Validación
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Miembro no encontrado',
      });
    }

    if (member.role === 'owner') {
      return res.status(403).json({
        success: false,
        error: 'No se puede eliminar al dueño',
      });
    }

    await TenantUser.deleteOne({ _id: member._id });

    res.json({ success: true, message: 'Miembro eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

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