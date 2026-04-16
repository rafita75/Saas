import { Router } from 'express';
import { authMiddleware } from '../../core/middleware/auth.middleware.js';
import { tenantResolver, validateTenantAccess } from '../../core/middleware/tenant.middleware.js';
import {
  getLandings,
  getLandingByPath, // ✅ Añadido
  getLandingById,
  createLanding,
  updateLanding,
  deleteLanding
} from './landing.controller.js';

const router = Router();

// Rutas Públicas
router.get('/public/path/:path', tenantResolver, getLandingByPath); 

// Rutas Protegidas
router.use(authMiddleware, tenantResolver, validateTenantAccess);

router.get('/', getLandings);
router.get('/:id', getLandingById);
router.post('/', createLanding);
router.put('/:id', updateLanding);
router.delete('/:id', deleteLanding);

export default router;