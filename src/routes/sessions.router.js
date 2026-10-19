import { Router } from 'express';
import { register, login, currentUser, logout } from '../controllers/session.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current', auth, currentUser);
router.post('/logout', logout);

export default router;
