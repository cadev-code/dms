import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateInput } from '../middlewares/validateInput';
import { addGroupToFolder } from '../controllers/groupFolders.controllers';
import { addGroupToFolderSchema } from '../schemas/groupFolders.schema';

const router = Router();

router.post(
  '/group-folders',
  authMiddleware,
  validateInput(addGroupToFolderSchema),
  addGroupToFolder,
);

export default router;
