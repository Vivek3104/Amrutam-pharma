import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate, registerSchema, loginSchema, mfaVerifySchema } from '../middlewares/validate.js';

const router = Router();

// 1. User Lifecycle: Register & Login (Email/Password, MFA support, Patient/Doctor/Admin)
router.post('/register', validate(registerSchema), (req, res, next) => authController.register(req, res, next));
router.post('/login', validate(loginSchema), (req, res, next) => authController.login(req, res, next));

// 2. Multi-Factor Authentication (TOTP)
router.post('/mfa/setup', authenticate, (req, res, next) => authController.setupMFA(req, res, next));
router.post('/mfa/verify', authenticate, validate(mfaVerifySchema), (req, res, next) => authController.verifyMFA(req, res, next));

// 3. Customer Mobile & Email + OTP Authentication (Bird Verify)
router.post('/otp/send', (req, res) => authController.sendCustomerOtp(req, res));
router.post('/otp/verify', (req, res) => authController.verifyCustomerOtp(req, res));
router.post('/customer/send-otp', (req, res) => authController.sendCustomerOtp(req, res));
router.post('/customer/verify-otp', (req, res) => authController.verifyCustomerOtp(req, res));
router.post('/verify/check', (req, res) => authController.verifyCheck(req, res));
router.post('/bird/check', (req, res) => authController.verifyCheck(req, res));

// 4. Admin Direct Authentication
router.post('/admin/login', (req, res) => authController.adminLogin(req, res));

// 5. Authenticated User Profile
router.get('/me', authenticate, (req, res) => authController.me(req, res));

export default router;
