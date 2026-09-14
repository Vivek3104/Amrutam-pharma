import { Router } from 'express';
import authRoutes from './auth.routes.js';
import doctorRoutes from './doctor.routes.js';
import bookingRoutes from './booking.routes.js';
import consultationRoutes from './consultation.routes.js';
import prescriptionRoutes from './prescription.routes.js';
import searchRoutes from './search.routes.js';
import auditRoutes from './audit.routes.js';
import analyticsRoutes from './analytics.routes.js';
import chatRoutes from './chat.routes.js';
import storeRoutes from './store.routes.js';

const router = Router();

// 1. Authentication (Patient, Doctor, Admin, MFA, OTP)
router.use('/auth', authRoutes);

// 2. Doctor Directory & Availability Slots
router.use('/doctors', doctorRoutes);

// 3. Telemedicine Bookings & Distributed Locking Saga
router.use('/bookings', bookingRoutes);

// 4. Consultation Lifecycle & Room Management
router.use('/consultations', consultationRoutes);

// 5. Prescriptions (AES-256 Encrypted with HMAC Digital Signature)
router.use('/prescriptions', prescriptionRoutes);

// 6. Search & Filtering (Doctors, Specialties with Redis Caching)
router.use('/search', searchRoutes);

// 7. Compliance & Immutable Audit Trails
router.use('/audit', auditRoutes);

// 8. Admin Analytics & System Metrics
router.use('/analytics', analyticsRoutes);

// 9. Telemedicine Chat History
router.use('/chat', chatRoutes);

// 10. Amrutam Store APIs (Products, Orders, Callbacks, Store Stats)
router.use('/', storeRoutes);

export default router;
