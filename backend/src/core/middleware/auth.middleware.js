import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import { Session } from '../models/Session.js';
import { User } from '../models/User.js';
import { Tenant } from '../models/Tenant.js';
import { TenantUser } from '../models/TenantUser.js';
import { LRUCache } from 'lru-cache';

// Configuración de caché para autenticación (5 minutos de TTL)
const authCache = new LRUCache({
  max: 500, // Máximo 500 usuarios en caché
  ttl: 1000 * 60 * 5, // 5 minutos
});

/**
 * Invalida la caché de un token específico
 */
export const invalidateAuthCache = (token) => {
  if (token) authCache.delete(token);
};

/**
 * Middleware de autenticación obligatoria
 * Verifica que el usuario esté autenticado y la sesión sea válida
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extraer token (Prioridad: Cookie > Header)
    let token = req.cookies?.token;
    if (!token) {
      token = extractTokenFromHeader(req.headers.authorization);
    }
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'No se proporcionó token de autenticación' 
      });
    }

    // 2. Verificar caché
    const cachedAuth = authCache.get(token);
    if (cachedAuth) {
      req.user = cachedAuth.user;
      req.authenticatedTenant = cachedAuth.authenticatedTenant;
      req.tenantUser = cachedAuth.tenantUser;
      req.session = cachedAuth.session;
      req.token = token;
      return next();
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token inválido o expirado' 
      });
    }

    const session = await Session.findOne({ token });
    if (!session) {
      return res.status(401).json({ 
        success: false, 
        error: 'Sesión inválida o cerrada' 
      });
    }

    // Buscar al usuario
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }

    // Determinar el tenant a validar:
    // 1. El solicitado por la URL (si existe)
    // 2. El del token (fallback)
    const tenantIdToValidate = req.requestedTenant?._id || decoded.tenantId;

    const tenant = await Tenant.findById(tenantIdToValidate);
    if (!tenant) {
      return res.status(404).json({ 
        success: false, 
        error: 'Negocio no encontrado' 
      });
    }

    if (tenant.status !== 'active') {
      return res.status(403).json({ 
        success: false, 
        error: 'Este negocio no está activo' 
      });
    }

    // Verificar membresía
    const tenantUser = await TenantUser.findOne({
      tenantId: tenant._id,
      userId: user._id,
    });

    if (!tenantUser) {
      return res.status(403).json({ 
        success: false, 
        error: 'No tienes acceso a este negocio' 
      });
    }

    // ✅ Establecer contextos
    const authData = {
      user,
      authenticatedTenant: tenant,
      tenantUser,
      session,
    };

    // Guardar en caché
    authCache.set(token, authData);

    req.user = user;
    req.authenticatedTenant = tenant;  // El tenant validado en esta petición
    req.tenantUser = tenantUser;
    req.session = session;
    req.token = token;

    next();
  } catch (error) {
    console.error('Error en authMiddleware:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error al verificar autenticación' 
    });
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