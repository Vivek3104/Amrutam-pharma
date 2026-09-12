import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/rbac.js';

const router = Router();
const controller = new AuditController();

router.get('/logs', authenticate, authorizeRoles('ADMIN'), (req, res, next) => controller.getLogs(req, res, next));

export default router;
