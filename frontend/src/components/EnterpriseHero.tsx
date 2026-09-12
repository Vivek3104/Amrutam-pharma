import React from 'react';
import { ShieldCheck, Stethoscope, Pill, Award, Truck } from 'lucide-react';

interface EnterpriseHeroProps {
  onBookDoctorClick: () => void;
  onExplorePharmacyClick: () => void;
}

export const EnterpriseHero: React.FC<EnterpriseHeroProps> = ({
  onBookDoctorClick,
  onExplorePharmacyClick,
}) => {
  return (
    <section style={{ padding: '60px 0 40px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container-responsive" style={{ textAlign: 'center' }}>
        
        {/* Compliance Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--teal-light)',
          border: '1px solid rgba(0, 173, 181, 0.35)',
          padding: '6px 18px',
          borderRadius: 'var(--radius-full)',
          color: 'var(--teal-glow)',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '24px',
        }}>
          <Award size={18} color="var(--teal-glow)" /> ISO 9001:2026 & GMP Certified Pharmaceutical Care
        </div>

        {/* Corporate Headline */}
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5.2vw, 3.8rem)',
          fontWeight: 800,
          color: '#FFFFFF',
          lineHeight: 1.12,
          marginBottom: '20px',
          maxWidth: '960px',
          margin: '0 auto 20px auto',
        }}>
          Enterprise Telemedicine & <span style={{
            background: 'linear-gradient(135deg, #00FFF5 0%, #00ADB5 50%, #10B981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Authentic Ayurvedic Formulations</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          maxWidth: '780px',
          margin: '0 auto 36px auto',
          lineHeight: 1.6,
        }}>
          Amrutam Pharmaceuticals bridges ancient Vedic healing wisdom with modern pharmaceutical precision. Connect with certified Vaidyas, receive digital e-prescriptions, and order 100% pure herbal malt formulations.
        </p>

        {/* Dual CTAs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '50px',
        }}>
          <button onClick={onBookDoctorClick} className="btn btn-teal" style={{ padding: '14px 32px', fontSize: '1rem' }}>
            <Stethoscope size={20} /> Book Doctor Teleconsultation
          </button>
          <button onClick={onExplorePharmacyClick} className="btn btn-emerald" style={{ padding: '14px 32px', fontSize: '1rem' }}>
            <Pill size={20} /> Explore Pharmacy Catalog
          </button>
        </div>

        {/* Enterprise Trust Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
        }}>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--teal-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <Award size={24} color="var(--teal-glow)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '6px' }}>100% GMP Certified</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manufactured under strict ISO & WHO-GMP cleanroom standards using wild-harvested herbs.</p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--emerald-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <Stethoscope size={24} color="var(--emerald-botanical)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '6px' }}>Verified Medical Doctors</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Licensed Ayurvedic BAMS/MD Vaidyas with verified AYUSH registration numbers.</p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--amber-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <Truck size={24} color="var(--amber-gold)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '6px' }}>Express Pan-India Shipping</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Dispatched directly from Amrutam pharmaceutical facilities with tamper-evident packaging.</p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--teal-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <ShieldCheck size={24} color="var(--teal-glow)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '6px' }}>Zero Concurrency Conflict</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Engineered on Saga microservices guaranteeing zero double-booking or transaction drops.</p>
          </div>
        </div>

      </div>
    </section>
  );
};
