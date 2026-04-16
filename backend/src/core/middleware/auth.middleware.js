import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import { Session } from '../models/Session.js';
import { User } from '../models/User.js';
import { Tenant } from '../models/Tenant.js';
import { TenantUser } from '../models/TenantUser.js';

// Eliminar caché para depuración
export const invalidateAuthCache = () => {};

/**
 * Middleware de autenticación obligatoria
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // Intentar obtener token de cookie o header
    const token = req.cookies?.token || extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'No autorizado' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, error: 'Token inválido' });
    }

    const [session, user] = await Promise.all([
      Session.findOne({ token }),
      User.findById(decoded.userId).select('-password')
    ]);

    if (!session || !user) {
      return res.status(401).json({ success: false, error: 'Sesión no válida' });
    }

    const tenantIdToValidate = req.requestedTenant?._id || decoded.tenantId;
    const tenant = await Tenant.findById(tenantIdToValidate);

    if (!tenant || tenant.status !== 'active') {
      return res.status(403).json({ success: false, error: 'Negocio no disponible' });
    }

    const tenantUser = await TenantUser.findOne({ tenantId: tenant._id, userId: user._id });
    if (!tenantUser) {
      return res.status(403).json({ success: false, error: 'Sin acceso a este negocio' });
    }

    req.user = user;
    req.authenticatedTenant = tenant;
    req.tenantUser = tenantUser;
    req.token = token;

    next();
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Error de servidor' });
  }
};

/**
 * Middleware de autenticación opcional
 * Adjunta los datos si hay token, pero no bloquea si no lo hay
 */
export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return next();
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next();
    }

    const session = await Session.findOne({ token });
    if (!session) {
      return next();
    }

    const user = await User.findById(decoded.userId).select('-password');
    const tenant = await Tenant.findById(decoded.tenantId);
    const tenantUser = await TenantUser.findOne({
      tenantId: tenant?._id,
      userId: user?._id,
    });

    req.user = user;
    // ✅ Usar authenticatedTenant para consistencia
    req.authenticatedTenant = tenant;
    req.tenant = tenant;  // Para compatibilidad
    req.tenantUser = tenantUser;
    req.session = session;
    req.token = token;

    next();
  } catch (error) {
    // Si hay error, simplemente continuamos sin autenticación
    next();
  }
};

/**
 * Middleware para verificar roles específicos
 * @param {string[]} allowedRoles - Roles permitidos
 */
export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.tenantUser) {
      return res.status(401).json({ 
        success: false, 
        error: 'No autenticado' 
      });
    }

    if (!allowedRoles.includes(req.tenantUser.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'No tienes permiso para realizar esta acción' 
      });
    }

    next();
  };
};

/**
 * Middleware para verificar permisos específicos
 * @param {string[]} requiredPermissions - Permisos requeridos
 */
export const permissionMiddleware = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.tenantUser) {
      return res.status(401).json({ 
        success: false, 
        error: 'No autenticado' 
      });
    }

    // Owner tiene todos los permisos
    if (req.tenantUser.role === 'owner') {
      return next();
    }

    const userPermissions = req.tenantUser.permissions || [];
    const hasAllPermissions = requiredPermissions.every(
      perm => userPermissions.includes(perm)
    );

    if (!hasAllPermissions) {
      return res.status(403).json({ 
        success: false, 
        error: 'No tienes los permisos necesarios para esta acción' 
      });
    }

    next();
  };
};