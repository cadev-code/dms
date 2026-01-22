import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateInput } from '../middlewares/validateInput';
import { addUserToGroupSchema } from '../schemas/userGroups.schema';
import { addUserToGroup } from '../controllers/userGroups.controllers';

const router = Router();

router.post(
  '/user-groups',
  authMiddleware,
  validateInput(addUserToGroupSchema),
  addUserToGroup,
);

export default router;
