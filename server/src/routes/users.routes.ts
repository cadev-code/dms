import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createUser, getUsers } from '../controllers/users.controllers';
import { validateInput } from '../middlewares/validateInput';
import { createUserSchema } from '../schemas/users.schema';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

router.get('/users', authMiddleware, requireRole(['SUPER_ADMIN']), getUsers);
router.post(
  '/users',
  authMiddleware,
  requireRole(['SUPER_ADMIN']),
  validateInput(createUserSchema),
  createUser,
);

export default router;
