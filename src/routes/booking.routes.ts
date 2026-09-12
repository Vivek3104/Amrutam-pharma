import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/rbac.js';
import { idempotencyMiddleware } from '../middlewares/idempotency.js';
import { auditLogger } from '../middlewares/auditLogger.js';

const router = Router();
const controller = new BookingController();

router.post(
  '/',
  authenticate,
  authorizeRoles('PATIENT'),
  idempotencyMiddleware,
  auditLogger('BOOK_CONSULTATION', 'consultations'),
  (req, res, next) => controller.book(req, res, next)
);

export default router;
