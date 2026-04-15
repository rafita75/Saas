/**
 * Genera un slug a partir de un texto
 * @param {string} text - Texto a convertir
 * @returns {string} Slug generado
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD") // Separa acentos
    .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
    .replace(/[^a-z0-9\s-]/g, "") // Solo letras, números, espacios y guiones
    .replace(/\s+/g, "-") // Espacios → guiones
    .replace(/-+/g, "-") // Múltiples guiones → uno solo
    .replace(/^-|-$/g, ""); // Elimina guiones al inicio/final
};

/**
 * Verifica si un slug ya existe en la base de datos
 * @param {string} slug - Slug a verificar
 * @param {Object} Tenant - Modelo de Tenant
 * @returns {Promise<boolean>} true si existe, false si está disponible
 */
export const isSlugAvailable = async (slug, Tenant) => {
  const existing = await Tenant.findOne({ slug });
  return !existing;
};

/**
 * Genera un slug único, agregando número si ya existe
 * @param {string} baseName - Nombre base
 * @param {Object} Tenant - Modelo de Tenant
 * @returns {Promise<string>} Slug único
 */
export const generateUniqueSlug = async (baseName, Tenant) => {
  let slug = generateSlug(baseName);

  // Si está disponible, lo retornamos
  if (await isSlugAvailable(slug, Tenant)) {
    return slug;
  }

  // Si no, agregamos números hasta encontrar uno disponible
  let counter = 2;
  let uniqueSlug = `${slug}-${counter}`;

  while (!(await isSlugAvailable(uniqueSlug, Tenant))) {
    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }

  return uniqueSlug;
};
