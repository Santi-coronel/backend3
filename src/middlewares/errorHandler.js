import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

/**
 * Middleware centralizado de manejo de errores. Es el UNICO lugar que
 * decide el codigo de estado HTTP final de un error. Los services
 * nunca llaman a res.status(...); siempre lanzan un AppError (o un
 * error de Mongoose) y dejan que esto lo traduzca.
 */
export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ status: 'error', message: err.message });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ status: 'error', message: err.message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ status: 'error', message: 'Id invalido' });
  }

  // Error no esperado: se loguea en el servidor pero no se expone el
  // detalle interno al cliente.
  logger.error(err);
  return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
}

export function notFoundHandler(req, res) {
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
}
