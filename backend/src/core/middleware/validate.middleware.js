/**
 * Middleware de validación con Zod
 * @param {import('zod').ZodSchema} schema - Esquema de validación
 */
export const validateRequest = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // ✅ La solución definitiva: NO tocar req.body, req.query o req.params nativos.
    // Guardar los datos validados en una propiedad nueva para evitar conflictos con los getters de Express.
    req.validData = validatedData;

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'Error de validación de datos',
      details: error.errors?.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
    });
  }
};