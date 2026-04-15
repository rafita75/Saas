import { Tenant } from '../models/Tenant.js';
import { TenantUser } from '../models/TenantUser.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../middleware/error.middleware.js';

export const getMyTenants = asyncHandler(async (req, res) => {
  const tenantUsers = await TenantUser.find({ userId: req.user._id })
    .populate('tenantId', 'name slug logo status');

  // ✅ Filtrar referencias huérfanas (tenantId = null)
  const tenants = tenantUsers
    .filter(tu => tu.tenantId !== null)
    .map(tu => ({
      ...tu.tenantId.toObject(),
      role: tu.role,
    }));

  res.json({ success: true, tenants });
});

export const getTenant = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const tenant = await Tenant.findOne({ slug });
  
  if (!tenant) {
    return res.status(404).json({ success: false, error: 'Negocio no encontrado' });
  }

  // ✅ Solo devolver datos públicos
  res.json({
    success: true,
    tenant: {
      id: tenant._id,
      name: tenant.name,
      slug: tenant.slug,
      logo: tenant.logo,
    },
  });
});

export const updateTenant = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { name, logo, settings } = req.body;
  const tenant = req.authenticatedTenant || req.tenant;

  if (tenant.slug !== slug) {
    return res.status(403).json({ success: false, error: 'No tienes permiso para modificar este negocio' });
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (logo) updateData.logo = logo;
  if (settings) updateData.settings = settings;

  const updatedTenant = await Tenant.findOneAndUpdate({ slug }, updateData, { new: true });

  res.json({ success: true, tenant: updatedTenant });
});

export const inviteUser = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const tenant = req.authenticatedTenant || req.tenant;
  const tenantUser = req.tenantUser;

  if (!['owner', 'admin'].includes(tenantUser?.role)) {
    return res.status(403).json({ success: false, error: 'No tienes permiso para invitar usuarios' });
  }

  let user = await User.findOne({ email: email?.toLowerCase() });
  
  if (!user) {
    return res.status(404).json({ success: false, error: 'Usuario no encontrado. Enviaremos invitación por email.' });
  }

  const existingMember = await TenantUser.findOne({ tenantId: tenant._id, userId: user._id });
  if (existingMember) {
    return res.status(400).json({ success: false, error: 'Este usuario ya es miembro del negocio' });
  }

  await TenantUser.create({
    tenantId: tenant._id,
    userId: user._id,
    role,
    invitedBy: req.user._id,
    invitedAt: new Date(),
    joinedAt: new Date(),
  });

  res.json({ success: true, message: 'Usuario invitado correctamente' });
});

export const getMembers = asyncHandler(async (req, res) => {
  const tenant = req.authenticatedTenant || req.tenant;
  const members = await TenantUser.find({ tenantId: tenant._id })
    .populate('userId', 'fullName email avatar')
    .populate('invitedBy', 'fullName email');

  res.json({ success: true, members });
});

export const updateMemberRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  const tenant = req.authenticatedTenant || req.tenant;

  if (req.tenantUser?.role !== 'owner') {
    return res.status(403).json({ success: false, error: 'Solo el dueño puede cambiar roles' });
  }

  const member = await TenantUser.findOne({ tenantId: tenant._id, userId });
  
  if (!member) {
    return res.status(404).json({ success: false, error: 'Miembro no encontrado' });
  }

  if (member.role === 'owner') {
    return res.status(403).json({ success: false, error: 'No se puede cambiar el rol del dueño' });
  }

  member.role = role;
  await member.save();

  res.json({ success: true, message: 'Rol actualizado correctamente' });
});

export const removeMember = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const tenant = req.authenticatedTenant || req.tenant;

  const member = await TenantUser.findOne({ tenantId: tenant._id, userId });
  
  if (!member) {
    return res.status(404).json({ success: false, error: 'Miembro no encontrado' });
  }

  if (member.role === 'owner') {
    return res.status(403).json({ success: false, error: 'No se puede eliminar al dueño del negocio' });
  }

  await TenantUser.deleteOne({ _id: member._id });

  res.json({ success: true, message: 'Miembro eliminado correctamente' });
});