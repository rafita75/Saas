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

    // Reemplazar con los datos validados/sanitizados por Zod
    req.body = validatedData.body || req.body;
    req.query = validatedData.query || req.query;
    req.params = validatedData.params || req.params;

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