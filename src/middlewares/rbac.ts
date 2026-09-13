import { Request, Response, NextFunction } from 'express';

export function authorizeRoles(...roles: Array<'CUSTOMER' | 'ADMIN' | 'PATIENT' | 'DOCTOR'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        type: 'https://amrutam.co/errors/unauthorized',
        title: 'Unauthorized',
        status: 401,
        detail: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        type: 'https://amrutam.co/errors/forbidden',
        title: 'Forbidden',
        status: 403,
        detail: `Access forbidden for user role: ${req.user.role}`,
      });
    }

    next();
  };
}
