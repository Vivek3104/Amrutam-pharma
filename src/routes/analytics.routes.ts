import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/rbac.js';

const router = Router();
const controller = new AnalyticsController();

router.get('/overview', authenticate, authorizeRoles('ADMIN'), (req, res, next) => controller.getOverview(req, res, next));
router.get('/trends', authenticate, authorizeRoles('ADMIN'), (req, res, next) => controller.getTrends(req, res, next));

export default router;
