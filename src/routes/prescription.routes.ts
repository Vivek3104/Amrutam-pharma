import { Router } from 'express';
import { PrescriptionController } from '../controllers/prescription.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/rbac.js';
import { auditLogger } from '../middlewares/auditLogger.js';

const router = Router();
const controller = new PrescriptionController();

router.post(
  '/',
  authenticate,
  authorizeRoles('DOCTOR'),
  auditLogger('ISSUE_PRESCRIPTION', 'prescriptions'),
  (req, res, next) => controller.create(req, res, next)
);

router.get(
  '/consultation/:consultationId',
  authenticate,
  auditLogger('VIEW_PRESCRIPTION', 'prescriptions'),
  (req, res, next) => controller.getByConsultationId(req, res, next)
);

export default router;
