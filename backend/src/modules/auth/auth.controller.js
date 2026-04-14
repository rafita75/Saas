import { User } from './user.model.js';
import { Tenant } from '../tenant/tenant.model.js';
import { TenantUser } from '../tenant/tenant-user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const register = async (req, res) => {
  try {
    const { fullName, businessName, email, password } = req.body;
    
    console.log('📝 Registro recibido:', { fullName, businessName, email });

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Este email ya está registrado' });
    }

    // Generar slug
    let slug = generateSlug(businessName);
    
    // Verificar si el slug ya existe
    const existingTenant = await Tenant.findOne({ slug });
    if (existingTenant) {
      return res.status(400).json({ error: 'Este nombre de negocio ya está registrado' });
    }

    // ✅ Hashear contraseña manualmente
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Crear tenant
    const tenant = await Tenant.create({
      name: businessName,
      slug,
      ownerId: user._id,
    });

    // Crear relación
    await TenantUser.create({
      tenantId: tenant._id,
      userId: user._id,
      role: 'owner',
    });

    // Generar JWT
    const token = jwt.sign(
      { userId: user._id, tenantId: tenant._id, slug: tenant.slug },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Usuario registrado:', email);

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
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ error: 'Error al crear la cuenta: ' + error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Obtener tenant del usuario
    const tenantUser = await TenantUser.findOne({ userId: user._id }).populate('tenantId');
    if (!tenantUser) {
      return res.status(404).json({ error: 'No se encontró un negocio asociado' });
    }

    const tenant = tenantUser.tenantId;

    // Generar JWT
    const token = jwt.sign(
      { userId: user._id, tenantId: tenant._id, slug: tenant.slug },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
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
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};