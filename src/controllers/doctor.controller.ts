import { Request, Response, NextFunction } from 'express';
import { DoctorService } from '../services/doctor.service.js';

const doctorService = new DoctorService();

export class DoctorController {
  async getAllDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const doctors = await doctorService.getAllDoctors();
      res.status(200).json(doctors);
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await doctorService.getDoctorByUserId(req.user!.id);
      res.status(200).json(doc);
    } catch (err) {
      next(err);
    }
  }

  async createSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await doctorService.getDoctorByUserId(req.user!.id);
      const slot = await doctorService.createSlots({
        doctorId: doc.id,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      });
      res.status(201).json(slot);
    } catch (err) {
      next(err);
    }
  }

  async getSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorId = req.params.doctorId;
      const slots = await doctorService.getDoctorSlots(doctorId);
      res.status(200).json(slots);
    } catch (err) {
      next(err);
    }
  }
}
