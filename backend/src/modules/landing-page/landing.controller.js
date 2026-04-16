import { LandingPage } from '../../core/models/LandingPage.js';
import { TenantModule } from '../../core/models/TenantModule.js';
import { asyncHandler } from '../../core/middleware/error.middleware.js';

/**
 * Listar todas las landing pages del tenant
 */
export const getLandings = asyncHandler(async (req, res) => {
  const landings = await LandingPage.find({ 
    tenantId: req.tenant._id,
    isActive: true 
  }).sort({ createdAt: -1 });

  res.json({ success: true, landings });
});

/**
 * Obtener una landing page pública por path y tenant
 */
export const getLandingByPath = asyncHandler(async (req, res) => {
  const { path } = req.params;
  const tenant = req.requestedTenant;

  if (!tenant) {
    return res.status(404).json({ success: false, error: 'Negocio no encontrado' });
  }

  // Si path es 'root', buscamos '/', si no, buscamos '/path'
  const searchPath = (path === 'root' || !path) ? '/' : `/${path}`;

  let landing = await LandingPage.findOne({ 
    tenantId: tenant._id,
    path: searchPath,
    isActive: true 
  });

  // Si no existe ninguna landing pero el path es root, enviamos una de cortesía
  if (!landing && searchPath === '/') {
    landing = {
      name: 'Inicio',
      sections: [{
        type: 'hero',
        content: {
          title: `Bienvenido a ${tenant.name}`,
          description: 'Esta es tu nueva página de inicio. Comienza a editarla desde tu panel de control.',
          ctaText: 'Saber más',
          image: ''
        }
      }]
    };
  }

  if (!landing) {
    return res.status(404).json({ success: false, error: 'Esta página aún no ha sido creada.' });
  }

  res.json({ success: true, landing });
});

/**
 * Obtener una landing page específica
 */
export const getLandingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const landing = await LandingPage.findOne({ 
    _id: id, 
    tenantId: req.tenant._id 
  });

  if (!landing) {
    return res.status(404).json({ success: false, error: 'Página no encontrada' });
  }

  res.json({ success: true, landing });
});

import { generateSlug } from '../../core/utils/slug.js';

/**
 * Crear una nueva landing page con validación de límites de plan
 */
export const createLanding = asyncHandler(async (req, res) => {
  let { name, path, sections, theme, seo } = req.body;

  // 1. Obtener límites del plan actual
  const subscription = await TenantModule.findOne({
    tenantId: req.tenant._id,
    status: 'active'
  }).populate('planId');

  if (!subscription) {
    return res.status(403).json({ success: false, error: 'No tienes una suscripción activa para este módulo' });
  }

  const maxPages = subscription.planId.limits?.maxPages || 1;

  // 2. Contar páginas actuales
  const currentPageCount = await LandingPage.countDocuments({ 
    tenantId: req.tenant._id, 
    isActive: true 
  });

  if (currentPageCount >= maxPages) {
    return res.status(403).json({ 
      success: false, 
      error: `Límite alcanzado (${maxPages} página/s). Mejora tu plan.` 
    });
  }

  // 3. Lógica inteligente de Path
  // Si no hay páginas, la primera es siempre Inicio (/)
  if (currentPageCount === 0) {
    path = '/';
  } else {
    // Generar path amigable desde el nombre si no viene uno válido
    if (!path || path === '/' || path.includes(Date.now().toString().substring(0, 5))) {
      path = `/${generateSlug(name)}`;
    }
  }

  // 4. Validar path único por tenant
  const pathExists = await LandingPage.findOne({ tenantId: req.tenant._id, path });
  if (pathExists) {
    return res.status(400).json({ success: false, error: 'Esa URL ya está en uso por otra de tus páginas.' });
  }

  // 5. Crear página
  const landing = await LandingPage.create({
    tenantId: req.tenant._id,
    name,
    path,
    sections,
    theme,
    seo
  });

  res.status(201).json({ success: true, landing });
});

/**
 * Actualizar una landing page existente
 */
export const updateLanding = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const landing = await LandingPage.findOneAndUpdate(
    { _id: id, tenantId: req.tenant._id },
    updateData,
    { new: true, runValidators: true }
  );

  if (!landing) {
    return res.status(404).json({ success: false, error: 'Página no encontrada' });
  }

  res.json({ success: true, landing });
});

/**
 * Eliminar (desactivar) una landing page
 */
export const deleteLanding = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const landing = await LandingPage.findOneAndUpdate(
    { _id: id, tenantId: req.tenant._id },
    { isActive: false },
    { new: true }
  );

  if (!landing) {
    return res.status(404).json({ success: false, error: 'Página no encontrada' });
  }

  res.json({ success: true, message: 'Página eliminada correctamente' });
});

/**
 * Obtener todas las páginas de un tenant (Público)
 */
export const getTenantPages = asyncHandler(async (req, res) => {
  const { publicSlug } = req.params;
  
  const tenant = await Tenant.findOne({ publicSlug, status: 'active' });
  if (!tenant) return res.status(404).json({ success: false, error: 'Negocio no encontrado' });

  const landings = await LandingPage.find({ 
    tenantId: tenant._id, 
    isActive: true 
  }).select('name path order').sort({ order: 1 });

  res.json({ success: true, landings });
});