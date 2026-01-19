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

const router = Router();

router.post(
  '/folders',
  authMiddleware,
  validateInput(createFolderSchema),
  createFolder,
);

router.get('/folders/all', authMiddleware, getAllFolders);

router.put(
  '/folders/:folderId',
  authMiddleware,
  validateParam(mutateFolderParamsSchema),
  validateInput(renameFolderSchema),
  renameFolder,
);

router.delete(
  '/folders/:folderId',
  authMiddleware,
  validateParam(mutateFolderParamsSchema),
  deleteFolder,
);

export default router;
