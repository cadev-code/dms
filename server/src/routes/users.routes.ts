import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
  createUser,
  disableUser,
  enableUser,
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
  validateParam(userIdSchema),
  validateInput(resetPasswordSchema),
  resetPassword,
);

router.put(
  '/users/:userId/disable',
  authMiddleware,
  requireRole(['SUPER_ADMIN']),
  validateParam(userIdSchema),
  disableUser,
);

router.put(
  '/users/:userId/enable',
  authMiddleware,
  requireRole(['SUPER_ADMIN']),
  validateParam(userIdSchema),
  enableUser,
);

export default router;
