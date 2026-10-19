import { Router } from 'express';
import { getAllUsers } from '../controllers/user.controller.js';
import { auth } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.get('/', auth, authorize(ROLES.ADMIN), getAllUsers);

export default router;
