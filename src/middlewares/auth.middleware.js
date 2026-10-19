import passport from 'passport';

/**
 * Middleware de autenticacion (401). Verifica el JWT via Passport y,
 * si es valido, setea req.user con el usuario autenticado.
 */
export function auth(req, res, next) {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    if (error) return next(error);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'No autenticado' });
    }
    req.user = user;
    next();
  })(req, res, next);
}
