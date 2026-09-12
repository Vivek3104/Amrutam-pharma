import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { VideoRoomModal } from '../components/VideoRoomModal';
import type { Consultation } from '../types';
import { MOCK_CONSULTATIONS, MOCK_PRODUCTS } from '../api/client';
import { Stethoscope, Calendar, Clock, Video, Plus, CheckCircle2, ShieldCheck, IndianRupee, FileText, UserCheck } from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments] = useState<Consultation[]>(MOCK_CONSULTATIONS);
  const [activeVideoCall, setActiveVideoCall] = useState<Consultation | null>(null);

  // Slot Addition State
  const [newSlotDate, setNewSlotDate] = useState('2026-09-15');
  const [newSlotTime, setNewSlotTime] = useState('11:00');
  const [slotCreatedToast, setSlotCreatedToast] = useState(false);

  // Prescription Generator State
  const [selectedConsultationForRx, setSelectedConsultationForRx] = useState<Consultation | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(MOCK_PRODUCTS[0].name);
  const [dosage, setDosage] = useState('1 tbsp twice daily after meals');
  const [notes, setNotes] = useState('Maintain warm light Ayurvedic diet. Avoid cold processed foods.');
  const [rxSavedToast, setRxSavedToast] = useState(false);

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setSlotCreatedToast(true);
    setTimeout(() => setSlotCreatedToast(false), 3000);
  };

  const handleSaveRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedConsultationForRx) {
      selectedConsultationForRx.prescription = {
        diagnosis,
        medicines: [{ name: selectedMedicine, dosage, frequency: 'Daily' }],
        notes,
      };
    }
    setRxSavedToast(true);
    setTimeout(() => {
      setRxSavedToast(false);
      setSelectedConsultationForRx(null);
    }, 1500);
  };

  const docProfile = user?.doctorProfile || {
    registrationNo: 'AYUSH-DEL-2012-8841',
    specialization: 'Senior Ayurvedic Physician & Kayachikitsa Expert',
    hospitalAffiliation: 'Amrutam Central Research Institute, New Delhi',
    experienceYears: 14,
    consultationFee: 750,
  };

  return (
    <div className="container-responsive" style={{ padding: '40px 24px 60px 24px' }}>
      
      {/* Toast Feedbacks */}
      {slotCreatedToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          background: 'var(--bg-navy-surface)',
          border: '1px solid var(--emerald-botanical)',
          color: '#FFF',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-glow)',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <CheckCircle2 size={18} color="var(--emerald-botanical)" />
          New Consultation Slot Added & Synchronized to Clinic Grid!
        </div>
      )}

      {/* Header Medical Banner */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--teal-primary) 0%, var(--bg-navy-main) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              boxShadow: '0 4px 15px rgba(0, 173, 181, 0.4)',
              border: '2px solid var(--teal-glow)',
            }}>
              <Stethoscope size={32} color="var(--teal-glow)" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-teal">Certified Ayurvedic Doctor</span>
                <span style={{ color: 'var(--emerald-botanical)', fontSize: '0.78rem', fontWeight: 700 }}>● Active & Accepting Patients</span>
              </div>

              <h2 style={{ fontSize: '1.8rem', color: '#FFF', marginBottom: '2px' }}>
                {user?.fullName || 'Dr. Vaidya Ananya Sharma'}
              </h2>

              <p style={{ fontSize: '0.85rem', color: 'var(--teal-glow)', fontWeight: 600 }}>
                {docProfile.specialization} — License: {docProfile.registrationNo}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--border-subtle)',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              textAlign: 'right',
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Consultation Fee</span>
              <span style={{ fontSize: '1.2rem', color: '#FFF', fontWeight: 800 }}>₹{docProfile.consultationFee} / Session</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '36px',
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <UserCheck size={24} color="var(--teal-glow)" style={{ marginBottom: '8px' }} />
          <h3 style={{ fontSize: '1.6rem', color: '#FFF' }}>1,240+</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Patients Healed</p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <Calendar size={24} color="var(--emerald-botanical)" style={{ marginBottom: '8px' }} />
          <h3 style={{ fontSize: '1.6rem', color: '#FFF' }}>{appointments.length}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Today's Scheduled Appointments</p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <IndianRupee size={24} color="var(--amber-gold)" style={{ marginBottom: '8px' }} />
          <h3 style={{ fontSize: '1.6rem', color: '#FFF' }}>₹48,750</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monthly Teleconsultation Revenue</p>
        </div>
      </div>

      {/* Grid: Patient Queue & Slot Management */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px', marginBottom: '40px' }}>
        
        {/* Patient Queue & Call Trigger */}
        <div>
          <h3 style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={20} color="var(--teal-glow)" /> Patient Queue & Telemedicine Room
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {appointments.map((item) => (
              <div key={item.id} className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span className="badge badge-teal" style={{ marginBottom: '4px' }}>Patient #P-100</span>
                    <h4 style={{ fontSize: '1.1rem', color: '#FFF' }}>Test Patient (Vivek Panchal)</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Mode: <span style={{ color: 'var(--teal-glow)', fontWeight: 600 }}>{item.type} Consultation</span>
                    </p>
                  </div>
                  <span className="badge badge-emerald">Ready for Call</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                  <button
                    onClick={() => setActiveVideoCall(item)}
                    className="btn btn-emerald"
                    style={{ flex: 1, fontSize: '0.85rem', padding: '8px 14px' }}
                  >
                    <Video size={16} /> Launch Video Call
                  </button>

                  <button
                    onClick={() => setSelectedConsultationForRx(item)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                  >
                    <FileText size={16} /> Write Rx
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slot Management Tool */}
        <div>
          <h3 style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="var(--amber-gold)" /> Manage Consultation Availability Slots
          </h3>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', color: '#FFF', marginBottom: '14px' }}>Create New Slot</h4>

            <form onSubmit={handleAddSlot} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Select Consultation Date
                </label>
                <input
                  type="date"
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  className="input-field"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Select Start Time
                </label>
                <input
                  type="time"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="input-field"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <button type="submit" className="btn btn-teal" style={{ marginTop: '6px' }}>
                <Plus size={16} /> Add Slot to Clinic Schedule
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Prescription Generator Modal */}
      {selectedConsultationForRx && (
        <div className="modal-overlay" onClick={() => setSelectedConsultationForRx(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: '4px' }}>
              Ayurvedic e-Prescription Generator
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--teal-glow)', marginBottom: '20px' }}>
              Patient: Test Patient • Doctor: {user?.fullName} ({docProfile.registrationNo})
            </p>

            {rxSavedToast ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <CheckCircle2 size={56} color="var(--emerald-botanical)" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.4rem', color: '#FFF' }}>e-Prescription Saved!</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Sent to Patient Portal & Amrutam Pharmacy Fulfillment.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveRx} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Ayurvedic Diagnosis (Nidana / Dosha Imbalance)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vata-Pitta Agnimandya (Gut & Metabolic Distress)"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Select Amrutam Formulation
                  </label>
                  <select
                    value={selectedMedicine}
                    onChange={(e) => setSelectedMedicine(e.target.value)}
                    className="input-field"
                    style={{ background: '#07111E' }}
                  >
                    {MOCK_PRODUCTS.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.dosageForm})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Dosage & Frequency Instructions
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 tbsp twice daily after meals with lukewarm milk"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Pathya Ahara (Dietary & Lifestyle Advice)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input-field"
                  />
                </div>

                <button type="submit" className="btn btn-emerald" style={{ marginTop: '8px' }}>
                  <ShieldCheck size={18} /> Sign & Issue e-Prescription
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {activeVideoCall && (
        <VideoRoomModal
          consultation={activeVideoCall}
          onClose={() => setActiveVideoCall(null)}
        />
      )}
    </div>
  );
};
