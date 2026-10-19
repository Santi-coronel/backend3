import { userRepository } from '../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';
import { BadRequest, Unauthorized, Conflict, NotFound } from '../utils/AppError.js';
import { ROLES } from '../constants/index.js';

export const userService = {
  /**
   * Registro publico. Nunca acepta "role" desde el body: todo usuario
   * que se registra por esta ruta entra como ROLES.USER. La unica
   * forma de tener otro rol es que un admin lo cambie despues (fuera
   * del alcance de esta entrega, pero la regla se respeta aca).
   */
  async register({ first_name, last_name, email, password }) {
    if (!first_name || !last_name || !email || !password) {
      throw BadRequest('first_name, last_name, email y password son obligatorios');
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw Conflict('Ya existe un usuario registrado con ese email');
    }

    const hashedPassword = await hashPassword(password);

    const user = await userRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: ROLES.USER,
    });

    return user;
  },

  async login({ email, password }) {
    if (!email || !password) {
      throw BadRequest('email y password son obligatorios');
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw Unauthorized('Credenciales invalidas');
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw Unauthorized('Credenciales invalidas');
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role });

    return { user, token };
  },

  async getAllUsers() {
    return userRepository.findAll();
  },

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw NotFound('Usuario no encontrado');
    }
    return user;
  },
};
