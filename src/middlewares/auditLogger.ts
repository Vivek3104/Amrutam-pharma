import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { query } from '../database/index.js';
import { logger } from '../utils/logger.js';

export function auditLogger(action: string, resource: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      // Only audit mutating operations or PHI reads, and only successful/client error responses
      if (res.statusCode >= 200 && res.statusCode < 500) {
        const userId = req.user?.id || null;
        const userRole = req.user?.role || 'ANONYMOUS';
        const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';
        const userAgent = req.headers['user-agent'] || 'Unknown';
        
        // Hash sensitive request payload for audit comparison without storing plain PHI
        const payloadStr = JSON.stringify({ body: req.body, params: req.params, query: req.query });
        const payloadHash = crypto.createHash('sha256').update(payloadStr).digest('hex');

        const resourceId = req.params.id || req.body.id || req.body.consultationId || req.body.doctorId || null;

        query(
          `INSERT INTO audit_logs (user_id, user_role, action, resource, resource_id, ip_address, user_agent, payload_hash)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
          [userId, userRole, action, resource, resourceId, ipAddress, userAgent, payloadHash]
        ).catch((err) => {
          logger.error({ error: err.message, action, resource }, 'Failed to record audit log entry');
        });
      }
    });

    next();
  };
}
