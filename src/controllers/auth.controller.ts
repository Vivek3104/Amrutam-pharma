import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, mfaCode } = req.body;
      const result = await authService.login(email, password, mfaCode);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async setupMFA(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await authService.setupMFA(userId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async verifyMFA(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { code } = req.body;
      const result = await authService.verifyMFA(userId, code);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
