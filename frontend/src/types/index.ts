export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface DoctorProfile {
  id: string;
  specialization: string;
  experienceYears: number;
  consultationFee: number;
  bio?: string;
  rating?: number;
  imageUrl?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  phone?: string;
  doctorProfile?: DoctorProfile | null;
}

export interface AvailabilitySlot {
  id: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Doctor {
  id: string;
  userId: string;
  fullName: string;
  specialization: string;
  experienceYears: number;
  consultationFee: number;
  rating: number;
  bio: string;
  imageUrl: string;
  availableSlots: AvailabilitySlot[];
}

export type ConsultationType = 'AUDIO' | 'VIDEO' | 'CHAT';
export type ConsultationStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface PaymentInfo {
  id: string;
  amount: number;
  status: string;
  paymentGatewayRef?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName?: string;
  slotId: string;
  status: ConsultationStatus;
  type: ConsultationType;
  startTime?: string;
  endTime?: string;
  payment?: PaymentInfo;
  prescription?: {
    diagnosis: string;
    medicines: Array<{ name: string; dosage: string; frequency: string }>;
    notes: string;
  };
}
