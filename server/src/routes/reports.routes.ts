import { Router } from 'express';
import { getReportAllDocuments } from '../controllers/reports.controllers';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/reports/all-documents', authMiddleware, getReportAllDocuments);

export default router;
