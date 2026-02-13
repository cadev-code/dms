import { Router } from 'express';

import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/requireRole';
import { validateInput } from '../middlewares/validateInput';
import { validateParam } from '../middlewares/validateParam';

import { groupIdSchema, groupSchema } from '../schemas/groups.schema';

import {
  createGroup,
  deleteGroup,
  getGroups,
  updateGroup,
} from '../controllers/groups.controllers';

const router = Router();

router.get('/groups', authMiddleware, getGroups);

router.post(
  '/groups',
  authMiddleware,
  requireRole(['SUPER_ADMIN']),
  validateInput(groupSchema),
  createGroup,
);

router.put(
  '/groups/:groupId',
  authMiddleware,
  validateParam(groupIdSchema),
  validateInput(groupSchema),
  requireRole(['SUPER_ADMIN']),
  updateGroup,
);

router.delete(
  '/groups/:groupId',
  authMiddleware,
  validateParam(groupIdSchema),
  requireRole(['SUPER_ADMIN']),
  deleteGroup,
);

export default router;
