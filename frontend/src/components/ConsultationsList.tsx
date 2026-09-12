import React, { useState } from 'react';
import type { Consultation } from '../types';
import { Video, Calendar, Clock, FileText } from 'lucide-react';

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
                  <span className={`badge ${item.status === 'SCHEDULED' ? 'badge-gold' : 'badge-mint'}`}>
                    {item.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} color="var(--accent-mint)" />{' '}
                    {item.startTime ? new Date(item.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Tomorrow'}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="var(--accent-gold)" />{' '}
                    {item.startTime ? new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM'}
                  </span>
                  <span style={{ color: 'var(--accent-mint)', fontWeight: 600 }}>{item.type} Consultation</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {item.prescription && (
                <button
                  onClick={() => setSelectedPrescription(item)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                >
                  <FileText size={16} /> Prescription
                </button>
              )}

              <button
                onClick={() => onJoinCall(item)}
                className="btn btn-mint"
                style={{ fontSize: '0.85rem', padding: '8px 20px' }}
              >
                <Video size={16} /> Join Consultation
              </button>
            </div>
          </div>

          {/* Prescription Preview */}
          {selectedPrescription?.id === item.id && item.prescription && (
            <div style={{
              marginTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '16px',
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h5 style={{ color: 'var(--accent-gold)', fontSize: '0.95rem' }}>🌿 Ayurvedic Prescription</h5>
                <button onClick={() => setSelectedPrescription(null)} style={{ background: 'none', border: 'none', color: '#AAA', cursor: 'pointer' }}>Close</button>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#FFF', marginBottom: '8px' }}>
                <strong>Diagnosis:</strong> {item.prescription.diagnosis}
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <strong>Medicines:</strong>
                <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                  {item.prescription.medicines.map((m, i) => (
                    <li key={i} style={{ marginBottom: '2px' }}>
                      <span style={{ color: '#FFF', fontWeight: 600 }}>{m.name}</span> — {m.dosage} ({m.frequency})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
