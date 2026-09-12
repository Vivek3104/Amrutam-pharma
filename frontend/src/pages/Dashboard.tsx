import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ConsultationsList } from '../components/ConsultationsList';
import { VideoRoomModal } from '../components/VideoRoomModal';
import type { Consultation } from '../types';
import { MOCK_CONSULTATIONS } from '../api/client';
import { Calendar, Video, FileText, Activity, ShieldCheck } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [consultations] = useState<Consultation[]>(MOCK_CONSULTATIONS);
  const [activeVideoCall, setActiveVideoCall] = useState<Consultation | null>(null);

  return (
    <div style={{ maxWidth: '1240px', margin: '40px auto 60px auto', padding: '0 24px' }}>
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
          <h3 style={{ fontSize: '1.5rem', color: '#FFF' }}>1</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Scheduled Sessions</p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <FileText size={24} color="var(--accent-mint)" style={{ marginBottom: '8px' }} />
          <h3 style={{ fontSize: '1.5rem', color: '#FFF' }}>1</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Digital Prescriptions</p>
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
        <ConsultationsList
          consultations={consultations}
          onJoinCall={(item) => setActiveVideoCall(item)}
        />
      </div>

      {/* Video Call Room Modal */}
      {activeVideoCall && (
        <VideoRoomModal
          consultation={activeVideoCall}
          onClose={() => setActiveVideoCall(null)}
        />
      )}
    </div>
  );
};
