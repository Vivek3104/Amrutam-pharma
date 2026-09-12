import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../services/audit.service.js';

const auditService = new AuditService();

export class AuditController {
  async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
      const result = await auditService.getAuditLogs(limit, offset);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
