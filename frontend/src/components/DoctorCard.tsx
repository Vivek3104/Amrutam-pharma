import React from 'react';
import type { Doctor } from '../types';
import { Star, IndianRupee, CalendarCheck, ShieldCheck, Award, Building2 } from 'lucide-react';

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
      {/* Top Corporate Accent Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, var(--teal-primary) 0%, var(--emerald-botanical) 100%)',
      }} />

      <div>
        {/* Header: Photo, Reg No, Rating */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
          <img
            src={doctor.imageUrl}
            alt={doctor.fullName}
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '20px',
              objectFit: 'cover',
              border: '2px solid var(--border-card)',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>
                <Award size={12} /> {doctor.experienceYears} Yrs Exp
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--amber-gold)',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}>
                <Star size={14} fill="var(--amber-gold)" /> {doctor.rating}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', color: '#FFF', marginBottom: '2px' }}>
              {doctor.fullName}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--teal-glow)', fontWeight: 600 }}>
              {doctor.specialization}
            </p>
          </div>
        </div>

        {/* AYUSH Registration & Hospital Affiliation */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 12px',
          marginBottom: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          fontSize: '0.78rem',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={14} color="var(--emerald-botanical)" />
            <span><strong>License:</strong> {doctor.registrationNo}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <Building2 size={14} color="var(--teal-primary)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {doctor.hospitalAffiliation}
            </span>
          </div>
        </div>

        {/* Bio Excerpt */}
        <p style={{
          fontSize: '0.86rem',
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
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Consultation Fee</span>
          <div style={{ display: 'flex', alignItems: 'center', color: '#FFF', fontWeight: 800, fontSize: '1.2rem' }}>
            <IndianRupee size={16} color="var(--teal-glow)" /> {doctor.consultationFee}
          </div>
        </div>

        <button
          onClick={() => onBook(doctor)}
          className="btn btn-teal"
          style={{ padding: '9px 20px', fontSize: '0.88rem' }}
        >
          <CalendarCheck size={16} /> Book Clinic Slot
        </button>
      </div>
    </div>
  );
};
