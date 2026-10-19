/**
 * Constantes centralizadas de la aplicacion.
 *
 * Objetivo: que ningun controller, service, repository, dao o modelo
 * use strings "sueltos" como 'admin' o 'active' escritos a mano. En su
 * lugar, todos importan estos objetos desde un unico lugar. Esto evita:
 *  - errores de tipeo silenciosos ('activ' en vez de 'active'),
 *  - inconsistencias entre archivos,
 *  - dificultad para renombrar un estado/rol en el futuro.
 *
 * Se usa Object.freeze para que estos objetos sean inmutables en
 * tiempo de ejecucion: si alguien intenta hacer ROLES.ADMIN = 'otracosa'
 * en algun lugar del codigo, la asignacion se ignora silenciosamente
 * (o lanza error en modo estricto), en lugar de corromper la constante
 * para el resto de la aplicacion.
 */

export const ROLES = Object.freeze({
  USER: 'user',
  ADMIN: 'admin',
});

/**
 * Lista derivada de ROLES, util para validaciones (enums de Mongoose,
 * chequeos de pertenencia, etc) sin tener que volver a tipear los
 * strings.
 */
export const ROLES_LIST = Object.freeze(Object.values(ROLES));

export const PRODUCT_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
});

export const PRODUCT_STATUS_LIST = Object.freeze(Object.values(PRODUCT_STATUS));

export const PRODUCT_CATEGORIES = Object.freeze({
  ELECTRONICS: 'electronics',
  CLOTHING: 'clothing',
  HOME: 'home',
  SPORTS: 'sports',
  OTHER: 'other',
});

export const PRODUCT_CATEGORIES_LIST = Object.freeze(Object.values(PRODUCT_CATEGORIES));
