import { userDAO } from '../dao/user.dao.js';

/**
 * Repository de User: ofrece metodos con nombres de dominio
 * (findByEmail, registerUser) en lugar de operaciones genericas de
 * base de datos. El service solo conoce esta interfaz, nunca el DAO
 * ni el modelo de Mongoose.
 */
export const userRepository = {
  create(data) {
    return userDAO.create(data);
  },

  findById(id) {
    return userDAO.findById(id);
  },

  findByEmail(email) {
    return userDAO.findByEmail(email);
  },

  findAll() {
    return userDAO.findAll();
  },

  updateById(id, data) {
    return userDAO.updateById(id, data);
  },

  deleteById(id) {
    return userDAO.deleteById(id);
  },
};
