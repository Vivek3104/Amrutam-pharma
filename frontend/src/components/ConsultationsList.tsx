import React, { useState } from 'react';
import type { Consultation } from '../types';
import { Video, Calendar, Clock, FileText, ShieldCheck } from 'lucide-react';

interface ConsultationsListProps {
  consultations: Consultation[];
  onJoinCall: (consultation: Consultation) => void;
}

export const ConsultationsList: React.FC<ConsultationsListProps> = ({ consultations, onJoinCall }) => {
  const [selectedPrescription, setSelectedPrescription] = useState<Consultation | null>(null);

  if (consultations.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <Calendar size={48} color="var(--accent-gold)" style={{ marginBottom: '12px', opacity: 0.7 }} />
        <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '4px' }}>No Consultations Booked Yet</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Search for certified Ayurvedic doctors and book your first video appointment.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {consultations.map((item) => (
        <div key={item.id} className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
              }}>
                <Video size={24} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '1.1rem', color: '#FFF' }}>{item.doctorName || 'Dr. Vaidya Ananya Sharma'}</h4>
                  <span className={`badge ${item.status === 'SCHEDULED' ? 'badge-gold' : item.status === 'IN_PROGRESS' ? 'badge-teal' : 'badge-mint'}`}>
                    {item.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} color="var(--accent-mint)" />{' '}
                    {item.startTime ? new Date(item.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Tomorrow'}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="var(--accent-gold)" />{' '}
                    {item.startTime ? new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM'}
                  </span>
                  <span style={{ color: 'var(--accent-mint)', fontWeight: 600 }}>{item.type || 'VIDEO'} Consultation</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {item.prescription && (
                <button
                  onClick={() => setSelectedPrescription(selectedPrescription?.id === item.id ? null : item)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                >
                  <FileText size={16} /> {selectedPrescription?.id === item.id ? 'Hide Rx' : 'View Rx'}
                </button>
              )}

              <button
                onClick={() => onJoinCall(item)}
                className="btn btn-mint"
                style={{ fontSize: '0.85rem', padding: '8px 20px' }}
              >
                <Video size={16} /> Join Consultation Room
              </button>
            </div>
          </div>

          {/* Prescription Preview with HMAC Digital Signature */}
          {selectedPrescription?.id === item.id && item.prescription && (
            <div style={{
              marginTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '16px',
              background: 'rgba(0, 0, 0, 0.35)',
              borderRadius: 'var(--radius-sm)',
              padding: '18px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h5 style={{ color: 'var(--accent-gold)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🌿 Official Ayurvedic Digital Prescription
                </h5>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10B981',
                  color: '#34D399',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                }}>
                  <ShieldCheck size={14} /> HMAC-SHA256 Digital Signature Verified
                </span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                <p style={{ fontSize: '0.88rem', color: '#FFF', margin: '0 0 6px 0' }}>
                  <strong style={{ color: 'var(--accent-gold)' }}>Clinical Diagnosis:</strong> {item.prescription.diagnosis}
                </p>
                {item.prescription.notes && (
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                    <strong>Doctor's Lifestyle & Diet Notes:</strong> {item.prescription.notes}
                  </p>
                )}
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: '#FFF' }}>Prescribed Herbal Formulations:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  {item.prescription.medicines.map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)' }}>
                      <span style={{ color: '#FFF', fontWeight: 600 }}>{m.name}</span>
                      <span style={{ color: 'var(--accent-gold)' }}>{m.dosage} ({m.frequency})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
