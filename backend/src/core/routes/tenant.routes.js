import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware.js';
import { tenantResolver, validateTenantAccess } from '../middleware/tenant.middleware.js';
import {
  getMyTenants,
  getTenant,
  updateTenant,
  inviteUser,
  getMembers,
  updateMemberRole,
  removeMember,
} from '../controllers/tenant.controller.js';

const router = Router();

// Rutas que no requieren tenant específico
router.get('/', authMiddleware, getMyTenants);

// ✅ Orden correcto: auth → resolver → validar acceso
router.get('/:slug', authMiddleware, tenantResolver, validateTenantAccess, getTenant);
router.put('/:slug', authMiddleware, tenantResolver, validateTenantAccess, roleMiddleware(['owner', 'admin']), updateTenant);
router.get('/:slug/members', authMiddleware, tenantResolver, validateTenantAccess, getMembers);
router.post('/:slug/invite', authMiddleware, tenantResolver, validateTenantAccess, roleMiddleware(['owner', 'admin']), inviteUser);
router.put('/:slug/members/:userId', authMiddleware, tenantResolver, validateTenantAccess, roleMiddleware(['owner']), updateMemberRole);
router.delete('/:slug/members/:userId', authMiddleware, tenantResolver, validateTenantAccess, roleMiddleware(['owner', 'admin']), removeMember);

export default router;