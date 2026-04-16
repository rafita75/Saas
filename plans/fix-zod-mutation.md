# Plan de Corrección Definitivo: Error de Setter de Express (Zod)

## 1. Background & Motivation
A pesar de la corrección anterior con `Object.defineProperty`, el entorno de producción (Render) sigue arrojando el error `Cannot set property query of #<IncomingMessage> which has only a getter`. Esto indica que la propiedad `query` en Express es estrictamente no-configurable en el prototipo base del objeto `IncomingMessage` subyacente. Para poder inyectar los datos validados por Zod sin intentar "redefinir" o "reasignar" la propiedad en sí misma (lo que dispara el error), debemos optar por mutar el objeto que devuelve el getter en lugar de reemplazarlo.

## 2. Scope & Impact
**Impacto Esperado:**
- Eliminar de raíz el error 500 de "only a getter" al no interactuar con los setters de Express.
- Mantener la sanitización de Zod funcional (eliminando campos no definidos y aplicando coerciones de tipo).

**Archivos Clave Afectados:**
- `backend/src/core/middleware/validate.middleware.js`

## 3. Proposed Solution
El enfoque más seguro en Express para middlewares que necesitan sanitizar o transformar `req.query` o `req.params` sin romper el objeto Request es **vaciar las claves del objeto actual** y **asignarle las nuevas propiedades**. Esto muta el objeto en memoria sin tocar la propiedad del prototipo de Express.

```javascript
// En lugar de:
// Object.defineProperty(req, 'query', ...) 
// o req.query = ...

// Haremos esto (mutación in-place):
if (validatedData.query && req.query) {
  Object.keys(req.query).forEach(key => delete req.query[key]);
  Object.assign(req.query, validatedData.query);
}
```

## 4. Alternatives Considered
- Usar un objeto diferente en `req`, por ejemplo `req.validatedData = validatedData`. Sin embargo, esto requeriría reescribir todos los controladores para que en lugar de leer de `req.body` o `req.query` leyeran del nuevo objeto. Múltiples librerías asumen que los datos están en sus lugares originales.

## 5. Phased Implementation Plan

### Fase 1: Refactorización a Mutación (In-Place)
- Abrir `backend/src/core/middleware/validate.middleware.js`.
- Eliminar el uso de `Object.defineProperty`.
- Aplicar la técnica de mutación in-place usando `Object.keys` y `Object.assign` tanto para `query` como para `params`. `req.body` sigue siendo seguro de reasignar.

## 6. Verification & Testing
- Desplegar nuevamente a producción. El error no se volverá a presentar en `req.query` o `req.params`.

## 7. Migration & Rollback
- No es necesario. Esta es la práctica estándar en Express para este tipo de middlewares.