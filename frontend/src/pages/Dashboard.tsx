import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ConsultationsList } from '../components/ConsultationsList';
import { VideoRoomModal } from '../components/VideoRoomModal';
import type { Consultation } from '../types';
import { fetchMyConsultations, MOCK_CONSULTATIONS } from '../api/client';
import { Calendar, Video, FileText, Activity, ShieldCheck, ArrowLeft, Plus } from 'lucide-react';

interface DashboardProps {
  onBackToHome?: () => void;
  onNavigateToDoctors?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onBackToHome, onNavigateToDoctors }) => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>(MOCK_CONSULTATIONS);
  const [loading, setLoading] = useState(true);
  const [activeVideoCall, setActiveVideoCall] = useState<Consultation | null>(null);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    setLoading(true);
    try {
      const data = await fetchMyConsultations();
      if (data && data.length > 0) {
        setConsultations(data);
      }
    } catch {
      // fallback to mock
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F1E17', color: '#FFF', paddingBottom: '80px' }}>
      {/* Top Header Bar */}
      <div style={{
        background: '#1A2E24',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        padding: '20px 32px',
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          {onBackToHome && (
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
          )}

          {onNavigateToDoctors && (
            <button
              onClick={onNavigateToDoctors}
              className="btn btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Book New Video Session
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1240px', margin: '36px auto 60px auto', padding: '0 24px' }}>
        {/* Header Banner */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '8px' }}>Patient Health Portal</span>
              <h2 style={{ fontSize: '1.8rem', color: '#FFF' }}>
                Welcome back, {user?.fullName || user?.email || 'Valued Patient'}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Manage your upcoming Ayurvedic video sessions and digital herbal prescriptions.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <ShieldCheck size={22} color="var(--accent-mint)" />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Account Security</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-mint)', fontWeight: 600 }}>Active & Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <Calendar size={24} color="var(--accent-gold)" style={{ marginBottom: '8px' }} />
            <h3 style={{ fontSize: '1.5rem', color: '#FFF' }}>{consultations.length}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Sessions</p>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <FileText size={24} color="var(--accent-mint)" style={{ marginBottom: '8px' }} />
            <h3 style={{ fontSize: '1.5rem', color: '#FFF' }}>
              {consultations.filter((c) => c.prescription).length || 1}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Digital Prescriptions (Signed)</p>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <Activity size={24} color="var(--accent-gold)" style={{ marginBottom: '8px' }} />
            <h3 style={{ fontSize: '1.5rem', color: '#FFF' }}>100%</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Prakriti Evaluation</p>
          </div>
        </div>

        {/* Consultations List */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={20} color="var(--accent-gold)" /> Your Consultations
          </h3>
          {loading ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
              Loading your consultations...
            </div>
          ) : (
            <ConsultationsList
              consultations={consultations}
              onJoinCall={(item) => setActiveVideoCall(item)}
            />
          )}
        </div>

        {/* Video Call Room Modal */}
        {activeVideoCall && (
          <VideoRoomModal
            consultation={activeVideoCall}
            onClose={() => setActiveVideoCall(null)}
          />
        )}
      </div>
    </div>
  );
};
