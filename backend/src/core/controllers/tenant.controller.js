import { Tenant } from '../models/Tenant.js';
import { TenantUser } from '../models/TenantUser.js';
import { User } from '../models/User.js';
import { generateUniqueSlug } from '../utils/slug.js';
import { asyncHandler } from '../middleware/error.middleware.js';

/**
 * Obtener todos los tenants del usuario autenticado
 * GET /api/tenants
 */
export const getMyTenants = asyncHandler(async (req, res) => {
  const tenantUsers = await TenantUser.find({ userId: req.user._id })
    .populate('tenantId', 'name slug logo status');

  const tenants = tenantUsers.map(tu => ({
    ...tu.tenantId.toObject(),
    role: tu.role,
  }));

  res.json({
    success: true,
    tenants,
  });
});

/**
 * Obtener un tenant específico
 * GET /api/tenants/:slug
 */
export const getTenant = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const tenant = await Tenant.findOne({ slug });
  
  if (!tenant) {
    return res.status(404).json({
      success: false,
      error: 'Negocio no encontrado',
    });
  }

  res.json({
    success: true,
    tenant,
  });
});

/**
 * Actualizar tenant
 * PUT /api/tenants/:slug
 */
export const updateTenant = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { name, logo, settings } = req.body;

  // Solo el owner o admin puede actualizar
  if (req.tenant.slug !== slug) {
    return res.status(403).json({
      success: false,
      error: 'No tienes permiso para modificar este negocio',
    });
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (logo) updateData.logo = logo;
  if (settings) updateData.settings = settings;

  const tenant = await Tenant.findOneAndUpdate(
    { slug },
    updateData,
    { new: true }
  );

  res.json({
    success: true,
    tenant,
  });
});

/**
 * Invitar usuario al tenant
 * POST /api/tenants/:slug/invite
 */
export const inviteUser = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { email, role } = req.body;

  // Verificar permisos (solo owner/admin pueden invitar)
  if (!['owner', 'admin'].includes(req.tenantUser.role)) {
    return res.status(403).json({
      success: false,
      error: 'No tienes permiso para invitar usuarios',
    });
  }

  // Buscar usuario por email
  let user = await User.findOne({ email });
  
  if (!user) {
    // TODO: Enviar email de invitación para registrarse
    return res.status(404).json({
      success: false,
      error: 'Usuario no encontrado. Enviaremos invitación por email.',
    });
  }

  // Verificar si ya es miembro
  const existingMember = await TenantUser.findOne({
    tenantId: req.tenant._id,
    userId: user._id,
  });

  if (existingMember) {
    return res.status(400).json({
      success: false,
      error: 'Este usuario ya es miembro del negocio',
    });
  }

  // Crear relación
  await TenantUser.create({
    tenantId: req.tenant._id,
    userId: user._id,
    role,
    invitedBy: req.user._id,
    invitedAt: new Date(),
    joinedAt: new Date(),
  });

  res.json({
    success: true,
    message: 'Usuario invitado correctamente',
  });
});

/**
 * Listar miembros del tenant
 * GET /api/tenants/:slug/members
 */
export const getMembers = asyncHandler(async (req, res) => {
  const members = await TenantUser.find({ tenantId: req.tenant._id })
    .populate('userId', 'fullName email avatar')
    .populate('invitedBy', 'fullName email');

  res.json({
    success: true,
    members,
  });
});

/**
 * Cambiar rol de un miembro
 * PUT /api/tenants/:slug/members/:userId
 */
export const updateMemberRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  // Solo owner puede cambiar roles
  if (req.tenantUser.role !== 'owner') {
    return res.status(403).json({
      success: false,
      error: 'Solo el dueño puede cambiar roles',
    });
  }

  // No permitir cambiar el rol del owner
  const member = await TenantUser.findOne({
    tenantId: req.tenant._id,
    userId,
  });

  if (member.role === 'owner') {
    return res.status(403).json({
      success: false,
      error: 'No se puede cambiar el rol del dueño',
    });
  }

  member.role = role;
  await member.save();

  res.json({
    success: true,
    message: 'Rol actualizado correctamente',
  });
});

/**
 * Eliminar miembro del tenant
 * DELETE /api/tenants/:slug/members/:userId
 */
export const removeMember = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // No permitir eliminar al owner
  const member = await TenantUser.findOne({
    tenantId: req.tenant._id,
    userId,
  });

  if (member.role === 'owner') {
    return res.status(403).json({
      success: false,
      error: 'No se puede eliminar al dueño del negocio',
    });
  }

  await TenantUser.deleteOne({
    tenantId: req.tenant._id,
    userId,
  });

  res.json({
    success: true,
    message: 'Miembro eliminado correctamente',
  });
});