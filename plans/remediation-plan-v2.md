# Plan de Remediación y Mejoras Nivel 2: Seguridad y Rendimiento Avanzado

## 1. Background & Motivation
Tras una segunda revisión profunda de la arquitectura del proyecto, se han identificado vulnerabilidades de seguridad críticas para un entorno de producción (Inyección NoSQL y XSS) y cuellos de botella de rendimiento graves derivados de la autenticación basada en múltiples consultas de base de datos por petición. Además, la falta de un sistema estricto de validación de datos debilita la integridad de la plataforma.

## 2. Scope & Impact
**Impacto Esperado:**
- Eliminación total de vectores de inyección NoSQL al forzar la limpieza de parámetros en las URLs.
- Protección total contra el robo de sesiones mediante scripts (XSS) moviendo el JWT a Cookies HttpOnly.
- Mejora drástica del rendimiento de la API mediante la reducción del 80% del tiempo de resolución de autenticación (caché en memoria).
- Prevención de fallos silenciosos mediante validación estricta de esquemas (Zod).

**Archivos Clave Afectados:**
- **Seguridad (NoSQL/Zod):** `backend/src/core/middleware/tenant.middleware.js`, Nuevo middleware de validación `validate.middleware.js`, Controladores (`auth`, `user`, etc.)
- **Seguridad (HttpOnly Cookies):** `backend/src/core/controllers/auth.controller.js`, `frontend/src/core/auth/pages/Login.jsx`, `frontend/src/lib/api.js`.
- **Rendimiento (Caché):** `backend/src/core/middleware/auth.middleware.js`.

## 3. Proposed Solution

1.  **Sanitización y Validación con Zod:** Crear un middleware central que utilice la librería Zod para validar y sanitizar estrictamente la estructura de `req.body`, `req.params` y `req.query` antes de que toquen los controladores. Se asegurará que campos como `slug` siempre sean "strings" válidos.
2.  **Autenticación sin Estado en Cliente (HttpOnly Cookies):** El endpoint de login configurará una cookie segura (`httpOnly: true, secure: true, sameSite: 'strict'`) con el JWT en lugar de devolverlo en el JSON. El frontend Axios enviará esta cookie automáticamente (`withCredentials: true`), y eliminaremos las referencias a `localStorage.setItem('token', ...)`.
3.  **Caché en Memoria:** Se introducirá `lru-cache` en Node.js. En el `authMiddleware`, se generará una clave basada en el JWT. Si existe en caché, se asignan `req.user`, `req.authenticatedTenant` inmediatamente. Si no, se realizan las 4 consultas a MongoDB y se guardan en caché durante 5-10 minutos.

## 4. Alternatives Considered
- *Redis para Caché:* Si bien es la solución ideal a escala, añade complejidad a la infraestructura actual. `lru-cache` es suficiente para reducir drásticamente las consultas a base de datos de manera inmediata y puede sustituirse por Redis después sin afectar la lógica.
- *Express-validator / Joi:* Zod fue elegido por su integración moderna y sintaxis declarativa más cercana a TypeScript, preparándonos para una futura migración del backend a TS.

## 5. Phased Implementation Plan

### Fase 1: Prevención Inyección NoSQL y Validación
-   Instalar `zod` y `express-mongo-sanitize`.
-   Modificar `tenantResolver` en `tenant.middleware.js` para asegurar que `req.query.tenant` y `req.headers['x-tenant-slug']` sean tratados estrictamente como `String` (o sanitizados).
-   Añadir `express-mongo-sanitize` globalmente en `app.js` como capa extra de defensa.

### Fase 2: Implementación Zod
-   Crear esquemas Zod en `backend/src/core/validations/`.
-   Crear `validateRequest` middleware en `backend/src/core/middleware/`.
-   Aplicar validación en rutas clave (`auth.routes.js`, `user.routes.js`).

### Fase 3: JWT a Cookies HttpOnly
-   Instalar `cookie-parser` en el backend.
-   Modificar `login` y `register` en `auth.controller.js` para emitir `res.cookie('token', token, { httpOnly: true, secure: isProd, sameSite: 'lax' })`.
-   Actualizar `authMiddleware` para que extraiga el token prioritariamente de `req.cookies.token`.
-   Modificar `frontend/src/lib/api.js` para asegurar que `axios` use `withCredentials: true`.
-   Eliminar el guardado y extracción manual del token en `Login.jsx`, `SelectTenant.jsx` y utilidades del frontend (eliminar `localStorage.token`).

### Fase 4: Caché en Middleware de Autenticación
-   Instalar `lru-cache`.
-   Instanciar el caché en `backend/src/core/middleware/auth.middleware.js`.
-   Implementar la lógica: Si el resultado de `Session + User + Tenant + TenantUser` ya está validado para el token, recuperar de caché en O(1). Si hay un cambio de rol o cierre de sesión global (`logoutAll`), invalidar la caché para ese token/usuario.

## 6. Verification & Testing
-   **NoSQL:** Intentar inyectar en la URL `?tenant[$ne]=null` y verificar que el servidor lo rechaza como tipo inválido.
-   **HttpOnly:** Verificar en DevTools (Application > Cookies) que el JWT está marcado como `HttpOnly` y no es accesible vía `document.cookie`.
-   **Caché:** Revisar los logs o el monitor de MongoDB (o el profiler) para asegurar que múltiples recargas de página consecutivas solo disparen una única validación en BD.

## 7. Migration & Rollback
-   El cambio a cookies HttpOnly requiere invalidar todas las sesiones actuales del lado del cliente (obligar a los usuarios a reingresar).
-   Se puede revertir el `authMiddleware` a su estado anterior si la caché causa pérdida de sincronización de permisos.