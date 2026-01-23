import { Router } from 'express';
import { addGroupToFolderSchema } from '../schemas/groupFolders.schema';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateInput } from '../middlewares/validateInput';
import {
  addGroupToFolder,
  getFolderPermissions,
} from '../controllers/groupFolders.controllers';

const router = Router();

router.get('/folder-permissions', authMiddleware, getFolderPermissions);

router.post(
  '/group-folders',
  authMiddleware,
  validateInput(addGroupToFolderSchema),
  addGroupToFolder,
);

export default router;
