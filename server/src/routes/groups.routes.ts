import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateInput } from '../middlewares/validateInput';
import { createGroupSchema } from '../schemas/groups.schema';
import { createGroup } from '../controllers/groups.controllers';

const router = Router();

router.post(
  '/groups',
  authMiddleware,
  validateInput(createGroupSchema),
  createGroup,
);

export default router;
