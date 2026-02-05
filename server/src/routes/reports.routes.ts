import { Router } from 'express';
import { getReportAllDocuments } from '../controllers/reports.controllers';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

router.get(
  '/reports/all-documents',
  authMiddleware,
  requireRole(['SUPER_ADMIN', 'CONTENT_ADMIN']),
  getReportAllDocuments,
);

export default router;
