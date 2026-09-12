import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { DoctorCard } from '../components/DoctorCard';
import { BookingModal } from '../components/BookingModal';
import type { Doctor } from '../types';
import { apiClient, MOCK_DOCTORS } from '../api/client';
import { Sparkles, ShieldCheck, HeartPulse } from 'lucide-react';

export const Home: React.FC = () => {
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
      {/* Hero Header */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
      />

      {/* Main Doctor Discovery Grid */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 60px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#FFF', marginBottom: '4px' }}>
              Available Ayurvedic Practitioners
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Showing {filteredDoctors.length} verified doctors available for instant consultation
            </p>
          </div>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
            <HeartPulse size={48} color="var(--accent-gold)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>No Doctors Found</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Try searching with a different keyword or resetting your specialty filter.
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

      {/* Amrutam Telemedicine Value Proposition */}
      <section style={{
        background: 'rgba(15, 45, 35, 0.4)',
        borderTop: '1px solid var(--border-glass)',
        borderBottom: '1px solid var(--border-glass)',
        padding: '60px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', color: '#FFF', marginBottom: '16px' }}>
            Why Choose <span style={{ color: 'var(--accent-gold)' }}>Amrutam Telemedicine</span>?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginTop: '36px',
          }}>
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
              <div style={{ color: 'var(--accent-gold)', marginBottom: '12px' }}><Sparkles size={32} /></div>
              <h4 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '8px' }}>Personalized Ayurvedic Care</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Customized Prakriti evaluation and tailored herbal prescription recommendations directly from senior doctors.</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
              <div style={{ color: 'var(--accent-mint)', marginBottom: '12px' }}><ShieldCheck size={32} /></div>
              <h4 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '8px' }}>Idempotent & Secure Saga</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Built on zero double-booking concurrency guarantees and enterprise AES-256 data protection.</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
              <div style={{ color: 'var(--accent-gold)', marginBottom: '12px' }}><HeartPulse size={32} /></div>
              <h4 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '8px' }}>Seamless Video Follow-Ups</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Connect with your practitioner anywhere in high-definition video with integrated live chat.</p>
            </div>
          </div>
        </div>
      </section>

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
