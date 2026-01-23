import { Router } from 'express';

import { authMiddleware } from '../middlewares/authMiddleware';
import { validateParam } from '../middlewares/validateParam';
import { validateInput } from '../middlewares/validateInput';

import {
  addGroupToFileSchema,
  getFilePermissionsSchema,
  removeGroupToFileSchema,
} from '../schemas/groupFiles.schema';

import {
  addGroupToFile,
  getFilePermissions,
  removeGroupToFile,
} from '../controllers/groupFiles.controllers';

const router = Router();

router.get(
  '/file-permissions/:fileId',
  authMiddleware,
  validateParam(getFilePermissionsSchema),
  getFilePermissions,
);

router.post(
  '/group-files',
  authMiddleware,
  validateInput(addGroupToFileSchema),
  addGroupToFile,
);

router.delete(
  '/group-files/:groupId/:fileId',
  authMiddleware,
  validateParam(removeGroupToFileSchema),
  removeGroupToFile,
);

export default router;
