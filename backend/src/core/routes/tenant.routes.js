import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware.js';
import { tenantResolver, requireTenant } from '../middleware/tenant.middleware.js';
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

// Obtener todos los tenants del usuario (no requiere tenant específico)
router.get('/', authMiddleware, getMyTenants);

// Rutas que requieren tenant resuelto por slug
router.get('/:slug', tenantResolver, requireTenant, getTenant);

// Rutas protegidas para gestión del tenant
router.put('/:slug', authMiddleware, tenantResolver, requireTenant, roleMiddleware(['owner', 'admin']), updateTenant);

// Gestión de miembros
router.get('/:slug/members', authMiddleware, tenantResolver, requireTenant, getMembers);
router.post('/:slug/invite', authMiddleware, tenantResolver, requireTenant, roleMiddleware(['owner', 'admin']), inviteUser);
router.put('/:slug/members/:userId', authMiddleware, tenantResolver, requireTenant, roleMiddleware(['owner']), updateMemberRole);
router.delete('/:slug/members/:userId', authMiddleware, tenantResolver, requireTenant, roleMiddleware(['owner', 'admin']), removeMember);

export default router;