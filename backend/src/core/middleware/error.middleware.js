/**
 * Middleware para rutas no encontradas (404)
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware global de manejo de errores
 */
export const errorHandler = (err, req, res, next) => {
  // Si el error tiene código de estado, usarlo; si no, 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    error: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

/**
 * Wrapper para manejar excepciones asíncronas en controladores
 * Evita tener que usar try/catch en cada controlador
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
