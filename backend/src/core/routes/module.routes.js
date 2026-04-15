import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { tenantResolver, requireTenant } from '../middleware/tenant.middleware.js';
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
router.get('/:slug', getModuleBySlug);
router.get('/:slug/plans', getModulePlans);

// =============================================
// RUTAS PROTEGIDAS (Suscripciones del tenant)
// =============================================
router.use(authMiddleware);
router.use(tenantResolver);
router.use(requireTenant);

// Módulos contratados por el tenant
router.get('/tenant/me', getTenantModules);
router.get('/tenant/:id', getTenantModule);

// Gestionar suscripciones
router.post('/tenant', subscribeToModule);
router.put('/tenant/:id/plan', changePlan);
router.delete('/tenant/:id', cancelSubscription);
router.post('/tenant/:id/reactivate', reactivateSubscription);

export default router;