import { Router } from 'express';
import { chatController } from '../controllers/chat.controller.js';

const router = Router();

// GET /api/v1/consultations/:id/chat
router.get('/:id/chat', (req, res, next) => chatController.getChatHistory(req, res, next));

export default router;
