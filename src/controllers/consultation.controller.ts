import { Request, Response, NextFunction } from 'express';
import { ConsultationService } from '../services/consultation.service.js';

const consultationService = new ConsultationService();

export class ConsultationController {
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const consultation = await consultationService.getConsultationById(req.params.id);
      res.status(200).json(consultation);
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const updated = await consultationService.updateStatus(req.params.id, status, req.user!.id);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  }

  async getMyConsultations(req: Request, res: Response, next: NextFunction) {
    try {
      const role = req.user?.role === 'DOCTOR' ? 'DOCTOR' : 'PATIENT';
      const consultations = await consultationService.getUserConsultations(
        req.user!.id,
        role
      );
      res.status(200).json(consultations);
    } catch (err) {
      next(err);
    }
  }
}
