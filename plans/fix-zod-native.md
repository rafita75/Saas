# Plan de Solución Final: Zod sin Modificar Objetos Nativos de Express

## 1. Background & Motivation
Los intentos de sobrescribir, redefinir o mutar directamente `req.query` y `req.params` en Express para inyectar datos validados por Zod han fallado consistentemente en el entorno de producción (Render). Express protege estos objetos con getters nativos que causan errores 500 bajo ciertas configuraciones o versiones de Node.js en la nube. 

## 2. Scope & Impact
**Impacto Esperado:**
- Eliminar completamente el conflicto entre la validación de Zod y los objetos internos de Express.
- Restaurar la funcionalidad completa de registro y login.

**Archivos Clave Afectados:**
- `backend/src/core/middleware/validate.middleware.js`
- `backend/src/core/controllers/auth.controller.js` (Solo las rutas que usan el middleware)

## 3. Proposed Solution
La solución más robusta y estándar en la industria (usada por librerías como Express-Validator) es **no tocar nunca** `req.query`, `req.params` o `req.body` originales. En su lugar, el middleware de validación inyectará los datos limpios y validados en una nueva propiedad dentro del objeto request, como por ejemplo `req.validData`. 

Luego, actualizaremos los controladores (en este caso `login` y `register`) para que lean los datos desde `req.validData.body` en lugar de `req.body`.

## 4. Alternatives Considered
- *Dejar de usar Zod:* Descartado. Perderíamos validación de tipos, coerción y sanitización, lo cual es crítico para la seguridad.
- *Usar middlewares alternativos (Joi, Express-Validator):* Todas tendrían el mismo problema si intentan sobrescribir `req.query`. El problema no es Zod, es la modificación del objeto nativo de Express.

## 5. Phased Implementation Plan

### Fase 1: Modificar el Middleware de Validación
- Abrir `backend/src/core/middleware/validate.middleware.js`.
- Eliminar toda la lógica de reasignación y mutación (`Object.defineProperty`, `Object.assign`, `delete`).
- Asignar el resultado de Zod a una nueva propiedad: `req.validData = validatedData;`

### Fase 2: Actualizar Controladores
- Abrir `backend/src/core/controllers/auth.controller.js`.
- En la función `register`, cambiar `let { fullName, ... } = req.body;` por `let { fullName, ... } = req.validData.body;`.
- En la función `login`, cambiar `let { email, password } = req.body;` por `let { email, password } = req.validData.body;`.

## 6. Verification & Testing
- Desplegar. Al intentar iniciar sesión, el middleware solo leerá los datos nativos, los pasará por Zod, y los dejará en `req.validData`. El controlador leerá de ahí, evadiendo por completo cualquier getter de Express.

## 7. Migration & Rollback
- Si este enfoque requiere actualizar muchos controladores en el futuro, es un precio pequeño a pagar por una validación totalmente estable y libre de conflictos en producción.