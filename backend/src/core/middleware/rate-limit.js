import rateLimit from 'express-rate-limit';

// Rate limiting para autenticación (login/register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por IP
  message: {
    error: 'Demasiados intentos de autenticación. Por favor, inténtalo de nuevo en 15 minutos.',
    retryAfter: 15 * 60,
  },
  standardHeaders: true, // Envía headers `RateLimit-*`
  legacyHeaders: false, // Desactiva headers `X-RateLimit-*`
  skipSuccessfulRequests: false, // Cuenta también las exitosas
});

// Rate limiting para API general
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 peticiones por IP
  message: {
    error: 'Demasiadas peticiones. Por favor, reduce la velocidad.',
    retryAfter: 15 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para webhooks (más permisivo)
export const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 50, // 50 peticiones por minuto
  message: {
    error: 'Demasiadas peticiones al webhook.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para subida de archivos
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // 20 subidas por hora
  message: {
    error: 'Has alcanzado el límite de subidas. Inténtalo de nuevo en una hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});