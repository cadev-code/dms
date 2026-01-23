import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateInput } from '../middlewares/validateInput';
import {
  addUserToGroupSchema,
  getGroupMembersSchema,
  removeUserFromGroupSchema,
} from '../schemas/userGroups.schema';
import {
  addUserToGroup,
  getGroupMembers,
  removeUserFromGroup,
} from '../controllers/userGroups.controllers';
import { validateParam } from '../middlewares/validateParam';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

router.get(
  '/group-members/:groupId',
  authMiddleware,
  validateParam(getGroupMembersSchema),
  getGroupMembers,
);

router.post(
  '/user-groups',
  authMiddleware,
  requireRole(['SUPER_ADMIN', 'CONTENT_ADMIN']),
  validateInput(addUserToGroupSchema),
  addUserToGroup,
);

router.delete(
  '/user-groups/:groupId/:userId',
  authMiddleware,
  requireRole(['SUPER_ADMIN', 'CONTENT_ADMIN']),
  validateParam(removeUserFromGroupSchema),
  removeUserFromGroup,
);

export default router;
