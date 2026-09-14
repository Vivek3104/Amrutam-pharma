import { Router } from 'express';
import { ConsultationController } from '../controllers/consultation.controller.js';
import { chatController } from '../controllers/chat.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { auditLogger } from '../middlewares/auditLogger.js';
import { validate, updateConsultationStatusSchema } from '../middlewares/validate.js';

const router = Router();
const controller = new ConsultationController();

router.get('/my', authenticate, (req, res, next) => controller.getMyConsultations(req, res, next));
router.get('/:id', authenticate, auditLogger('VIEW_CONSULTATION', 'consultations'), (req, res, next) => controller.getById(req, res, next));
router.get('/:id/chat', (req, res, next) => chatController.getChatHistory(req, res, next));
router.patch(
  '/:id/status',
  authenticate,
  validate(updateConsultationStatusSchema),
  auditLogger('UPDATE_CONSULTATION_STATUS', 'consultations'),
  (req, res, next) => controller.updateStatus(req, res, next)
);

export default router;
