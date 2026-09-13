import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Customer Login: Mobile Number & OTP
router.post('/otp/send', (req, res) => authController.sendCustomerOtp(req, res));
router.post('/otp/verify', (req, res) => authController.verifyCustomerOtp(req, res));
router.post('/customer/send-otp', (req, res) => authController.sendCustomerOtp(req, res));
router.post('/customer/verify-otp', (req, res) => authController.verifyCustomerOtp(req, res));

// Admin Login: Identifier + Password / OTP
router.post('/admin/login', (req, res) => authController.adminLogin(req, res));

// Current User Profile
router.get('/me', authenticate, (req, res) => authController.me(req, res));

// Backward-compatible endpoints
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/register', (req, res) => authController.register(req, res));

export default router;
