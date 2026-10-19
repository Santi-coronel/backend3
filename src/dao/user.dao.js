import { User } from '../models/User.js';

/**
 * DAO (Data Access Object) de User.
 *
 * Este es el UNICO archivo de toda la capa de negocio (repositories,
 * services, controllers) que tiene permitido importar el modelo de
 * Mongoose directamente. El resto del codigo nunca ve un objeto
 * Mongoose "crudo": siempre pasa por aca.
 */
export const userDAO = {
  create(data) {
    return User.create(data);
  },

  findById(id) {
    return User.findById(id);
  },

  findByEmail(email) {
    return User.findOne({ email });
  },

  findAll() {
    return User.find();
  },

  updateById(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  },

  deleteById(id) {
    return User.findByIdAndDelete(id);
  },
};
