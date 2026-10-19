import { userService } from '../services/user.service.js';
import { toUserListDTO } from '../dto/user.dto.js';

export async function getAllUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ status: 'success', payload: toUserListDTO(users) });
  } catch (error) {
    next(error);
  }
}
