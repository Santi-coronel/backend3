import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { userRepository } from '../repositories/user.repository.js';
import { env } from './env.js';

/**
 * Extrae el JWT desde una cookie httpOnly llamada "currentUser" en
 * lugar del header Authorization. Si no hay cookie, devuelve null y
 * passport-jwt responde 401 automaticamente.
 */
function cookieExtractor(req) {
  return req?.cookies?.currentUser || null;
}

export function initializePassport() {
  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: env.jwtSecret,
      },
      async (payload, done) => {
        try {
          const user = await userRepository.findById(payload.id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
}
