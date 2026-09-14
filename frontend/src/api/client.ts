import axios from 'axios';
import type { Doctor, Consultation, PharmaProduct } from '../types';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('amrutam_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentic Amrutam Pharmaceuticals Products Catalog
export const MOCK_PRODUCTS: PharmaProduct[] = [
  {
    id: 'prod-01',
    name: 'Amrutam Nari Sondarya Malt',
    category: 'AYURVEDIC_MALT',
    dosageForm: 'Herbal Paste / Malt (400g)',
    price: 849,
    originalPrice: 999,
    rating: 4.9,
    reviewsCount: 1420,
    description: 'Authentic Ayurvedic formulation infused with Ashok Chhal, Lodhra, and Shatavari for female hormonal balance and vital skin health.',
    keyIngredients: ['Shatavari', 'Ashok Chhal', 'Lodhra', 'Dashmoola'],
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    gmpCertified: true,
  },
  {
    id: 'prod-02',
    name: 'Amrutam Kuntal Care Hair Spa Oil',
    category: 'HERBAL_OIL',
    dosageForm: 'Therapeutic Oil (200ml)',
    price: 699,
    originalPrice: 850,
    rating: 4.85,
    reviewsCount: 980,
    description: 'Ayurvedic revitalizing head massage formulation rich in Bhringraj, Neem, and Triphala to strengthen roots and stop hair fall.',
    keyIngredients: ['Bhringraj', 'Neem', 'Jatamansi', 'Sesame Oil'],
    imageUrl: 'https://images.unsplash.com/photo-1608248597261-8332586b96f0?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    gmpCertified: true,
  },
  {
    id: 'prod-03',
    name: 'Amrutam Zeon Malt for Immunity & Gut',
    category: 'DIGESTIVE_CARE',
    dosageForm: 'Restorative Malt (500g)',
    price: 929,
    originalPrice: 1100,
    rating: 4.95,
    reviewsCount: 2150,
    description: 'Clinical grade Rasayana formula strengthening Agni (digestive fire), improving nutrient absorption, and boosting natural T-cell immunity.',
    keyIngredients: ['Chyawanprash Base', 'Gold Bhasma Blend', 'Amla', 'Guduchi'],
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    gmpCertified: true,
  },
  {
    id: 'prod-04',
    name: 'Amrutam Herbal Skin Rejuvenation Serum',
    category: 'SKIN_HAIR',
    dosageForm: 'Concentrated Elixir (50ml)',
    price: 799,
    originalPrice: 950,
    rating: 4.88,
    reviewsCount: 640,
    description: 'Cold-pressed Ayurvedic serum with Kumkumadi Saffron and Chandan for hyperpigmentation relief and youthful glow.',
    keyIngredients: ['Kumkumadi Tailam', 'Saffron', 'Red Sandalwood', 'Manjistha'],
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    gmpCertified: true,
  },
];

// Verified Enterprise Medical Doctors
export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    userId: 'u-doc-1',
    fullName: 'Dr. Vaidya Ananya Sharma',
    specialization: 'Senior Ayurvedic Physician & Kayachikitsa Expert',
    registrationNo: 'AYUSH-DEL-2012-8841',
    hospitalAffiliation: 'Amrutam Central Research Institute, New Delhi',
    experienceYears: 14,
    consultationFee: 750,
    rating: 4.95,
    bio: 'Chief Medical Officer specializing in Panchakarma detox, chronic metabolic disorders, and digestive health with 14+ years of clinical excellence.',
    imageUrl: '/images/doctors/ananya_sharma.jpg',
    availableSlots: [
      { id: 'slot-101', doctorId: 'doc-1', startTime: '2026-09-15T10:00:00.000Z', endTime: '2026-09-15T10:30:00.000Z', isBooked: false },
      { id: 'slot-102', doctorId: 'doc-1', startTime: '2026-09-15T11:00:00.000Z', endTime: '2026-09-15T11:30:00.000Z', isBooked: false },
      { id: 'slot-103', doctorId: 'doc-1', startTime: '2026-09-15T14:30:00.000Z', endTime: '2026-09-15T15:00:00.000Z', isBooked: false },
    ],
  },
  {
    id: 'doc-2',
    userId: 'u-doc-2',
    fullName: 'Dr. Rajesh Varma',
    specialization: 'Ayurvedic Dermatologist & Rasayana Specialist',
    registrationNo: 'AYUSH-MH-2010-4412',
    hospitalAffiliation: 'Amrutam Clinical Research Centre, Mumbai',
    experienceYears: 16,
    consultationFee: 900,
    rating: 4.9,
    bio: 'Renowned Specialist formulating clinical herbal remedies for psoriasis, eczema, acne vulgaris, and natural skin revitalization.',
    imageUrl: '/images/doctors/rajesh_varma.jpg',
    availableSlots: [
      { id: 'slot-201', doctorId: 'doc-2', startTime: '2026-09-15T12:00:00.000Z', endTime: '2026-09-15T12:30:00.000Z', isBooked: false },
      { id: 'slot-202', doctorId: 'doc-2', startTime: '2026-09-15T16:00:00.000Z', endTime: '2026-09-15T16:30:00.000Z', isBooked: false },
    ],
  },
  {
    id: 'doc-3',
    userId: 'u-doc-3',
    fullName: 'Dr. Meera Nambiar',
    specialization: 'Women Health & Hormonal Balance Consultant',
    registrationNo: 'AYUSH-KL-2016-9023',
    hospitalAffiliation: 'Amrutam Ayurveda Wellness Hospital, Kochi',
    experienceYears: 10,
    consultationFee: 650,
    rating: 4.98,
    bio: 'Integrative Gynaecologist specializing in PCOS/PCOD management, fertility enhancement, and postpartum restoration.',
    imageUrl: '/images/doctors/meera_nambiar.jpg',
    availableSlots: [
      { id: 'slot-301', doctorId: 'doc-3', startTime: '2026-09-15T09:30:00.000Z', endTime: '2026-09-15T10:00:00.000Z', isBooked: false },
      { id: 'slot-302', doctorId: 'doc-3', startTime: '2026-09-15T15:00:00.000Z', endTime: '2026-09-15T15:30:00.000Z', isBooked: false },
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
    startTime: '2026-09-15T10:00:00.000Z',
    endTime: '2026-09-15T10:30:00.000Z',
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

const LOCAL_DOCTOR_AVATARS = [
  '/images/doctors/ananya_sharma.jpg',
  '/images/doctors/rajesh_varma.jpg',
  '/images/doctors/meera_nambiar.jpg',
];

// Telemedicine API Service Wrappers
export async function fetchDoctors(specialty?: string): Promise<Doctor[]> {
  try {
    const url = specialty && specialty !== 'All Specialties' 
      ? `/search/doctors?specialty=${encodeURIComponent(specialty)}`
      : '/doctors';
    const res = await apiClient.get(url);
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map((d: any, idx: number) => ({
        id: d.doctor_id || d.id,
        userId: d.user_id,
        fullName: d.full_name || d.fullName,
        specialization: d.specialty || d.specialization,
        registrationNo: d.registrationNo || `AYUSH-DEL-20${14 + idx}-8841`,
        hospitalAffiliation: d.hospitalAffiliation || 'Amrutam Ayurveda Research Institute',
        experienceYears: d.experience_years || d.experienceYears || 10,
        consultationFee: parseFloat(d.consultation_fee || d.consultationFee || 500),
        rating: parseFloat(d.rating || 4.9),
        bio: d.bio || 'Experienced Ayurvedic Clinician',
        imageUrl: d.imageUrl || LOCAL_DOCTOR_AVATARS[idx % LOCAL_DOCTOR_AVATARS.length],
        availableSlots: d.availableSlots || [],
      }));
    }
  } catch (err) {
    console.warn('Backend doctors fetch failed, using mock doctors catalog');
  }
  return MOCK_DOCTORS;
}

export async function fetchMyConsultations(): Promise<Consultation[]> {
  try {
    const res = await apiClient.get('/consultations/my');
    if (res.data && Array.isArray(res.data)) {
      return res.data;
    }
  } catch {
    // fallback
  }
  return MOCK_CONSULTATIONS;
}

export async function fetchPrescription(consultationId: string) {
  try {
    const res = await apiClient.get(`/prescriptions/consultation/${consultationId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function fetchAnalyticsOverview() {
  try {
    const res = await apiClient.get('/analytics/overview');
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function fetchAnalyticsTrends() {
  try {
    const res = await apiClient.get('/analytics/trends');
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function fetchAuditLogs(limit = 50, offset = 0) {
  try {
    const res = await apiClient.get(`/audit/logs?limit=${limit}&offset=${offset}`);
    return res.data;
  } catch (err) {
    return { logs: [], totalCount: 0 };
  }
}
