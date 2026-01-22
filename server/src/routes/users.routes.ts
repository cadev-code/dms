import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createUser, getUsers } from '../controllers/users.controllers';
import { validateInput } from '../middlewares/validateInput';
import { createUserSchema } from '../schemas/users.schema';

const router = Router();

router.get('/users', authMiddleware, getUsers);
router.post(
  '/users',
  authMiddleware,
  validateInput(createUserSchema),
  createUser,
);

export default router;
