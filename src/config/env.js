import dotenv from 'dotenv';

dotenv.config();

/**
 * Lista de variables de entorno obligatorias para que la aplicacion
 * pueda arrancar de forma segura. Si falta alguna, el proceso no debe
 * iniciar: es mejor fallar rapido y de forma clara que arrancar en un
 * estado invalido (por ejemplo, sin JWT_SECRET).
 */
const REQUIRED_VARS = ['MONGO_URL', 'JWT_SECRET'];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Faltan variables de entorno obligatorias: ${missing.join(', ')}. ` +
        'Revisa tu archivo .env (podes basarte en .env.example).',
    );
  }
}

validateEnv();

/**
 * Objeto centralizado de configuracion. Todo el resto del codigo debe
 * leer la configuracion desde aca (import { env } from '../config/env.js')
 * en lugar de acceder a process.env directamente en cada archivo.
 */
export const env = Object.freeze({
  port: Number(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
});
