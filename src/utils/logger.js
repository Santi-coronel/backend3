/**
 * Logger minimo centralizado. Evita console.log sueltos por todo el
 * codigo: cualquier log pasa por aca, lo que facilita reemplazar la
 * implementacion (por ejemplo por winston) sin tocar el resto de la app.
 */
export const logger = {
  info: (...args) => console.log('[INFO]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
};
