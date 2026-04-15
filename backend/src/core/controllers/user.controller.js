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
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Verificar contraseña actual
  const user = await User.findById(req.user._id);
  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      error: 'La contraseña actual es incorrecta',
    });
  }

  // Validar fortaleza de nueva contraseña
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    return res.status(400).json({
      success: false,
      error: 'Contraseña débil',
      details: passwordValidation.errors,
    });
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Contraseña actualizada correctamente',
  });
});