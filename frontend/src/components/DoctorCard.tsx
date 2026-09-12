import React from 'react';
import type { Doctor } from '../types';
import { Star, IndianRupee, CalendarCheck } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
  return (
    <div className="glass-panel glass-panel-hover" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top Banner Accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, var(--accent-gold) 0%, var(--accent-mint) 100%)',
      }} />

      <div>
        {/* Header: Photo & Rating */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
          <img
            src={doctor.imageUrl}
            alt={doctor.fullName}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '18px',
              objectFit: 'cover',
              border: '2px solid var(--border-glass)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                {doctor.experienceYears} Years Exp
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--accent-gold)',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}>
                <Star size={14} fill="var(--accent-gold)" /> {doctor.rating}
              </span>
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#FFF', marginBottom: '4px' }}>
              {doctor.fullName}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--accent-mint)', fontWeight: 600 }}>
              {doctor.specialization}
            </p>
          </div>
        </div>

        {/* Bio Excerpt */}
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          marginBottom: '20px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.6em',
        }}>
          {doctor.bio}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Consultation Fee</span>
          <div style={{ display: 'flex', alignItems: 'center', color: '#FFF', fontWeight: 700, fontSize: '1.1rem' }}>
            <IndianRupee size={16} color="var(--accent-gold)" /> {doctor.consultationFee}
          </div>
        </div>

        <button
          onClick={() => onBook(doctor)}
          className="btn btn-primary"
          style={{ padding: '8px 20px', fontSize: '0.88rem' }}
        >
          <CalendarCheck size={16} /> Book Slot
        </button>
      </div>
    </div>
  );
};
