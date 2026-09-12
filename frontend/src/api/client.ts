import axios from 'axios';
import type { Doctor, Consultation } from '../types';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if token is stored
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('amrutam_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fallback Mock Doctors Data for instant WOW presentation
export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    userId: 'u-doc-1',
    fullName: 'Dr. Vaidya Ananya Sharma',
    specialization: 'Ayurvedic Kayachikitsa & General Medicine',
    experienceYears: 12,
    consultationFee: 750,
    rating: 4.9,
    bio: 'Pioneer in holistic Panchakarma therapies and chronic gut health management with 12+ years of clinical practice.',
    imageUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78347?auto=format&fit=crop&q=80&w=400',
    availableSlots: [
      { id: 'slot-101', doctorId: 'doc-1', startTime: '2026-09-13T10:00:00.000Z', endTime: '2026-09-13T10:30:00.000Z', isBooked: false },
      { id: 'slot-102', doctorId: 'doc-1', startTime: '2026-09-13T11:00:00.000Z', endTime: '2026-09-13T11:30:00.000Z', isBooked: false },
      { id: 'slot-103', doctorId: 'doc-1', startTime: '2026-09-13T14:30:00.000Z', endTime: '2026-09-13T15:00:00.000Z', isBooked: false },
    ],
  },
  {
    id: 'doc-2',
    userId: 'u-doc-2',
    fullName: 'Dr. Rajesh Varma',
    specialization: 'Ayurvedic Dermatology & Skin Care',
    experienceYears: 15,
    consultationFee: 900,
    rating: 4.85,
    bio: 'Specialist in natural herbal formulations for psoriasis, eczema, and radiant skin rejuvenation.',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    availableSlots: [
      { id: 'slot-201', doctorId: 'doc-2', startTime: '2026-09-13T12:00:00.000Z', endTime: '2026-09-13T12:30:00.000Z', isBooked: false },
      { id: 'slot-202', doctorId: 'doc-2', startTime: '2026-09-13T16:00:00.000Z', endTime: '2026-09-13T16:30:00.000Z', isBooked: false },
    ],
  },
  {
    id: 'doc-3',
    userId: 'u-doc-3',
    fullName: 'Dr. Meera Nambiar',
    specialization: 'Women Health & Rasayana Therapy',
    experienceYears: 9,
    consultationFee: 650,
    rating: 4.95,
    bio: 'Integrative Ayurvedic gynecologist focusing on hormonal balance, fertility wellness, and stress management.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    availableSlots: [
      { id: 'slot-301', doctorId: 'doc-3', startTime: '2026-09-14T09:30:00.000Z', endTime: '2026-09-14T10:00:00.000Z', isBooked: false },
      { id: 'slot-302', doctorId: 'doc-3', startTime: '2026-09-14T15:00:00.000Z', endTime: '2026-09-14T15:30:00.000Z', isBooked: false },
    ],
  },
];

export const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: 'cons-901',
    patientId: 'p-100',
    doctorId: 'doc-1',
    doctorName: 'Dr. Vaidya Ananya Sharma',
    slotId: 'slot-101',
    status: 'SCHEDULED',
    type: 'VIDEO',
    startTime: '2026-09-13T10:00:00.000Z',
    endTime: '2026-09-13T10:30:00.000Z',
    payment: { id: 'pay-01', amount: 750, status: 'SUCCESS' },
    prescription: {
      diagnosis: 'Vata-Pitta Imbalance & Indigestion (Agnimandya)',
      medicines: [
        { name: 'Amrutam Nari Sondarya Malt', dosage: '1 tbsp', frequency: 'Twice daily after meals' },
        { name: 'Triphala Churna', dosage: '1 tsp', frequency: 'At bedtime with warm water' },
      ],
      notes: 'Maintain a warm light diet. Avoid cold processed foods.',
    },
  },
];
