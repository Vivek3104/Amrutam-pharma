import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const overview = await analyticsService.getDashboardOverview();
      res.status(200).json(overview);
    } catch (err) {
      next(err);
    }
  }

  async getTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;
      const trends = await analyticsService.getDailyConsultationTrends(days);
      res.status(200).json(trends);
    } catch (err) {
      next(err);
    }
  }
}
