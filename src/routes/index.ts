import { Router } from 'express';
import authRoutes from './auth.routes.js';
import storeRoutes from './store.routes.js';

const router = Router();

// 1. Authentication (Customer Mobile+OTP & Admin Site Manager)
router.use('/auth', authRoutes);

// 2. Amrutam Store APIs (Products, Orders, Callbacks, Admin Stats)
router.use('/', storeRoutes);

export default router;
