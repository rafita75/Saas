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
    
    // Para query y params, mutamos el objeto original en lugar de reasignarlo
    // Esto evita el error de "only a getter" al no disparar el setter de Express
    if (validatedData.query && req.query) {
      Object.keys(req.query).forEach(key => delete req.query[key]);
      Object.assign(req.query, validatedData.query);
    }
    
    if (validatedData.params && req.params) {
      Object.keys(req.params).forEach(key => delete req.params[key]);
      Object.assign(req.params, validatedData.params);
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