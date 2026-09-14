import React, { useState, useEffect } from 'react';
import type { Doctor } from '../types';
import { fetchDoctors } from '../api/client';
import { DoctorCard } from '../components/DoctorCard';
import { BookingModal } from '../components/BookingModal';
import { Search, Stethoscope, ArrowLeft, Sparkles } from 'lucide-react';

interface DoctorDirectoryPageProps {
  onBackToHome: () => void;
  onBookingSuccess?: () => void;
}

const SPECIALTY_TABS = [
  'All Specialties',
  'Kayachikitsa',
  'Dermatology',
  'Women Health',
  'Digestive Health',
];

export const DoctorDirectoryPage: React.FC<DoctorDirectoryPageProps> = ({ onBackToHome, onBookingSuccess }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);

  useEffect(() => {
    loadDoctors();
  }, [selectedSpecialty]);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const data = await fetchDoctors(selectedSpecialty);
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.fullName.toLowerCase().includes(q) ||
      doc.specialization.toLowerCase().includes(q) ||
      doc.bio.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0F1E17', color: '#FFF', paddingBottom: '80px' }}>
      {/* Top Header Bar */}
      <div style={{
        background: '#1A2E24',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        padding: '20px 32px',
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <button
            onClick={onBackToHome}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#FFF',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back to Amrutam Home
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10B981',
              color: '#10B981',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}>
              ● Live Video Clinic Active
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1240px', margin: '36px auto 0 auto', padding: '0 24px' }}>
        {/* Hero Title */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid #D4AF37',
            color: '#D4AF37',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            <Sparkles size={13} /> AYUSH Verified Clinicians
          </span>
          <h1 style={{
            fontSize: '2.4rem',
            fontFamily: "'Playfair Display', Georgia, serif",
            color: '#FAF5EE',
            marginBottom: '10px',
          }}>
            Consult India's Leading Ayurvedic Vaidyas
          </h1>
          <p style={{ color: 'rgba(250, 245, 238, 0.75)', maxWidth: '640px', margin: '0 auto', fontSize: '0.98rem' }}>
            Book 1-on-1 private video, audio, or live chat consultations with certified senior doctors. Get personalized herbal prescriptions with tamper-evident digital signatures.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div style={{
          background: 'rgba(26, 46, 36, 0.7)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '16px',
          padding: '18px 24px',
          marginBottom: '36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <Search size={18} color="#D4AF37" style={{ position: 'absolute', left: '14px', top: '12px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, specialty, or health concern (e.g. PCOS, Skin, Digestion)..."
                style={{
                  width: '100%',
                  padding: '11px 16px 11px 42px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#FFF',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          {/* Specialty Filter Badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {SPECIALTY_TABS.map((tab) => {
              const isSelected = selectedSpecialty === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedSpecialty(tab)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: isSelected ? '#D4AF37' : 'rgba(255,255,255,0.06)',
                    color: isSelected ? '#1A2920' : 'rgba(255,255,255,0.8)',
                    border: isSelected ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.12)',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 800 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Doctor Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.6)' }}>
            Loading verified Ayurvedic physicians...
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.6)' }}>
            <Stethoscope size={48} color="#D4AF37" style={{ margin: '0 auto 12px auto' }} />
            <h3>No doctors found matching "{searchQuery}"</h3>
            <p style={{ fontSize: '0.88rem' }}>Try searching for a different concern or reset the specialty filter.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
          }}>
            {filteredDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onBook={(d) => setSelectedDoctorForBooking(d)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedDoctorForBooking && (
        <BookingModal
          doctor={selectedDoctorForBooking}
          onClose={() => setSelectedDoctorForBooking(null)}
          onBookingSuccess={() => {
            if (onBookingSuccess) onBookingSuccess();
          }}
        />
      )}
    </div>
  );
};
