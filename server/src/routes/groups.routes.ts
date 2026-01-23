import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateInput } from '../middlewares/validateInput';
import { createGroupSchema } from '../schemas/groups.schema';
import { createGroup, getGroups } from '../controllers/groups.controllers';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

router.get('/groups', authMiddleware, getGroups);
router.post(
  '/groups',
  authMiddleware,
  requireRole(['SUPER_ADMIN']),
  validateInput(createGroupSchema),
  createGroup,
);

export default router;
