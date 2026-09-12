import { Router } from 'express';
import { ConsultationController } from '../controllers/consultation.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { auditLogger } from '../middlewares/auditLogger.js';

const router = Router();
const controller = new ConsultationController();

router.get('/my', authenticate, (req, res, next) => controller.getMyConsultations(req, res, next));
router.get('/:id', authenticate, auditLogger('VIEW_CONSULTATION', 'consultations'), (req, res, next) => controller.getById(req, res, next));
router.patch('/:id/status', authenticate, auditLogger('UPDATE_CONSULTATION_STATUS', 'consultations'), (req, res, next) => controller.updateStatus(req, res, next));

export default router;
