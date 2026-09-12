import React, { useState, useEffect } from 'react';
import { EnterpriseHero } from '../components/EnterpriseHero';
import { DoctorCard } from '../components/DoctorCard';
import { BookingModal } from '../components/BookingModal';
import { TrustCompliance } from '../components/TrustCompliance';
import type { Doctor } from '../types';
import { apiClient, MOCK_DOCTORS } from '../api/client';
import { Search, HeartPulse, Stethoscope } from 'lucide-react';

interface HomeProps {
  onExplorePharmacyClick: () => void;
}

export const Home: React.FC<HomeProps> = ({ onExplorePharmacyClick }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await apiClient.get('/doctors');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setDoctors(res.data);
        }
      } catch (err) {
        // Fallback to MOCK_DOCTORS
      }
    };
    fetchDoctors();
  }, []);

  const specialties = [
    'All Specialties',
    'Kayachikitsa & General Medicine',
    'Skin & Dermatology',
    'Women Health',
    'Gut Health & Digestion',
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === 'All Specialties' ||
      doc.specialization.toLowerCase().includes(selectedSpecialty.split('&')[0].trim().toLowerCase());

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div>
      {/* Enterprise Hero Banner */}
      <EnterpriseHero
        onBookDoctorClick={() => {
          const el = document.getElementById('doctor-clinic');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onExplorePharmacyClick={onExplorePharmacyClick}
      />

      {/* Main Virtual Doctor Clinic */}
      <section id="doctor-clinic" className="container-responsive" style={{ padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="badge badge-teal" style={{ marginBottom: '10px' }}>
            <Stethoscope size={12} /> Amrutam Virtual Medical Clinic
          </span>
          <h2 style={{ fontSize: '2.2rem', color: '#FFF', marginBottom: '8px' }}>
            Consult Licensed Ayurvedic Vaidyas & Physicians
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', fontSize: '0.98rem' }}>
            Schedule high-definition video consultations with senior doctors holding verified AYUSH registration.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-panel" style={{ padding: '16px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} color="var(--teal-primary)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
              <input
                type="text"
                placeholder="Search doctors by name, medical specialty, or registration ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '48px', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {specialties.map((spec) => {
                const isSelected = selectedSpecialty === spec;
                return (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`btn ${isSelected ? 'btn-teal' : 'btn-outline'}`}
                    style={{ fontSize: '0.82rem', padding: '6px 16px', borderRadius: 'var(--radius-full)' }}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
            <HeartPulse size={48} color="var(--amber-gold)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>No Physicians Found</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Try adjusting your query or resetting your specialty filter.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px',
          }}>
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onBook={(doc) => setSelectedDoctorForBooking(doc)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trust & Compliance Section */}
      <TrustCompliance />

      {/* Booking Modal */}
      {selectedDoctorForBooking && (
        <BookingModal
          doctor={selectedDoctorForBooking}
          onClose={() => setSelectedDoctorForBooking(null)}
          onBookingSuccess={() => {}}
        />
      )}
    </div>
  );
};
