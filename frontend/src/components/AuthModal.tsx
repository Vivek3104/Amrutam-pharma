import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, Phone, Loader2, Stethoscope, Heart, Award, Building2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authMode, authRole, closeAuthModal, openAuthModal, setAuthRole, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [specialization, setSpecialization] = useState('Kayachikitsa & General Medicine');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('Amrutam Ayurveda Research Centre');
  const [experienceYears, setExperienceYears] = useState(8);
  const [consultationFee, setConsultationFee] = useState(700);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (authMode === 'login') {
        await login(email, password, authRole);
      } else {
        const extraData = authRole === 'DOCTOR' ? {
          registrationNo,
          specialization,
          hospitalAffiliation,
          experienceYears,
          consultationFee,
        } : undefined;

        await register(email, password, fullName, authRole, phone, extraData);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <button
          onClick={closeAuthModal}
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

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: authRole === 'DOCTOR' 
              ? 'linear-gradient(135deg, var(--teal-primary) 0%, #07111E 100%)'
              : 'linear-gradient(135deg, var(--emerald-botanical) 0%, #07111E 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            marginBottom: '12px',
            border: '1px solid var(--border-card)',
          }}>
            {authRole === 'DOCTOR' ? <Stethoscope size={26} color="var(--teal-glow)" /> : <Heart size={26} color="var(--emerald-botanical)" />}
          </div>

          <h2 style={{ fontSize: '1.4rem', color: '#FFF' }}>
            {authRole === 'DOCTOR' ? 'Doctor & Vaidya Medical Portal' : 'Amrutam Patient Portal'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {authRole === 'DOCTOR'
              ? 'Manage consultations, issue e-prescriptions & review patients'
              : 'Access your Ayurvedic video appointments & herbal orders'}
          </p>
        </div>

        {/* 1. Primary Role Selection Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
        }}>
          <button
            type="button"
            onClick={() => setAuthRole('PATIENT')}
            className={`btn ${authRole === 'PATIENT' ? 'btn-teal' : 'btn-outline'}`}
            style={{ fontSize: '0.82rem', padding: '8px', borderRadius: 'var(--radius-sm)' }}
          >
            🌿 Patient Login
          </button>

          <button
            type="button"
            onClick={() => setAuthRole('DOCTOR')}
            className={`btn ${authRole === 'DOCTOR' ? 'btn-teal' : 'btn-outline'}`}
            style={{ fontSize: '0.82rem', padding: '8px', borderRadius: 'var(--radius-sm)' }}
          >
            🩺 Doctor / Vaidya Login
          </button>
        </div>

        {/* 2. Login vs Register Mode Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '10px',
          marginBottom: '20px',
        }}>
          <button
            type="button"
            onClick={() => openAuthModal('login', authRole)}
            style={{
              background: 'none',
              border: 'none',
              color: authMode === 'login' ? 'var(--teal-glow)' : 'var(--text-muted)',
              fontSize: '0.9rem',
              fontWeight: authMode === 'login' ? 700 : 500,
              cursor: 'pointer',
              borderBottom: authMode === 'login' ? '2px solid var(--teal-glow)' : '2px solid transparent',
              paddingBottom: '6px',
            }}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => openAuthModal('register', authRole)}
            style={{
              background: 'none',
              border: 'none',
              color: authMode === 'register' ? 'var(--teal-glow)' : 'var(--text-muted)',
              fontSize: '0.9rem',
              fontWeight: authMode === 'register' ? 700 : 500,
              cursor: 'pointer',
              borderBottom: authMode === 'register' ? '2px solid var(--teal-glow)' : '2px solid transparent',
              paddingBottom: '6px',
            }}
          >
            New {authRole === 'DOCTOR' ? 'Doctor Registration' : 'Patient Account'}
          </button>
        </div>

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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {authMode === 'register' && (
            <>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  {authRole === 'DOCTOR' ? 'Doctor Full Name (e.g. Dr. Vaidya Ananya Sharma)' : 'Full Name'}
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  <input
                    type="text"
                    required
                    placeholder={authRole === 'DOCTOR' ? 'Dr. Firstname Lastname' : 'Vivek Panchal'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              {/* Specific Fields for Doctor Registration */}
              {authRole === 'DOCTOR' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      AYUSH / Medical Council Registration Number
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Award size={18} color="var(--teal-glow)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. AYUSH-DEL-2012-8841"
                        value={registrationNo}
                        onChange={(e) => setRegistrationNo(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '40px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Specialization
                    </label>
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="input-field"
                      style={{ background: '#07111E' }}
                    >
                      <option value="Kayachikitsa & General Medicine">Kayachikitsa & General Medicine</option>
                      <option value="Skin & Ayurvedic Dermatology">Skin & Ayurvedic Dermatology</option>
                      <option value="Women Health & Gynaecology">Women Health & Gynaecology</option>
                      <option value="Panchakarma & Detox Therapy">Panchakarma & Detox Therapy</option>
                      <option value="Gut Health & Digestion">Gut Health & Digestion</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Hospital / Clinic Affiliation
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Building2 size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amrutam Central Research Hospital"
                        value={hospitalAffiliation}
                        onChange={(e) => setHospitalAffiliation(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '40px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        Consultation Fee (₹)
                      </label>
                      <input
                        type="number"
                        min="100"
                        step="50"
                        value={consultationFee}
                        onChange={(e) => setConsultationFee(Number(e.target.value))}
                        className="input-field"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              {authRole === 'DOCTOR' ? 'Official Doctor Email' : 'Email Address'}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
              <input
                type="email"
                required
                placeholder={authRole === 'DOCTOR' ? 'doctor@amrutam.co' : 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-teal" style={{ marginTop: '10px', width: '100%', padding: '12px' }}>
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : authMode === 'login' ? (
              authRole === 'DOCTOR' ? 'Login to Doctor Portal' : 'Login to Patient Portal'
            ) : (
              authRole === 'DOCTOR' ? 'Register Medical License & Account' : 'Create Patient Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
