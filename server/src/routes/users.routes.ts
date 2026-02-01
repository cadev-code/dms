import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
  createUser,
  getUsers,
  resetPassword,
} from '../controllers/users.controllers';
import { validateInput } from '../middlewares/validateInput';
import {
  createUserSchema,
  resetPasswordSchema,
  userIdSchema,
} from '../schemas/users.schema';
import { requireRole } from '../middlewares/requireRole';
import { validateRole } from '../middlewares/validateRole';
import { validateParam } from '../middlewares/validateParam';

const router = Router();

router.get('/users', authMiddleware, requireRole(['SUPER_ADMIN']), getUsers);
router.post(
  '/users',
  authMiddleware,
  requireRole(['SUPER_ADMIN']),
  validateInput(createUserSchema),
  createUser,
);

router.put(
  '/users/:userId/reset-password',
  authMiddleware,
  validateRole('SUPER_ADMIN'),
  validateParam(userIdSchema),
  validateInput(resetPasswordSchema),
  resetPassword,
);

export default router;
