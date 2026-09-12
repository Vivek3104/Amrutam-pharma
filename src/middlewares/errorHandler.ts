import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly type: string;

  constructor(message: string, statusCode = 500, type = 'https://amrutam.co/errors/internal-error') {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const type = err.type || 'https://amrutam.co/errors/internal-server-error';
  const title = err.title || (statusCode >= 500 ? 'Internal Server Error' : 'Client Error');
  const detail = err.message || 'An unexpected error occurred';

  logger.error(
    {
      statusCode,
      type,
      path: req.originalUrl,
      method: req.method,
      error: err.stack,
    },
    'Handled Application Exception'
  );

  res.status(statusCode).json({
    type,
    title,
    status: statusCode,
    detail,
    instance: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
}
