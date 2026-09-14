import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';
import { logger } from '../utils/logger.js';

export type ValidationSource = 'body' | 'query' | 'params';

/**
 * Express middleware to validate request data against a Zod schema
 */
export function validate(schema: ZodSchema, source: ValidationSource = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[source];
      const parsed = schema.parse(dataToValidate);
      // Replace source with parsed/coerced data
      req[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        logger.warn({ path: req.originalUrl, errors: err.errors }, 'Input validation failed');
        return res.status(400).json({
          status: 'error',
          code: 'VALIDATION_ERROR',
          message: 'Invalid request parameters',
          errors: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
            code: e.code,
          })),
        });
      }
      next(err);
    }
  };
}

// ==========================================
// Reusable Zod Schemas for Telemedicine APIs
// ==========================================

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters long'),
  role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN', 'CUSTOMER']).default('PATIENT'),
  phone: z.string().optional(),
  specialty: z.string().optional(),
  experienceYears: z.number().int().nonnegative().optional(),
  consultationFee: z.number().nonnegative().optional(),
});

export const loginSchema = z.object({
  email: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
  mfaCode: z.string().length(6, 'MFA code must be exactly 6 digits').optional(),
});

export const mfaVerifySchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'MFA code must be exactly 6 digits'),
});

export const createBookingSchema = z.object({
  slotId: z.string().min(1, 'Slot ID is required'),
  type: z.enum(['AUDIO', 'VIDEO', 'CHAT']).default('VIDEO'),
  paymentMethod: z.string().optional(),
});

export const createSlotSchema = z.object({
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
});

export const createPrescriptionSchema = z.object({
  consultationId: z.string().min(1, 'Consultation ID is required'),
  diagnosis: z.string().min(3, 'Diagnosis must be at least 3 characters long'),
  medicines: z.any().refine((val) => Array.isArray(val) || typeof val === 'string', {
    message: 'Medicines must be an array or string',
  }),
  notes: z.string().optional(),
});

export const updateConsultationStatusSchema = z.object({
  status: z.enum(['REQUESTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], {
    errorMap: () => ({ message: 'Invalid consultation status' }),
  }),
});

export const searchDoctorSchema = z.object({
  q: z.string().optional(),
  specialty: z.string().optional(),
  minRating: z.string().transform((v) => (v ? parseFloat(v) : undefined)).optional(),
  maxFee: z.string().transform((v) => (v ? parseFloat(v) : undefined)).optional(),
});
