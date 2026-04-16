# Plan de Remediación y Mejoras: Arquitectura Multi-Tenant

## 1. Background & Motivation
El proyecto actualmente presenta fallos críticos en el entorno de desarrollo local relacionados con la resolución de subdominios y el enrutamiento HTTP/HTTPS. Además, la arquitectura de autenticación actual limita a los usuarios a un solo "negocio" (tenant) al momento de iniciar sesión, lo cual rompe la experiencia para dueños o empleados de múltiples tiendas. Finalmente, hay deuda técnica en seguridad (CORS, fugas de datos de tenants) y rendimiento (consultas excesivas a BD en middleware).

## 2. Scope & Impact
**Impacto Esperado:**
- Soporte completo para desarrollo local con subdominios (ej. `tienda1.localhost:5173`).
- Los usuarios podrán pertenecer a múltiples tiendas y cambiar entre ellas sin volver a iniciar sesión.
- Mayor seguridad en la separación de datos por negocio.
- Mejor rendimiento en el middleware de autenticación.

**Archivos Clave Afectados:**
- `frontend/src/config/domains.js`
- `backend/src/core/middleware/tenant.middleware.js`
- `backend/src/core/middleware/auth.middleware.js`
- `backend/src/core/controllers/auth.controller.js`
- `frontend/src/core/auth/pages/Login.jsx`
- Componentes de navegación (Sidebar, etc.) para el selector de tiendas.
- `backend/app.js` (CORS)

## 3. Proposed Solution

Hemos optado por un enfoque de **Portal Central / Switcher**:
1. El usuario inicia sesión y obtiene un token "global" y su lista de tiendas.
2. Si tiene múltiples tiendas, ve una pantalla de selección (`/select-tenant`).
3. Al seleccionar o navegar a un subdominio, el middleware valida dinámicamente si el usuario pertenece a ese `req.requestedTenant` en lugar de depender de un `tenantId` estático en el token.

## 4. Alternatives Considered
*Login por subdominio:* Requerir que el usuario inicie sesión específicamente en `tienda.jgsystemsgt.com`. Fue descartado por el usuario porque requiere múltiples inicios de sesión para usuarios compartidos, empeorando la experiencia de usuario (UX).

## 5. Phased Implementation Plan

### Fase 1: Corrección de Entorno Local
- **Frontend (`domains.js`):** Ajustar la lógica para que en desarrollo local no fuerce el uso de `https://` y soporte correctamente `http://localhost:5173`.
- **Backend (`tenant.middleware.js`):** Modificar la lógica de partición de host `hostname.split('.')` para que detecte correctamente subdominios locales aunque solo tengan 2 partes (ej. `tienda.localhost:5173`).

### Fase 2: Refactorización Multi-Tienda (Portal Central)
- **Backend Auth:** Modificar `login` en `auth.controller.js` para que devuelva un token global (sin `tenantId` estricto) o emita un token temporal, junto con el array de tiendas del usuario.
- **Frontend Login:** Actualizar `Login.jsx` para gestionar el array de tiendas. Si hay más de una tienda, redirigir a un nuevo componente `SelectTenant.jsx`. Si hay una sola, redirigir al subdominio correspondiente.
- **Backend Middleware:** Actualizar `validateTenantAccess` para verificar contra la tabla `TenantUser` si el usuario de la sesión tiene acceso al `requestedTenant` en la URL actual.
- **Frontend Switcher:** Añadir un componente "Selector de Negocios" en el Sidebar del dashboard.

### Fase 3: Seguridad y Calidad de Código
- **CORS (`app.js`):** Reemplazar `endsWith` por una validación de expresiones regulares más robusta.
- **Integridad Referencial:** Añadir lógica para que al eliminar un Tenant o Usuario, se eliminen los registros huérfanos en `TenantUser`.
- **Manejo de Errores:** Envolver todos los controladores en `asyncHandler` para evitar inconsistencias con `try/catch`.
- **Invitaciones:** Simular o integrar el envío de emails en `inviteUser`.

### Fase 4: Optimización de Rendimiento
- **Caché en Middleware:** Implementar un sistema de caché (Redis o en memoria) en `authMiddleware` para reducir las 4-5 consultas a MongoDB que ocurren en cada petición protegida.

## 6. Verification & Testing
- Probar inicio de sesión local con un usuario en 1 tienda (redirección directa).
- Probar inicio de sesión local con un usuario en 2 tiendas (pantalla de selección).
- Navegar entre subdominios locales (`tienda1.localhost:5173` -> `tienda2.localhost:5173`) validando que la sesión se mantiene si se tiene acceso, o lanza un error 403 si no.
- Probar peticiones CORS inválidas.

## 7. Migration & Rollback
- **Migración:** No requiere cambios estructurales en los esquemas de MongoDB, solo actualización de lógica en Controladores y Middlewares.
- **Rollback:** Restaurar los archivos del commit anterior al refactor de autenticación en caso de fallas críticas.