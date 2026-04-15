import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Tenant } from '../models/Tenant.js';
import { TenantUser } from '../models/TenantUser.js';
import { Session } from '../models/Session.js';
import { generateToken } from '../utils/jwt.js';
import { generateUniqueSlug } from '../utils/slug.js';
import { validatePasswordStrength } from '../utils/password.js';

export const register = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let { fullName, businessName, email, password } = req.body;
    
    // ✅ Corregido: usar let en lugar de const
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

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email },
      tenant: { id: tenant._id, name: tenant.name, slug: tenant.slug },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear la cuenta',
    });
  } finally {
    session.endSession();
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    
    email = email?.trim().toLowerCase();
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email o contraseña incorrectos',
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Email o contraseña incorrectos',
      });
    }

    const tenantUser = await TenantUser.findOne({ userId: user._id }).populate('tenantId');
    
    if (!tenantUser || !tenantUser.tenantId) {
      return res.status(404).json({
        success: false,
        error: 'No se encontró un negocio asociado a tu cuenta',
      });
    }

    const tenant = tenantUser.tenantId;

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({
      userId: user._id,
      tenantId: tenant._id,
      slug: tenant.slug,
    });

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
        hasCompletedOnboarding: tenant.hasCompletedOnboarding || false, // ✅ Agregado
      },
      role: tenantUser.role,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error al iniciar sesión',
    });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.token;

    if (token) {
      await Session.deleteOne({ token });
    }

    res.json({
      success: true,
      message: 'Sesión cerrada correctamente',
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      error: 'Error al cerrar sesión',
    });
  }
};

export const logoutAll = async (req, res) => {
  try {
    // ✅ Corregido: usar authenticatedTenant o tenant
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
  } catch (error) {
    console.error('Error en logoutAll:', error);
    res.status(500).json({
      success: false,
      error: 'Error al cerrar todas las sesiones',
    });
  }
};

export const me = async (req, res) => {
  try {
    // ✅ Corregido: usar authenticatedTenant o tenant
    const tenant = req.authenticatedTenant || req.tenant;
    
    res.json({
      success: true,
      user: req.user,
      tenant: tenant,
      role: req.tenantUser?.role,
      permissions: req.tenantUser?.permissions || [],
    });
  } catch (error) {
    console.error('Error en me:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener datos del usuario',
    });
  }
};