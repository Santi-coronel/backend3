import { userService } from '../services/user.service.js';
import { toUserDTO } from '../dto/user.dto.js';
import { env } from '../config/env.js';

/**
 * Los controllers solo coordinan request/response: leen el body/params,
 * llaman al service, y traducen el resultado a una respuesta HTTP.
 * Nunca acceden a repositories, dao ni modelos directamente, y nunca
 * contienen reglas de negocio.
 */
export async function register(req, res, next) {
  try {
    const user = await userService.register(req.body);
    res.status(201).json({ status: 'success', payload: toUserDTO(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { user, token } = await userService.login(req.body);

    res.cookie('currentUser', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ status: 'success', payload: toUserDTO(user) });
  } catch (error) {
    next(error);
  }
}

export async function currentUser(req, res) {
  res.status(200).json({ status: 'success', payload: toUserDTO(req.user) });
}

export async function logout(req, res) {
  res.clearCookie('currentUser');
  res.status(200).json({ status: 'success', message: 'Sesion cerrada' });
}
