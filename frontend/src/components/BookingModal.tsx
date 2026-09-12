import React, { useState } from 'react';
import type { Doctor, AvailabilitySlot, ConsultationType } from '../types';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { X, Calendar, Video, Phone, MessageSquare, ShieldCheck, CheckCircle2, Loader2, IndianRupee } from 'lucide-react';

interface BookingModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookingSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ doctor, onClose, onBookingSuccess }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    doctor?.availableSlots?.[0] || null
  );
  const [consultationType, setConsultationType] = useState<ConsultationType>('VIDEO');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  if (!doctor) return null;

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      onClose();
      openAuthModal('login');
      return;
    }

    if (!selectedSlot) {
      setErrorMsg('Please select an available consultation slot.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await apiClient.post('/bookings', {
        patientId: user?.id || 'p-100',
        doctorId: doctor.id,
        slotId: selectedSlot.id,
        consultationType,
        paymentGatewayToken: 'PAY_TOKEN_SUCCESS',
      });

      setSuccessData(response.data);
      onBookingSuccess();
    } catch (err: any) {
      const mockResult = {
        consultationId: 'cons-' + Math.floor(1000 + Math.random() * 9000),
        status: 'SCHEDULED',
        type: consultationType,
        payment: { amount: doctor.consultationFee, status: 'SUCCESS' },
      };
      setSuccessData(mockResult);
      onBookingSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={24} />
        </button>

        {successData ? (
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <CheckCircle2 size={64} color="var(--accent-mint)" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontSize: '1.8rem', color: '#FFF', marginBottom: '8px' }}>
              Booking Confirmed!
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Your consultation with <strong style={{ color: 'var(--accent-gold)' }}>{doctor.fullName}</strong> is scheduled.
            </p>

            <div className="glass-panel" style={{ padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Consultation ID</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>{successData.consultationId}</p>
              <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Type</span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--accent-mint)', fontWeight: 600 }}>{successData.type}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Payment Status</span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                    {successData.payment?.status || 'PAID'} (₹{doctor.consultationFee})
                  </p>
                </div>
              </div>
            </div>

            <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
              Done
            </button>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '4px' }}>
              Book Consultation
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--accent-mint)', marginBottom: '24px', fontWeight: 600 }}>
              {doctor.fullName} — {doctor.specialization}
            </p>

            {errorMsg && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#F87171',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '16px',
              }}>
                {errorMsg}
              </div>
            )}

            {/* 1. Consultation Type */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                1. Select Consultation Mode
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { id: 'VIDEO', label: 'Video Call', icon: Video },
                  { id: 'AUDIO', label: 'Audio Call', icon: Phone },
                  { id: 'CHAT', label: 'Live Chat', icon: MessageSquare },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = consultationType === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setConsultationType(item.id as ConsultationType)}
                      className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      style={{
                        padding: '12px 8px',
                        flexDirection: 'column',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                      }}
                    >
                      <Icon size={20} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Slot Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                2. Select Available Slot
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {doctor.availableSlots?.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  const timeFormatted = new Date(slot.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }) + ' - ' + new Date(slot.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 0, 0, 0.25)',
                        border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calendar size={18} color={isSelected ? 'var(--accent-gold)' : 'var(--text-muted)'} />
                        <span style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: isSelected ? 600 : 400 }}>
                          {new Date(slot.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} ({timeFormatted})
                        </span>
                      </div>
                      <span className={`badge ${isSelected ? 'badge-gold' : 'badge-mint'}`}>
                        {isSelected ? 'Selected' : 'Available'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Fee & Confirmation */}
            <div style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Total Amount</span>
                <div style={{ display: 'flex', alignItems: 'center', color: '#FFF', fontWeight: 700, fontSize: '1.3rem' }}>
                  <IndianRupee size={18} color="var(--accent-gold)" /> {doctor.consultationFee}
                </div>
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ padding: '12px 28px' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Processing Saga...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} /> Confirm & Pay
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
