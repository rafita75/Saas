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

    // Reemplazar solo los objetos que fueron validados (y presentes en el esquema)
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