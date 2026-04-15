import { Module } from '../models/Module.js';
import { ModulePlan } from '../models/ModulePlan.js';
import { TenantModule } from '../models/TenantModule.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// =============================================
// CATÁLOGO DE MÓDULOS (PÚBLICO/ADMIN)
// =============================================

/**
 * Listar todos los módulos disponibles
 * GET /api/modules
 */
export const getAllModules = asyncHandler(async (req, res) => {
  const modules = await Module.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .lean();

  res.json({
    success: true,
    modules,
  });
});

/**
 * Obtener un módulo específico con sus planes
 * GET /api/modules/:slug
 */
export const getModuleBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const module = await Module.findOne({ slug, isActive: true }).lean();
  
  if (!module) {
    return res.status(404).json({
      success: false,
      error: 'Módulo no encontrado',
    });
  }

  // Obtener planes del módulo
  const plans = await ModulePlan.find({ 
    moduleId: module._id, 
    isActive: true 
  }).sort({ sortOrder: 1 });

  res.json({
    success: true,
    module: {
      ...module,
      plans,
    },
  });
});

/**
 * Obtener los planes de un módulo
 * GET /api/modules/:slug/plans
 */
export const getModulePlans = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const module = await Module.findOne({ slug, isActive: true });
  
  if (!module) {
    return res.status(404).json({
      success: false,
      error: 'Módulo no encontrado',
    });
  }

  const plans = await ModulePlan.find({ 
    moduleId: module._id, 
    isActive: true 
  }).sort({ priceMonthly: 1 });

  res.json({
    success: true,
    plans,
  });
});

// =============================================
// MÓDULOS CONTRATADOS POR EL TENANT
// =============================================

/**
 * Listar módulos contratados por el tenant actual
 * GET /api/tenant-modules
 */
export const getTenantModules = asyncHandler(async (req, res) => {
  const tenantModules = await TenantModule.find({ 
    tenantId: req.tenant._id 
  })
    .populate('moduleId', 'name slug description icon')
    .populate('planId', 'name slug priceMonthly features limits')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    modules: tenantModules,
  });
});

/**
 * Obtener un módulo contratado específico
 * GET /api/tenant-modules/:id
 */
export const getTenantModule = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tenantModule = await TenantModule.findOne({
    _id: id,
    tenantId: req.tenant._id,
  })
    .populate('moduleId', 'name slug description icon')
    .populate('planId', 'name slug priceMonthly features limits');

  if (!tenantModule) {
    return res.status(404).json({
      success: false,
      error: 'Módulo no encontrado',
    });
  }

  res.json({
    success: true,
    module: tenantModule,
  });
});

/**
 * Contratar un nuevo módulo
 * POST /api/tenant-modules
 */
export const subscribeToModule = asyncHandler(async (req, res) => {
  const { moduleId, planId, autoRenew = true } = req.body;

  // Verificar que el módulo existe y está activo
  const module = await Module.findOne({ 
    _id: moduleId, 
    isActive: true 
  });
  
  if (!module) {
    return res.status(404).json({
      success: false,
      error: 'Módulo no encontrado o no disponible',
    });
  }

  // Verificar que el plan existe y pertenece al módulo
  const plan = await ModulePlan.findOne({ 
    _id: planId, 
    moduleId, 
    isActive: true 
  });
  
  if (!plan) {
    return res.status(404).json({
      success: false,
      error: 'Plan no encontrado o no disponible',
    });
  }

  // Verificar si ya tiene este módulo contratado
  const existingSubscription = await TenantModule.findOne({
    tenantId: req.tenant._id,
    moduleId,
  });

  if (existingSubscription) {
    return res.status(400).json({
      success: false,
      error: 'Ya tienes este módulo contratado. Puedes cambiar de plan.',
    });
  }

  // Verificar módulos requeridos
  if (module.requires && module.requires.length > 0) {
    const requiredModules = await Module.find({ 
      slug: { $in: module.requires } 
    });
    
    const requiredModuleIds = requiredModules.map(m => m._id.toString());
    
    const hasRequiredModules = await TenantModule.find({
      tenantId: req.tenant._id,
      moduleId: { $in: requiredModuleIds },
      status: 'active',
    });

    if (hasRequiredModules.length !== requiredModuleIds.length) {
      const missingSlugs = module.requires.filter(slug => 
        !hasRequiredModules.some(tm => 
          requiredModules.find(m => m.slug === slug)?._id.toString() === tm.moduleId.toString()
        )
      );
      
      return res.status(400).json({
        success: false,
        error: 'Este módulo requiere otros módulos primero',
        requiredModules: missingSlugs,
      });
    }
  }

  // Calcular fecha de expiración (1 mes)
  const startsAt = new Date();
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  // Crear suscripción
  const tenantModule = await TenantModule.create({
    tenantId: req.tenant._id,
    moduleId,
    planId,
    status: 'active', // TODO: Cambiar a 'pending' hasta que se pague
    startsAt,
    expiresAt,
    autoRenew,
  });

  // TODO: Generar factura pendiente de pago

  res.status(201).json({
    success: true,
    module: tenantModule,
    message: 'Módulo contratado. Pendiente de pago.',
  });
});

/**
 * Cambiar de plan
 * PUT /api/tenant-modules/:id/plan
 */
export const changePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { planId } = req.body;

  // Buscar suscripción
  const tenantModule = await TenantModule.findOne({
    _id: id,
    tenantId: req.tenant._id,
  });

  if (!tenantModule) {
    return res.status(404).json({
      success: false,
      error: 'Suscripción no encontrada',
    });
  }

  // Verificar que el plan existe y pertenece al módulo
  const plan = await ModulePlan.findOne({ 
    _id: planId, 
    moduleId: tenantModule.moduleId, 
    isActive: true 
  });
  
  if (!plan) {
    return res.status(404).json({
      success: false,
      error: 'Plan no encontrado o no disponible',
    });
  }

  // Actualizar plan
  tenantModule.planId = planId;
  await tenantModule.save();

  // TODO: Calcular prorrateo y generar factura

  res.json({
    success: true,
    module: tenantModule,
    message: 'Plan actualizado correctamente',
  });
});

/**
 * Cancelar suscripción a un módulo
 * DELETE /api/tenant-modules/:id
 */
export const cancelSubscription = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tenantModule = await TenantModule.findOne({
    _id: id,
    tenantId: req.tenant._id,
  });

  if (!tenantModule) {
    return res.status(404).json({
      success: false,
      error: 'Suscripción no encontrada',
    });
  }

  // Verificar que no haya módulos que dependan de este
  const dependentModules = await Module.find({
    requires: tenantModule.moduleId.toString(),
    isActive: true,
  });

  if (dependentModules.length > 0) {
    const dependentSubscriptions = await TenantModule.find({
      tenantId: req.tenant._id,
      moduleId: { $in: dependentModules.map(m => m._id) },
      status: 'active',
    });

    if (dependentSubscriptions.length > 0) {
      const dependentNames = dependentModules.map(m => m.name).join(', ');
      return res.status(400).json({
        success: false,
        error: `No puedes cancelar este módulo porque los siguientes módulos lo requieren: ${dependentNames}`,
      });
    }
  }

  // Marcar como cancelado (no se elimina para mantener historial)
  tenantModule.status = 'canceled';
  tenantModule.canceledAt = new Date();
  tenantModule.autoRenew = false;
  await tenantModule.save();

  res.json({
    success: true,
    message: 'Suscripción cancelada correctamente',
  });
});

/**
 * Reactivar suscripción cancelada
 * POST /api/tenant-modules/:id/reactivate
 */
export const reactivateSubscription = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tenantModule = await TenantModule.findOne({
    _id: id,
    tenantId: req.tenant._id,
    status: 'canceled',
  });

  if (!tenantModule) {
    return res.status(404).json({
      success: false,
      error: 'Suscripción no encontrada o no está cancelada',
    });
  }

  // Calcular nueva fecha de expiración
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  tenantModule.status = 'active';
  tenantModule.canceledAt = null;
  tenantModule.startsAt = new Date();
  tenantModule.expiresAt = expiresAt;
  tenantModule.autoRenew = true;
  await tenantModule.save();

  res.json({
    success: true,
    module: tenantModule,
    message: 'Suscripción reactivada correctamente',
  });
});