/**
 * Middleware de autorizacion por rol (403). Se usa SIEMPRE despues de
 * auth, nunca solo. auth responde si no hay sesion valida; authorize
 * responde si la sesion es valida pero el rol no alcanza.
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'No autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'No tenes permisos para realizar esta accion',
      });
    }

    next();
  };
}
