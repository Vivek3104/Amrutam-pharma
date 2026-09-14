import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  ShieldCheck,
  Lock,
  LogOut,
  User as UserIcon,
  Sliders,
  Stethoscope,
} from 'lucide-react';

interface AuthModalProps {
  onOpenAdminDashboard?: () => void;
  onOpenTracking?: (phoneOrRef?: string) => void;
  onNavigateToDoctorDashboard?: () => void;
  onNavigateToPatientDashboard?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onOpenAdminDashboard,
  onOpenTracking,
  onNavigateToDoctorDashboard,
  onNavigateToPatientDashboard,
}) => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authRole,
    setAuthRole,
    sendCustomerOtp,
    loginWithOtp,
    loginWithPassword,
    registerUser,
    setupMFA,
    verifyMFA,
    loginAdmin,
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  // Mode: 'LOGIN' or 'REGISTER' or 'MFA_CHALLENGE' or 'MFA_SETUP'
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER' | 'MFA_CHALLENGE' | 'MFA_SETUP'>('LOGIN');

  // Customer / Patient Phone & Email State
  const [customerStep, setCustomerStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [patientAuthType, setPatientAuthType] = useState<'PHONE' | 'EMAIL'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [activeDevOtp, setActiveDevOtp] = useState<string | null>(null);

  // Email / Password Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Doctor Registration fields
  const [specialty, setSpecialty] = useState('Senior Ayurvedic Physician & Kayachikitsa Expert');
  const [experienceYears, setExperienceYears] = useState('12');
  const [consultationFee, setConsultationFee] = useState('750');

  // MFA Challenge State
  const [mfaChallengeCode, setMfaChallengeCode] = useState('');
  const [mfaSetupData, setMfaSetupData] = useState<{ secret: string; qrCodeUrl: string } | null>(null);
  const [mfaVerifyCode, setMfaVerifyCode] = useState('');
  const [mfaSuccessMsg, setMfaSuccessMsg] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(45);

  // Reset states on open
  useEffect(() => {
    if (isAuthModalOpen) {
      setErrorMsg(null);
      setCustomerStep('PHONE');
      setPatientAuthType('PHONE');
      setActiveDevOtp(null);
      setAuthMode('LOGIN');
      if (authRole === 'DOCTOR') {
        setEmail('dr.ayurveda@amrutam.co');
        setPassword('Password@123');
      } else if (authRole === 'ADMIN') {
        setEmail('admin@amrutam.co');
        setPassword('admin123');
      } else {
        setPhone('');
        setOtp('');
      }
    }
  }, [isAuthModalOpen, authRole]);

  // Resend OTP countdown
  useEffect(() => {
    let interval: any;
    if (customerStep === 'OTP' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [customerStep, resendTimer]);

  if (!isAuthModalOpen) return null;

  // 1. Send Customer OTP (Real Carrier SMS & Email via Bird)
  const handleCustomerSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const target = patientAuthType === 'EMAIL' ? email : phone;
    if (patientAuthType === 'PHONE') {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number');
        return;
      }
    } else {
      if (!email || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address');
        return;
      }
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await sendCustomerOtp(target);
      setIsLoading(false);
      setCustomerStep('OTP');
      setResendTimer(45);
      setOtp('');
      if (res.devOtp) {
        setActiveDevOtp(res.devOtp);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.');
    }
  };

  // 2. Verify Customer OTP (Real 6-digit code via Bird / Cryptographic Token)
  const handleCustomerVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setErrorMsg('Please enter the 6-digit verification code');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const target = patientAuthType === 'EMAIL' ? email : phone;
      await loginWithOtp(target, otp);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Verification failed. Please try again.');
    }
  };

  // 3. Email & Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both email and password');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (authRole === 'ADMIN') {
        await loginAdmin(email, password);
      } else {
        const res = await loginWithPassword(email, password, mfaChallengeCode || undefined);
        if (res?.mfaRequired) {
          setAuthMode('MFA_CHALLENGE');
          setIsLoading(false);
          return;
        }
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Invalid credentials');
    }
  };

  // 4. Registration Submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setErrorMsg('Please fill in all required fields');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      await registerUser({
        email,
        password,
        fullName,
        role: authRole === 'DOCTOR' ? 'DOCTOR' : 'PATIENT',
        phone,
        specialty: authRole === 'DOCTOR' ? specialty : undefined,
        experienceYears: authRole === 'DOCTOR' ? parseInt(experienceYears, 10) : undefined,
        consultationFee: authRole === 'DOCTOR' ? parseFloat(consultationFee) : undefined,
      });
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Registration failed');
    }
  };

  // 5. Setup MFA flow
  const handleInitiateMFASetup = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await setupMFA();
      setMfaSetupData(data);
      setAuthMode('MFA_SETUP');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to initialize MFA');
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Verify MFA Code during setup
  const handleConfirmMFASetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaVerifyCode || mfaVerifyCode.length < 6) {
      setErrorMsg('Please enter the 6-digit TOTP code');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await verifyMFA(mfaVerifyCode);
      setMfaSuccessMsg('Two-Factor Authentication is now enabled for your account!');
      setTimeout(() => {
        setAuthMode('LOGIN');
        setMfaSetupData(null);
        setMfaSuccessMsg(null);
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal} style={{ zIndex: 9999 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          padding: '32px',
          background: '#1A2920',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '16px',
          color: '#FFF',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
          }}
        >
          <X size={22} />
        </button>

        {/* LOGGED IN PROFILE VIEW */}
        {isAuthenticated && user ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3A643B 0%, #2E4E30 100%)',
                  border: '2px solid #D4AF37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                }}
              >
                {user.fullName ? user.fullName[0].toUpperCase() : 'A'}
              </div>
              <div>
                <span
                  className="badge"
                  style={{
                    background: user.role === 'DOCTOR' ? '#00ADB5' : user.role === 'ADMIN' ? '#D4AF37' : '#3A643B',
                    color: '#FFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {user.role} ACCOUNT
                </span>
                <h3 style={{ fontSize: '1.3rem', color: '#FFF', marginTop: '4px' }}>
                  {user.fullName || user.email || 'Valued User'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                  {user.email || user.phone}
                </p>
              </div>
            </div>

            {/* Role-Specific Quick Shortcuts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {user.role === 'DOCTOR' && (
                <button
                  onClick={() => {
                    closeAuthModal();
                    if (onNavigateToDoctorDashboard) onNavigateToDoctorDashboard();
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', background: '#00ADB5', color: '#FFF' }}
                >
                  <Stethoscope size={18} /> Open Doctor Clinical Portal
                </button>
              )}

              {(user.role === 'PATIENT' || user.role === 'CUSTOMER') && (
                <button
                  onClick={() => {
                    closeAuthModal();
                    if (onNavigateToPatientDashboard) onNavigateToPatientDashboard();
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', background: '#3A643B', color: '#FFF' }}
                >
                  <UserIcon size={18} /> Open Patient Health Portal
                </button>
              )}

              {user.role === 'ADMIN' && (
                <button
                  onClick={() => {
                    closeAuthModal();
                    if (onOpenAdminDashboard) onOpenAdminDashboard();
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', background: '#D4AF37', color: '#1A2920' }}
                >
                  <Sliders size={18} /> Open Admin Operations & Analytics
                </button>
              )}

              {/* MFA Setup Shortcut */}
              <button
                onClick={handleInitiateMFASetup}
                style={{
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '8px',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#D4AF37" /> Setup Two-Factor Authentication (MFA)
                </span>
                <span style={{ color: '#D4AF37', fontSize: '0.78rem' }}>Configure →</span>
              </button>

              {onOpenTracking && (
                <button
                  onClick={() => {
                    closeAuthModal();
                    onOpenTracking(user.phone || undefined);
                  }}
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                  }}
                >
                  <span>📦 Track Orders & Active Sessions</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>View →</span>
                </button>
              )}
            </div>

            <button
              onClick={logout}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#F87171',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        ) : authMode === 'MFA_SETUP' && mfaSetupData ? (
          /* MFA SETUP SCREEN */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <ShieldCheck size={40} color="#D4AF37" style={{ margin: '0 auto 8px auto' }} />
              <h3 style={{ fontSize: '1.3rem', color: '#FFF' }}>Setup Google Authenticator (TOTP)</h3>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
                Scan this QR code with Google Authenticator, 1Password, or Authy
              </p>
            </div>

            <div style={{ textAlign: 'center', margin: '16px 0', background: '#FFF', padding: '16px', borderRadius: '12px', display: 'inline-block', width: '100%' }}>
              <img src={mfaSetupData.qrCodeUrl} alt="MFA QR Code" style={{ width: '180px', height: '180px', margin: '0 auto' }} />
              <p style={{ fontSize: '0.75rem', color: '#333', marginTop: '8px', fontFamily: 'monospace' }}>
                Secret: <strong>{mfaSetupData.secret}</strong>
              </p>
            </div>

            {mfaSuccessMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', color: '#6EE7B7', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.85rem' }}>
                {mfaSuccessMsg}
              </div>
            )}

            <form onSubmit={handleConfirmMFASetup}>
              <label style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '6px' }}>
                Enter 6-digit Code from Authenticator app:
              </label>
              <input
                type="text"
                maxLength={6}
                value={mfaVerifyCode}
                onChange={(e) => setMfaVerifyCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '1.2rem',
                  letterSpacing: '4px',
                  textAlign: 'center',
                  marginBottom: '16px',
                }}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Verify & Enable MFA
              </button>
            </form>
          </div>
        ) : authMode === 'MFA_CHALLENGE' ? (
          /* MFA CHALLENGE SCREEN DURING LOGIN */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <ShieldCheck size={40} color="#D4AF37" style={{ margin: '0 auto 8px auto' }} />
              <h3 style={{ fontSize: '1.3rem', color: '#FFF' }}>Two-Factor Authentication</h3>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
                Please enter the 6-digit verification code from your authenticator app.
              </p>
            </div>

            {errorMsg && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#F87171',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handlePasswordLogin}>
              <label style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '6px' }}>
                6-digit Authenticator Code:
              </label>
              <input
                type="text"
                maxLength={6}
                value={mfaChallengeCode}
                onChange={(e) => setMfaChallengeCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '1.4rem',
                  letterSpacing: '8px',
                  textAlign: 'center',
                  marginBottom: '16px',
                }}
                required
                autoFocus
              />
              <button
                type="submit"
                disabled={isLoading || mfaChallengeCode.length < 6}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {isLoading ? 'Verifying Code...' : 'Verify & Continue'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('LOGIN');
                  setMfaChallengeCode('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.78rem',
                  marginTop: '12px',
                  width: '100%',
                  cursor: 'pointer',
                }}
              >
                ← Back to Login
              </button>
            </form>
          </div>
        ) : (
          /* REGULAR LOGIN / REGISTER FORM */
          <div>
            {/* Header Tabs: Role Selector */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                background: 'rgba(0,0,0,0.3)',
                padding: '4px',
                borderRadius: '10px',
                marginBottom: '20px',
              }}
            >
              {[
                { id: 'PATIENT', label: 'Patient / User', icon: UserIcon },
                { id: 'DOCTOR', label: 'Doctor', icon: Stethoscope },
                { id: 'ADMIN', label: 'Admin', icon: Lock },
              ].map((tab) => {
                const isSelected = authRole === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setAuthRole(tab.id as any);
                      setErrorMsg(null);
                      if (tab.id === 'DOCTOR') {
                        setEmail('dr.ayurveda@amrutam.co');
                        setPassword('Password@123');
                      } else if (tab.id === 'ADMIN') {
                        setEmail('admin@amrutam.co');
                        setPassword('admin123');
                      } else {
                        setEmail('patient.demo@amrutam.co');
                        setPassword('Password@123');
                      }
                    }}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      background: isSelected ? '#3A643B' : 'transparent',
                      color: isSelected ? '#FFF' : 'rgba(255,255,255,0.6)',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={15} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Sub-header Title */}
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#FFF', fontWeight: 700 }}>
                {authRole === 'PATIENT'
                  ? 'Patient Sign In & Registration'
                  : authMode === 'REGISTER'
                  ? 'Create Ayurvedic Doctor Account'
                  : authRole === 'DOCTOR'
                  ? 'Doctor Clinical Portal'
                  : 'Site Administrator'}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
                {authRole === 'PATIENT'
                  ? 'Sign in or create your account using your 10-digit mobile number. Real-time SMS OTP verification every time.'
                  : authRole === 'DOCTOR'
                  ? 'Access clinical sessions, manage slot availability, and issue digital prescriptions.'
                  : 'Access platform analytics, 100k daily consultations metrics, and compliance audit trails.'}
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#F87171',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* FLOW A: PATIENT MOBILE & EMAIL OTP */}
            {authRole === 'PATIENT' ? (
              customerStep === 'PHONE' ? (
                <div>
                  {/* Selector: Mobile or Email */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '16px',
                      background: 'rgba(0,0,0,0.25)',
                      padding: '4px',
                      borderRadius: '8px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setPatientAuthType('PHONE');
                        setErrorMsg(null);
                      }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: patientAuthType === 'PHONE' ? '1px solid #D4AF37' : '1px solid transparent',
                        background: patientAuthType === 'PHONE' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                        color: patientAuthType === 'PHONE' ? '#D4AF37' : 'rgba(255,255,255,0.6)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      📱 Mobile Number
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPatientAuthType('EMAIL');
                        setErrorMsg(null);
                        if (!email) setEmail('panchalvivek501@gmail.com');
                      }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: patientAuthType === 'EMAIL' ? '1px solid #D4AF37' : '1px solid transparent',
                        background: patientAuthType === 'EMAIL' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                        color: patientAuthType === 'EMAIL' ? '#D4AF37' : 'rgba(255,255,255,0.6)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ✉️ Email Address
                    </button>
                  </div>

                  <form onSubmit={handleCustomerSendOtp}>
                    {patientAuthType === 'PHONE' ? (
                      <>
                        <label style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '6px' }}>
                          Enter 10-Digit Mobile Number
                        </label>
                        <div style={{ position: 'relative', marginBottom: '18px' }}>
                          <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                            +91
                          </span>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="98765 43210"
                            style={{
                              width: '100%',
                              padding: '12px 14px 12px 50px',
                              background: 'rgba(0,0,0,0.4)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '8px',
                              color: '#FFF',
                              fontSize: '1rem',
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <label style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '6px' }}>
                          Enter Your Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="panchalvivek501@gmail.com"
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: '#FFF',
                            fontSize: '1rem',
                            marginBottom: '18px',
                          }}
                        />
                      </>
                    )}
                    <button
                      type="submit"
                      disabled={isLoading || (patientAuthType === 'PHONE' ? phone.length < 10 : !email.includes('@'))}
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {isLoading ? 'Sending Code...' : 'Get Instant OTP →'}
                    </button>
                  </form>
                </div>
              ) : (
                <form onSubmit={handleCustomerVerifyOtp}>
                  <div
                    style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      marginBottom: '14px',
                    }}
                  >
                    <p style={{ fontSize: '0.84rem', color: '#D4AF37', margin: 0, fontWeight: 600 }}>
                      {patientAuthType === 'PHONE' ? `📲 6-digit code sent via SMS to +91 ${phone}` : `✉️ 6-digit code sent to ${email}`}
                    </p>
                    <p style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0 0' }}>
                      Enter the 6-digit verification code to securely sign in.
                    </p>
                  </div>

                  {/* Carrier DLT Notice & Auto-Fill Code */}
                  {activeDevOtp && (
                    <div
                      style={{
                        background: 'rgba(212, 175, 55, 0.12)',
                        border: '1px dashed #D4AF37',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        marginBottom: '14px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '0.74rem', color: '#D4AF37', fontWeight: 700, marginBottom: '2px' }}>
                        💡 CARRIER NOTICE (TRAI DLT FILTERING)
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                        Indian carriers may filter international trial SMS. Your instant code is:
                      </div>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: 'rgba(0,0,0,0.5)',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          border: '1px solid #D4AF37',
                        }}
                      >
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '4px', color: '#FFF' }}>
                          {activeDevOtp}
                        </span>
                        <button
                          type="button"
                          onClick={() => setOtp(activeDevOtp)}
                          style={{
                            background: '#D4AF37',
                            color: '#1A2920',
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Auto-Fill Code ⚡
                        </button>
                      </div>
                    </div>
                  )}

                  <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '6px' }}>
                    Enter 6-Digit OTP:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="••••••"
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(212, 175, 55, 0.5)',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '1.6rem',
                      letterSpacing: '10px',
                      textAlign: 'center',
                      marginBottom: '16px',
                    }}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={isLoading || otp.length < 6}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {isLoading ? 'Verifying Code...' : 'Verify & Sign In'}
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerStep('PHONE');
                        setOtp('');
                        setErrorMsg(null);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                      }}
                    >
                      ← Change {patientAuthType === 'PHONE' ? 'Mobile Number' : 'Email'}
                    </button>

                    {resendTimer > 0 ? (
                      <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                        Resend code in {resendTimer}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCustomerSendOtp()}
                        disabled={isLoading}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#D4AF37',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          fontWeight: 600,
                          textDecoration: 'underline',
                        }}
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </form>
              )
            ) : authMode === 'REGISTER' ? (
              /* FLOW B: REGISTRATION FORM */
              <form onSubmit={handleRegister}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '4px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={authRole === 'DOCTOR' ? 'Dr. Priya Patel' : 'Pooja Sharma'}
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#FFF' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@amrutam.co"
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#FFF' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '4px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#FFF' }}
                    required
                  />
                </div>

                {authRole === 'DOCTOR' && (
                  <>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '4px' }}>
                        Ayurvedic Specialization
                      </label>
                      <input
                        type="text"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#FFF' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '4px' }}>
                          Experience (Years)
                        </label>
                        <input
                          type="number"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#FFF' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '4px' }}>
                          Consultation Fee (₹)
                        </label>
                        <input
                          type="number"
                          value={consultationFee}
                          onChange={(e) => setConsultationFee(e.target.value)}
                          style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#FFF' }}
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
                >
                  {isLoading ? 'Creating Profile...' : 'Complete Registration'}
                </button>
              </form>
            ) : (
              /* FLOW C: EMAIL & PASSWORD LOGIN (DOCTOR / ADMIN / PATIENT) */
              <form onSubmit={handlePasswordLogin}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '4px' }}>
                    Email or Username
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@amrutam.co"
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#FFF' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '4px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#FFF' }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In Securely →'}
                </button>
              </form>
            )}

            {/* Toggle Login vs Register (Doctors Only) */}
            {authRole === 'DOCTOR' && (
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN');
                    setErrorMsg(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#D4AF37',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  {authMode === 'LOGIN'
                    ? "Don't have a doctor account? Register as Ayurvedic Doctor"
                    : 'Already have a doctor account? Sign in'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
