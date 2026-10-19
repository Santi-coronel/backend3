/**
 * Error de aplicacion centralizado. Los services lanzan instancias de
 * esta clase (via los helpers de abajo) en lugar de responder
 * directamente con res.status(...).json(...). El errorHandler
 * (middleware) es el unico lugar que traduce esto a una respuesta
 * HTTP real.
 */
export class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

export const BadRequest = (message) => new AppError(message, 400, 'BAD_REQUEST');
export const Unauthorized = (message = 'No autenticado') =>
  new AppError(message, 401, 'UNAUTHORIZED');
export const Forbidden = (message = 'No tenes permisos para esta accion') =>
  new AppError(message, 403, 'FORBIDDEN');
export const NotFound = (message) => new AppError(message, 404, 'NOT_FOUND');
export const Conflict = (message) => new AppError(message, 409, 'CONFLICT');
