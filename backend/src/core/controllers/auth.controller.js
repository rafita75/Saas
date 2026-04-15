import { User } from '../models/User.js';
import { Tenant } from '../models/Tenant.js';
import { TenantUser } from '../models/TenantUser.js';
import { Session } from '../models/Session.js';
import { generateToken } from '../utils/jwt.js';
import { generateUniqueSlug } from '../utils/slug.js';
import { validatePasswordStrength } from '../utils/password.js';
import { asyncHandler } from '../middleware/error.middleware.js';

/**
 * Registro de nuevo usuario y tenant
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { fullName, businessName, email, password } = req.body;

  // Validar fortaleza de contraseña
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    return res.status(400).json({
      success: false,
      error: 'Contraseña débil',
      details: passwordValidation.errors,
    });
  }

  // Verificar si el email ya existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'Este email ya está registrado',
    });
  }

  // Generar slug único para el tenant
  const slug = await generateUniqueSlug(businessName, Tenant);

  // Crear usuario
  const user = await User.create({
    fullName,
    email,
    password,
  });

  // Crear tenant
  const tenant = await Tenant.create({
    name: businessName,
    slug,
    ownerId: user._id,
  });

  // Crear relación tenant_user como owner
  await TenantUser.create({
    tenantId: tenant._id,
    userId: user._id,
    role: 'owner',
  });

  // Generar token JWT
  const token = generateToken({
    userId: user._id,
    tenantId: tenant._id,
    slug: tenant.slug,
  });

  // Crear sesión
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await Session.create({
    userId: user._id,
    tenantId: tenant._id,
    token,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    expiresAt,
  });

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
    tenant: {
      id: tenant._id,
      name: tenant.name,
      slug: tenant.slug,
    },
  });
});

/**
 * Login de usuario
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Buscar usuario
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Email o contraseña incorrectos',
    });
  }

  // Verificar contraseña
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      error: 'Email o contraseña incorrectos',
    });
  }

  // Obtener el primer tenant del usuario (como owner)
  const tenantUser = await TenantUser.findOne({ userId: user._id }).populate('tenantId');
  
  if (!tenantUser) {
    return res.status(404).json({
      success: false,
      error: 'No se encontró un negocio asociado a tu cuenta',
    });
  }

  const tenant = tenantUser.tenantId;

  // Actualizar último login
  user.lastLogin = new Date();
  await user.save();

  // Generar token JWT
  const token = generateToken({
    userId: user._id,
    tenantId: tenant._id,
    slug: tenant.slug,
  });

  // Crear sesión
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await Session.create({
    userId: user._id,
    tenantId: tenant._id,
    token,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    expiresAt,
  });

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    },
    tenant: {
      id: tenant._id,
      name: tenant.name,
      slug: tenant.slug,
      logo: tenant.logo,
    },
    role: tenantUser.role,
  });
});

/**
 * Logout - Cerrar sesión
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  const token = req.token;

  if (token) {
    // Eliminar la sesión actual
    await Session.deleteOne({ token });
  }

  res.json({
    success: true,
    message: 'Sesión cerrada correctamente',
  });
});

/**
 * Logout de todos los dispositivos
 * POST /api/auth/logout-all
 */
export const logoutAll = asyncHandler(async (req, res) => {
  // Eliminar todas las sesiones del usuario para el tenant actual
  await Session.deleteMany({
    userId: req.user._id,
    tenantId: req.tenant._id,
  });

  res.json({
    success: true,
    message: 'Sesión cerrada en todos los dispositivos',
  });
});

/**
 * Obtener datos del usuario autenticado
 * GET /api/auth/me
 */
export const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user,
    tenant: req.tenant,
    role: req.tenantUser.role,
    permissions: req.tenantUser.permissions,
  });
});