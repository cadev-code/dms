import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { getUsers } from '../controllers/users.controllers';

const router = Router();

router.get('/users', authMiddleware, getUsers);

export default router;
