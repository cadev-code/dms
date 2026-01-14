import { RequestHandler, Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { uploadMiddleware } from '../middlewares/uploadMiddleware';
import { validateInput } from '../middlewares/validateInput';
import { filesParamSchema, uploadFileSchema } from '../schemas/files.schema';
import { validateParam } from '../middlewares/validateParam';
import {
  getAllFiles,
  getFilesByType,
  uploadFile,
} from '../controllers/files.controllers';

const router = Router();

router.post(
  '/files',
  authMiddleware,
  uploadMiddleware({
    fieldName: 'file',
    allowedMimeTypes: [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
  }) as RequestHandler,
  validateInput(uploadFileSchema),
  uploadFile,
);

router.get('/files/all', authMiddleware, getAllFiles);

router.get(
  '/files/:type',
  authMiddleware,
  validateParam(filesParamSchema),
  getFilesByType,
);

export default router;
