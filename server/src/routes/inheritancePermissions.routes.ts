import { Router } from 'express';

import {
  applyInheritanceToTree,
  removeInheritanceToTree,
} from '../controllers/inheritancePermissions.controllers';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/requireRole';
import { validateParam } from '../middlewares/validateParam';
import { inheritancePermissionsSchema } from '../schemas/inheritancePermissions.schema';

const router = Router();

router.post(
  '/folder/:folderId/group/:groupId/inheritance',
  authMiddleware,
  requireRole(['SUPER_ADMIN']),
  validateParam(inheritancePermissionsSchema),
  applyInheritanceToTree,
);

router.delete(
  '/folder/:folderId/group/:groupId/inheritance',
  authMiddleware,
  requireRole(['SUPER_ADMIN']),
  validateParam(inheritancePermissionsSchema),
  removeInheritanceToTree,
);

export default router;
