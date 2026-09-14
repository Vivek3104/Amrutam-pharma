import React, { useState } from 'react';
import type { Doctor } from '../types';
import {
  Star,
  IndianRupee,
  CalendarCheck,
  ShieldCheck,
  Award,
  Building2,
  Video,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

const DEFAULT_AVATARS: Record<string, string> = {
  'doc-1': '/images/doctors/ananya_sharma.jpg',
  'doc-2': '/images/doctors/rajesh_varma.jpg',
  'doc-3': '/images/doctors/meera_nambiar.jpg',
};

const getSpecialtyTags = (specialization: string): string[] => {
  const s = (specialization || '').toLowerCase();
  if (s.includes('kaya') || s.includes('physician')) {
    return ['Panchakarma', 'Nadi Pariksha', 'Metabolic Care'];
  }
  if (s.includes('derm') || s.includes('skin')) {
    return ['Herbal Dermatology', 'Eczema & Psoriasis', 'Rasayana'];
  }
  if (s.includes('women') || s.includes('gyn') || s.includes('hormon')) {
    return ['PCOS / PCOD Care', 'Hormonal Balance', 'Postpartum'];
  }
  if (s.includes('digest') || s.includes('gut')) {
    return ['Agni Gut Health', 'Holistic Detox', 'Dietary Therapy'];
  }
  return ['AYUSH Clinical', 'Herbal Therapy', 'Video Consultation'];
};

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
  const [imgSrc, setImgSrc] = useState<string>(
    doctor.imageUrl || DEFAULT_AVATARS[doctor.id] || '/images/doctors/ananya_sharma.jpg'
  );
  const [isHovered, setIsHovered] = useState(false);

  const specialtyTags = getSpecialtyTags(doctor.specialization);
  const nextSlot = doctor.availableSlots?.find((s) => !s.isBooked);

  const formatSlotTime = (slotTime?: string) => {
    if (!slotTime) return 'Next Slot: Available Today';
    try {
      const d = new Date(slotTime);
      return `Next Slot: Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return 'Next Slot: Available Today';
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'linear-gradient(180deg, #162B21 0%, #0F1E17 100%)',
        borderRadius: '20px',
        border: isHovered
          ? '1px solid rgba(212, 175, 55, 0.55)'
          : '1px solid rgba(212, 175, 55, 0.2)',
        boxShadow: isHovered
          ? '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 35px -5px rgba(212, 175, 55, 0.18)'
          : '0 10px 25px -10px rgba(0, 0, 0, 0.5)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px',
      }}
    >
      {/* Top Gold & Emerald Accent Gradient Strip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: isHovered
            ? 'linear-gradient(90deg, #D4AF37 0%, #10B981 50%, #D4AF37 100%)'
            : 'linear-gradient(90deg, rgba(212, 175, 55, 0.6) 0%, rgba(16, 185, 129, 0.4) 100%)',
          transition: 'background 0.3s ease',
        }}
      />

      {/* Main Content Body */}
      <div>
        {/* Header Section: Doctor Portrait, Status, Rating, Experience */}
        <div style={{ display: 'flex', gap: '18px', marginBottom: '18px', alignItems: 'flex-start' }}>
          {/* Avatar Container with Gold Border & Live Status Indicator */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={imgSrc}
              alt={doctor.fullName}
              onError={() => {
                const fallback =
                  DEFAULT_AVATARS[doctor.id] || '/images/doctors/ananya_sharma.jpg';
                if (imgSrc !== fallback) setImgSrc(fallback);
              }}
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '18px',
                objectFit: 'cover',
                border: '2.5px solid #D4AF37',
                boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.6)',
                display: 'block',
              }}
            />
            {/* Live Telemedicine Pulse Dot */}
            <div
              title="Available for Telemedicine Video Consultation"
              style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                background: '#10B981',
                border: '2.5px solid #0F1E17',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                boxShadow: '0 0 10px #10B981',
              }}
            />
          </div>

          {/* Identity & Top Badges */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Badges Row: Experience & Star Rating */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '6px',
                marginBottom: '6px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  color: '#D4AF37',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '12px',
                  letterSpacing: '0.02em',
                }}
              >
                <Award size={12} color="#D4AF37" />
                {doctor.experienceYears}+ Yrs Exp
              </span>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Star size={13} fill="#F59E0B" color="#F59E0B" />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF' }}>
                  {doctor.rating}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>
                  (250+)
                </span>
              </div>
            </div>

            {/* Doctor Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <h3
                style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: '#FAF5EE',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                {doctor.fullName}
              </h3>
              <span title="Verified AYUSH Medical Practitioner" style={{ display: 'inline-flex', flexShrink: 0 }}>
                <CheckCircle2 size={16} color="#10B981" />
              </span>
            </div>

            {/* Specialization */}
            <p
              style={{
                fontSize: '0.82rem',
                color: '#6EE7B7',
                fontWeight: 600,
                margin: '3px 0 0 0',
                lineHeight: 1.3,
              }}
            >
              {doctor.specialization}
            </p>
          </div>
        </div>

        {/* Clinical Specialty Chips */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {specialtyTags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.85)',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '3px 9px',
                borderRadius: '6px',
              }}
            >
              • {tag}
            </span>
          ))}
        </div>

        {/* License & Hospital Affiliation Card */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(212, 175, 55, 0.15)',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '0.78rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.85)' }}>
            <ShieldCheck size={14} color="#D4AF37" />
            <span>
              <strong style={{ color: 'rgba(255,255,255,0.6)' }}>AYUSH Reg:</strong> {doctor.registrationNo}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)' }}>
            <Building2 size={14} color="#10B981" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {doctor.hospitalAffiliation}
            </span>
          </div>
        </div>

        {/* Doctor Bio Snippet */}
        <p
          style={{
            fontSize: '0.84rem',
            color: 'rgba(255, 255, 255, 0.65)',
            lineHeight: 1.5,
            margin: '0 0 16px 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {doctor.bio}
        </p>

        {/* Live Slot Status Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: '#A7F3D0',
            background: 'rgba(16, 185, 129, 0.08)',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            marginBottom: '18px',
          }}
        >
          <Clock size={13} color="#10B981" />
          <span>{formatSlotTime(nextSlot?.startTime)}</span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', color: '#D4AF37' }}>
            <Video size={13} /> HD Video
          </span>
        </div>
      </div>

      {/* Footer: Fee & Action Booking Button */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Consultation Fee
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#FFF', fontWeight: 800, fontSize: '1.35rem' }}>
              <IndianRupee size={17} color="#D4AF37" />
              {doctor.consultationFee}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>/ session</span>
          </div>
        </div>

        <button
          onClick={() => onBook(doctor)}
          style={{
            background: isHovered
              ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            color: '#FFF',
            fontWeight: 700,
            fontSize: '0.88rem',
            padding: '10px 18px',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: isHovered
              ? '0 8px 20px -4px rgba(16, 185, 129, 0.6), 0 0 15px rgba(212, 175, 55, 0.3)'
              : '0 4px 12px -2px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <CalendarCheck size={16} color="#D4AF37" />
          <span>Book Clinic Slot</span>
        </button>
      </div>
    </div>
  );
};
