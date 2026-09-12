import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { auditLogger } from '../middlewares/auditLogger.js';

const router = Router();
const controller = new AuthController();

router.post('/register', auditLogger('REGISTER', 'users'), (req, res, next) => controller.register(req, res, next));
router.post('/login', auditLogger('LOGIN', 'users'), (req, res, next) => controller.login(req, res, next));
router.post('/mfa/setup', authenticate, auditLogger('SETUP_MFA', 'users'), (req, res, next) => controller.setupMFA(req, res, next));
router.post('/mfa/verify', authenticate, auditLogger('VERIFY_MFA', 'users'), (req, res, next) => controller.verifyMFA(req, res, next));

export default router;
