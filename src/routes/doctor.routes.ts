import { Router } from 'express';
import { DoctorController } from '../controllers/doctor.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/rbac.js';
import { auditLogger } from '../middlewares/auditLogger.js';
import { validate, createSlotSchema } from '../middlewares/validate.js';

const router = Router();
const controller = new DoctorController();

// Public doctor directory
router.get('/', (req, res, next) => controller.getAllDoctors(req, res, next));

// Doctor authenticated routes
router.get('/profile', authenticate, authorizeRoles('DOCTOR'), (req, res, next) => controller.getProfile(req, res, next));
router.post(
  '/slots',
  authenticate,
  authorizeRoles('DOCTOR'),
  validate(createSlotSchema),
  auditLogger('CREATE_SLOT', 'availability_slots'),
  (req, res, next) => controller.createSlot(req, res, next)
);
router.get('/:doctorId/slots', (req, res, next) => controller.getSlots(req, res, next));

export default router;
