import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateInput } from '../middlewares/validateInput';
import { createFolderSchema } from '../schemas/folders.schema';
import {
  createFolder,
  getAllFolders,
} from '../controllers/folders.controllers';

const router = Router();

router.post(
  '/folders',
  authMiddleware,
  validateInput(createFolderSchema),
  createFolder,
);

router.get('/folders/all', authMiddleware, getAllFolders);

export default router;
