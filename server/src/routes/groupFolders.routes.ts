import { Router } from 'express';
import {
  addGroupToFolderSchema,
  removeGroupToFolderSchema,
} from '../schemas/groupFolders.schema';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateParam } from '../middlewares/validateParam';
import { validateInput } from '../middlewares/validateInput';
import {
  addGroupToFolder,
  getFolderPermissions,
  removeGroupToFolder,
} from '../controllers/groupFolders.controllers';

const router = Router();

router.get('/folder-permissions', authMiddleware, getFolderPermissions);

router.post(
  '/group-folders',
  authMiddleware,
  validateInput(addGroupToFolderSchema),
  addGroupToFolder,
);

router.delete(
  '/group-folders/:groupId/:folderId',
  authMiddleware,
  validateParam(removeGroupToFolderSchema),
  removeGroupToFolder,
);

export default router;
