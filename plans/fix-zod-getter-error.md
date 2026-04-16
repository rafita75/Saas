# Plan de Corrección: Solución a Error de Validación Zod (Getter Express)

## 1. Background & Motivation
Tras implementar la validación estricta con Zod en la fase anterior, el servidor Express está arrojando el error `Cannot set property query of #<IncomingMessage> which has only a getter` durante los procesos de inicio de sesión y registro (error 500). Esto ocurre porque el middleware `validateRequest` intenta reasignar directamente `req.query` y `req.params`, los cuales en las versiones recientes de Express son definidos como propiedades de solo lectura (getters) dentro del objeto de la petición (`IncomingMessage`).

## 2. Scope & Impact
**Impacto Esperado:**
- Restaurar la funcionalidad completa de registro y login (actualmente bloqueadas por el error 500).
- Asegurar que la validación de Zod siga funcionando correctamente sin romper la estructura interna de Express.

**Archivos Clave Afectados:**
- `backend/src/core/middleware/validate.middleware.js`

## 3. Proposed Solution
Modificaremos el middleware `validateRequest` para que, en lugar de usar una asignación directa (`req.query = ...`), utilice `Object.defineProperty` para sobrescribir el getter de Express de forma segura, permitiendo inyectar los datos sanitizados por Zod. Adicionalmente, solo intentaremos sobrescribir propiedades (body, query, params) si estas fueron explícitamente validadas y devueltas por el esquema de Zod.

## 4. Alternatives Considered
- *No sanitizar req.query/req.params:* En lugar de reemplazar el objeto, podríamos simplemente validar y dejar el objeto original. Sin embargo, esto perdería la ventaja principal de Zod, que es la sanitización y transformación de tipos (ej. convertir strings a números o eliminar campos no definidos en el esquema). Sobrescribir de forma segura es la mejor opción.

## 5. Phased Implementation Plan

### Fase 1: Corrección del Middleware de Validación
-   Abrir `backend/src/core/middleware/validate.middleware.js`.
-   Reemplazar la asignación directa:
    ```javascript
    // Código actual que falla
    req.body = validatedData.body || req.body;
    req.query = validatedData.query || req.query;
    req.params = validatedData.params || req.params;
    ```
-   Por una asignación segura:
    ```javascript
    // Nuevo código
    if (validatedData.body) req.body = validatedData.body;
    
    if (validatedData.query) {
      Object.defineProperty(req, 'query', {
        value: validatedData.query,
        writable: true,
        enumerable: true,
        configurable: true
      });
    }
    
    if (validatedData.params) {
      Object.defineProperty(req, 'params', {
        value: validatedData.params,
        writable: true,
        enumerable: true,
        configurable: true
      });
    }
    ```

## 6. Verification & Testing
-   Reiniciar el servidor backend.
-   Intentar iniciar sesión desde el frontend. Debe funcionar correctamente devolviendo un 200 OK y redirigiendo al dashboard o selector de tenant.
-   Intentar registrar un nuevo usuario. Debe funcionar y crear el tenant transaccionalmente.

## 7. Migration & Rollback
-   No se requiere migración de datos. El rollback consistiría simplemente en comentar el uso de `validateRequest` en `auth.routes.js` temporalmente si esta solución no resolviera el problema de raíz.