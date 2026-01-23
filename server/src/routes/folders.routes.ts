import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateInput } from '../middlewares/validateInput';
import {
  createFolderSchema,
  mutateFolderParamsSchema,
  renameFolderSchema,
} from '../schemas/folders.schema';
import {
  createFolder,
  deleteFolder,
  getAllFolders,
  renameFolder,
} from '../controllers/folders.controllers';
import { validateParam } from '../middlewares/validateParam';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

router.post(
  '/folders',
  authMiddleware,
  requireRole(['SUPER_ADMIN', 'CONTENT_ADMIN']),
  validateInput(createFolderSchema),
  createFolder,
);

router.get('/folders/all', authMiddleware, getAllFolders);

router.put(
  '/folders/:folderId',
  authMiddleware,
  requireRole(['SUPER_ADMIN', 'CONTENT_ADMIN']),
  validateParam(mutateFolderParamsSchema),
  validateInput(renameFolderSchema),
  renameFolder,
);

router.delete(
  '/folders/:folderId',
  authMiddleware,
  requireRole(['SUPER_ADMIN', 'CONTENT_ADMIN']),
  validateParam(mutateFolderParamsSchema),
  deleteFolder,
);

export default router;
