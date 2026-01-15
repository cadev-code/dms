import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateInput } from '../middlewares/validateInput';
import { createFolderSchema } from '../schemas/folders.schema';
import { createFolder } from '../controllers/folders.controllers';

const router = Router();

router.post(
  '/folders',
  authMiddleware,
  validateInput(createFolderSchema),
  createFolder,
);

export default router;
