import { Router } from 'express';
import {
  addGroupToFolderSchema,
  getFolderPermissionsSchema,
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
import { requireRole } from '../middlewares/requireRole';

const router = Router();

router.get(
  '/folder-permissions/:folderId',
  authMiddleware,
  validateParam(getFolderPermissionsSchema),
  getFolderPermissions,
);

router.post(
  '/group-folders',
  authMiddleware,
  requireRole(['SUPER_ADMIN', 'CONTENT_ADMIN']),
  validateInput(addGroupToFolderSchema),
  addGroupToFolder,
);

router.delete(
  '/group-folders/:groupId/:folderId',
  authMiddleware,
  requireRole(['SUPER_ADMIN', 'CONTENT_ADMIN']),
  validateParam(removeGroupToFolderSchema),
  removeGroupToFolder,
);

export default router;
