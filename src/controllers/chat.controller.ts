import { Request, Response, NextFunction } from 'express';
import { signalingService } from '../services/signaling.service.js';

export class ChatController {
  public async getChatHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const consultationId = req.params.id;
      if (!consultationId) {
        res.status(400).json({ error: 'Consultation ID is required' });
        return;
      }

      const history = await signalingService.getChatHistory(consultationId);

      res.status(200).json({
        status: 'SUCCESS',
        consultationId,
        messagesCount: history.length,
        data: history,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const chatController = new ChatController();
