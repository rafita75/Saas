import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Tenant } from '../models/Tenant.js';
import { TenantUser } from '../models/TenantUser.js';
import { Session } from '../models/Session.js';
import { generateToken } from '../utils/jwt.js';
import { generateUniqueSlug } from '../utils/slug.js';
import { validatePasswordStrength } from '../utils/password.js';

import { asyncHandler } from '../middleware/error.middleware.js';
import { invalidateAuthCache } from '../middleware/auth.middleware.js';

export const register = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Leer de req.validData (Zod) si existe, fallback a req.body
    const data = req.validData?.body || req.body;
    let { fullName, businessName, email, password } = data;
    
    email = email?.trim().toLowerCase();
    
    if (!email || !password) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos',
      });
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        error: 'Contraseña débil',
        details: passwordValidation.errors,
      });
    }

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        error: 'Este email ya está registrado',
      });
    }

    const slug = await generateUniqueSlug(businessName, Tenant);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [user] = await User.create([{
      fullName,
      email,
      password: hashedPassword,
    }], { session });

    const [tenant] = await Tenant.create([{
      name: businessName,
      slug,
      ownerId: user._id,
    }], { session });

    await TenantUser.create([{
      tenantId: tenant._id,
      userId: user._id,
      role: 'owner',
    }], { session });

    const token = generateToken({
      userId: user._id,
      tenantId: tenant._id,
      slug: tenant.slug,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await Session.create([{
      userId: user._id,
      tenantId: tenant._id,
      token,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      expiresAt,
    }], { session });

    await session.commitTransaction();

    // Configuración de cookie para comunicación Vercel <-> Render
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      user: { id: user._id, fullName: user.fullName, email: user.email },
      tenant: { id: tenant._id, name: tenant.name, slug: tenant.slug },
    });
  } catch (error) {
    await session.abortTransaction();
    throw error; // Deja que asyncHandler lo maneje
  } finally {
    session.endSession();
  }
});

export const login = asyncHandler(async (req, res) => {
  const data = req.validData?.body || req.body;
  let { email, password } = data;
  
  email = email?.trim().toLowerCase();
  
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email y contraseña son requeridos' });
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, error: 'Email o contraseña incorrectos' });
  }

  const tenantUsers = await TenantUser.find({ userId: user._id }).populate('tenantId');
  const validTenants = tenantUsers
    .filter(tu => tu.tenantId)
    .map(tu => ({
      id: tu.tenantId._id,
      name: tu.tenantId.name,
      slug: tu.tenantId.slug,
      logo: tu.tenantId.logo,
      hasCompletedOnboarding: tu.tenantId.hasCompletedOnboarding || false,
      role: tu.role
    }));

  if (validTenants.length === 0) {
    return res.status(404).json({ success: false, error: 'No tienes negocios asociados' });
  }

  const tenant = validTenants[0];
  const token = generateToken({ userId: user._id, tenantId: tenant.id, slug: tenant.slug });

  // Configuración de cookie para comunicación Vercel <-> Render
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    user: { id: user._id, fullName: user.fullName, email: user.email },
    tenants: validTenants,
    tenant: tenant
  });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.token) {
    await Session.deleteOne({ token: req.token });
    invalidateAuthCache(req.token);
  }
  res.json({ success: true, message: 'Sesión cerrada' });
});

export const logoutAll = asyncHandler(async (req, res) => {
  const tenantId = req.authenticatedTenant?._id || req.tenant?._id;
  
  if (!tenantId) {
    return res.status(400).json({
      success: false,
      error: 'No se pudo determinar el negocio',
    });
  }

  await Session.deleteMany({
    userId: req.user._id,
    tenantId: tenantId,
  });

  res.json({
    success: true,
    message: 'Sesión cerrada en todos los dispositivos',
  });
});

export const me = asyncHandler(async (req, res) => {
  const tenant = req.authenticatedTenant || req.tenant;
  
  res.json({
    success: true,
    user: req.user,
    tenant: tenant,
    role: req.tenantUser?.role,
    permissions: req.tenantUser?.permissions || [],
  });
});