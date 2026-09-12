import { Router } from 'express';
import authRoutes from './auth.routes.js';
import doctorRoutes from './doctor.routes.js';
import bookingRoutes from './booking.routes.js';
import consultationRoutes from './consultation.routes.js';
import prescriptionRoutes from './prescription.routes.js';
import searchRoutes from './search.routes.js';
import analyticsRoutes from './analytics.routes.js';
import auditRoutes from './audit.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/doctors', doctorRoutes);
router.use('/bookings', bookingRoutes);
router.use('/consultations', consultationRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/search', searchRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/audit', auditRoutes);

export default router;
