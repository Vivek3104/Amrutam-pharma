import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service.js';

const bookingService = new BookingService();

export class BookingController {
  async book(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.user!.id;
      const result = await bookingService.bookConsultation({
        patientId,
        doctorId: req.body.doctorId,
        slotId: req.body.slotId,
        consultationType: req.body.consultationType || 'VIDEO',
        paymentGatewayToken: req.body.paymentGatewayToken,
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
}
