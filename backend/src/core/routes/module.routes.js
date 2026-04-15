import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { tenantResolver, validateTenantAccess } from '../middleware/tenant.middleware.js';
import {
  getAllModules,
  getModuleBySlug,
  getModulePlans,
  getTenantModules,
  getTenantModule,
  subscribeToModule,
  changePlan,
  cancelSubscription,
  reactivateSubscription,
} from '../controllers/module.controller.js';

const router = Router();

// =============================================
// RUTAS PÚBLICAS (Catálogo de módulos)
// =============================================
router.get('/', getAllModules);

// ✅ IMPORTANTE: Las rutas específicas DEBEN ir antes que las dinámicas
// Rutas de tenant (específicas) - ANTES de /:slug
router.get('/tenant/me', 
  authMiddleware, 
  tenantResolver, 
  validateTenantAccess, 
  getTenantModules
);

router.get('/tenant/:id', 
  authMiddleware, 
  tenantResolver, 
  validateTenantAccess, 
  getTenantModule
);

router.post('/tenant', 
  authMiddleware, 
  tenantResolver, 
  validateTenantAccess, 
  subscribeToModule
);

router.put('/tenant/:id/plan', 
  authMiddleware, 
  tenantResolver, 
  validateTenantAccess, 
  changePlan
);

router.delete('/tenant/:id', 
  authMiddleware, 
  tenantResolver, 
  validateTenantAccess, 
  cancelSubscription
);

router.post('/tenant/:id/reactivate', 
  authMiddleware, 
  tenantResolver, 
  validateTenantAccess, 
  reactivateSubscription
);

// ✅ Rutas dinámicas con :slug - DEBEN IR AL FINAL
router.get('/:slug', getModuleBySlug);
router.get('/:slug/plans', getModulePlans);

export default router;