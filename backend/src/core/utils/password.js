/**
 * Valida la fortaleza de una contraseña
 * @param {string} password - Contraseña a validar
 * @returns {Object} { isValid, errors }
 */
export const validatePasswordStrength = (password) => {
  const errors = [];
  
  // ✅ Validar que password existe
  if (!password || typeof password !== 'string') {
    errors.push('La contraseña es requerida');
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('Mínimo 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Debe contener al menos un número');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Debe contener al menos un símbolo (!@#$%^&*)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Calcula un puntaje de fortaleza (0-4)
 * @param {string} password - Contraseña a evaluar
 * @returns {number} Puntaje 0-4
 */
export const getPasswordStrengthScore = (password) => {
  if (!password) return 0;

  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // Normalizar a 0-4
  return Math.min(4, Math.floor(score / 1.5));
};

/**
 * Obtiene un mensaje descriptivo de la fortaleza
 * @param {number} score - Puntaje 0-4
 * @returns {string} Mensaje
 */
export const getPasswordStrengthLabel = (score) => {
  const labels = ["Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte"];
  return labels[score] || "Desconocida";
};

/**
 * Obtiene el color correspondiente al puntaje
 * @param {number} score - Puntaje 0-4
 * @returns {string} Color en formato Tailwind
 */
export const getPasswordStrengthColor = (score) => {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-emerald-500",
  ];
  return colors[score] || "bg-gray-500";
};

/**
 * Verifica si una contraseña cumple con los requisitos mínimos
 * @param {string} password - Contraseña a verificar
 * @returns {boolean} true si es válida
 */
export const isPasswordValid = (password) => {
  return password && password.length >= 8;
};
