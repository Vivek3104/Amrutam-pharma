import { Request, Response, NextFunction } from 'express';
import { PrescriptionService } from '../services/prescription.service.js';

const prescriptionService = new PrescriptionService();

export class PrescriptionController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await prescriptionService.createPrescription({
        consultationId: req.body.consultationId,
        doctorId: req.body.doctorId,
        patientId: req.body.patientId,
        diagnosis: req.body.diagnosis,
        medicines: req.body.medicines,
        notes: req.body.notes,
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getByConsultationId(req: Request, res: Response, next: NextFunction) {
    try {
      const prescription = await prescriptionService.getPrescriptionByConsultationId(
        req.params.consultationId,
        req.user!.id
      );
      res.status(200).json(prescription);
    } catch (err) {
      next(err);
    }
  }
}
