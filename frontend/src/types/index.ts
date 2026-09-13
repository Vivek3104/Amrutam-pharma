export type UserRole = 'CUSTOMER' | 'ADMIN' | 'PATIENT' | 'DOCTOR' | 'PHARMACIST';

export interface DoctorProfile {
  id: string;
  specialization: string;
  registrationNo: string;
  hospitalAffiliation: string;
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
  registrationNo: string;
  hospitalAffiliation: string;
  experienceYears: number;
  consultationFee: number;
  rating: number;
  bio: string;
  imageUrl: string;
  availableSlots: AvailabilitySlot[];
}

export interface PharmaProduct {
  id: string;
  name: string;
  category: 'AYURVEDIC_MALT' | 'HERBAL_OIL' | 'DIGESTIVE_CARE' | 'SKIN_HAIR' | 'SUPPLEMENT';
  dosageForm: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  description: string;
  keyIngredients: string[];
  imageUrl: string;
  inStock: boolean;
  gmpCertified: boolean;
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
  patientName?: string;
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
