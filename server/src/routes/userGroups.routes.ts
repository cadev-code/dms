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
  validateInput(addUserToGroupSchema),
  addUserToGroup,
);

router.delete(
  '/user-groups/:groupId/:userId',
  authMiddleware,
  validateParam(removeUserFromGroupSchema),
  removeUserFromGroup,
);

export default router;
