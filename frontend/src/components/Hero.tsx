import React from 'react';
import { Search, ShieldCheck, Video, Award, HeartHandshake } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (s: string) => void;
}

const SPECIALTIES = [
  'All Specialties',
  'Kayachikitsa & General Medicine',
  'Skin & Dermatology',
  'Women Health',
  'Gut Health & Digestion',
  'Panchakarma Detox',
];

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedSpecialty,
  setSelectedSpecialty,
}) => {
  return (
    <section style={{
      padding: '60px 24px 40px 24px',
      maxWidth: '1240px',
      margin: '0 auto',
      textAlign: 'center',
    }}>
      {/* Top Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(212, 175, 55, 0.12)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        padding: '6px 18px',
        borderRadius: 'var(--radius-full)',
        color: 'var(--accent-gold)',
        fontSize: '0.85rem',
        fontWeight: 600,
        marginBottom: '20px',
      }}>
        <ShieldCheck size={18} /> Verified Ayurvedic Doctors & Telemedicine Platform
      </div>

      {/* Main Headline */}
      <h1 style={{
        fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
        fontWeight: 800,
        color: '#FFFFFF',
        lineHeight: 1.15,
        marginBottom: '16px',
      }}>
        Heal Naturally with <span style={{
          background: 'linear-gradient(135deg, #F0C436 0%, #D4AF37 50%, #10B981 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>Certified Ayurvedic Vaidyas</span>
      </h1>

      <p style={{
        fontSize: '1.15rem',
        color: 'var(--text-muted)',
        maxWidth: '720px',
        margin: '0 auto 36px auto',
      }}>
        Book instant HD video consultations, receive tailored herbal prescriptions, and experience holistic wellness powered by modern healthcare technology.
      </p>

      {/* Search Input Bar */}
      <div className="glass-panel" style={{
        maxWidth: '680px',
        margin: '0 auto 28px auto',
        padding: '8px 12px 8px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderRadius: 'var(--radius-full)',
        borderColor: 'rgba(212, 175, 55, 0.35)',
      }}>
        <Search size={22} color="var(--accent-gold)" />
        <input
          type="text"
          placeholder="Search by doctor name, specialty, or health condition..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#FFF',
            fontSize: '1rem',
            fontFamily: 'var(--font-family-body)',
          }}
        />
        <button className="btn btn-primary" style={{ padding: '10px 24px' }}>
          Search
        </button>
      </div>

      {/* Specialty Filter Pills */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '50px',
      }}>
        {SPECIALTIES.map((specialty) => {
          const isSelected = selectedSpecialty === specialty;
          return (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                fontSize: '0.85rem',
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {specialty}
            </button>
          );
        })}
      </div>

      {/* Trust Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        maxWidth: '960px',
        margin: '0 auto',
      }}>
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <Video size={28} color="var(--accent-gold)" style={{ marginBottom: '8px' }} />
          <h3 style={{ fontSize: '1.6rem', color: '#FFF' }}>10,000+</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Video Consultations</p>
        </div>

        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <Award size={28} color="var(--accent-mint)" style={{ marginBottom: '8px' }} />
          <h3 style={{ fontSize: '1.6rem', color: '#FFF' }}>50+ Certified</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ayurvedic Experts</p>
        </div>

        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <HeartHandshake size={28} color="var(--accent-gold)" style={{ marginBottom: '8px' }} />
          <h3 style={{ fontSize: '1.6rem', color: '#FFF' }}>99.4%</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Patient Satisfaction</p>
        </div>
      </div>
    </section>
  );
};
