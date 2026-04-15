import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { validatePasswordStrength } from '../utils/password.js';
import { asyncHandler } from '../middleware/error.middleware.js';

/**
 * Obtener perfil del usuario autenticado
 * GET /api/users/me
 */
export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

/**
 * Actualizar perfil
 * PUT /api/users/me
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, avatar } = req.body;

  const updateData = {};
  if (fullName) updateData.fullName = fullName;
  if (avatar) updateData.avatar = avatar;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true }
  ).select('-password');

  res.json({
    success: true,
    user,
  });
});

/**
 * Cambiar contraseña
 * POST /api/users/change-password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // ✅ Validar que newPassword existe
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        error: 'La nueva contraseña es requerida',
      });
    }

    const user = await User.findById(req.user._id);
    
    // ✅ Validar currentPassword
    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña actual es requerida',
      });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'La contraseña actual es incorrecta',
      });
    }

    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Contraseña débil',
        details: passwordValidation.errors,
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // ✅ Invalidar todas las sesiones (opcional - por seguridad)
    // await Session.deleteMany({ userId: user._id });

    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente',
    });
  } catch (error) {
    console.error('Error en changePassword:', error);
    res.status(500).json({
      success: false,
      error: 'Error al cambiar la contraseña',
    });
  }
};