import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  RefreshCw,
  LogOut,
  User,
  Sliders,
  Truck,
} from 'lucide-react';

interface AuthModalProps {
  onOpenAdminDashboard?: () => void;
  onOpenTracking?: (phoneOrRef?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onOpenAdminDashboard, onOpenTracking }) => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authRole,
    setAuthRole,
    sendCustomerOtp,
    loginWithOtp,
    loginAdmin,
    user,
    isAuthenticated,
    isAdmin,
    logout,
  } = useAuth();

  // Customer OTP flow states
  const [customerStep, setCustomerStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  // Admin login states
  const [adminIdentifier, setAdminIdentifier] = useState('admin@amrutam.co');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);

  // Reset states when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setCustomerStep('PHONE');
      setErrorMsg(null);
      setOtp('');
      setDevOtpHint(null);
    }
  }, [isAuthModalOpen, authRole]);

  // Resend OTP countdown timer
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

  // Send Customer OTP
  const handleCustomerSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await sendCustomerOtp(cleanPhone);
      setIsLoading(false);
      setCustomerStep('OTP');
      setResendTimer(30);
      setDevOtpHint(res.devOtp || '4821');
      setOtp(res.devOtp || '4821');
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Failed to send OTP. Please try again.');
    }
  };

  // Verify Customer OTP
  const handleCustomerVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setErrorMsg('Please enter the 4-digit verification code');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      await loginWithOtp(phone, otp);
    } catch (err: any) {
      setErrorMsg('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend Customer OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const res = await sendCustomerOtp(phone);
      setResendTimer(30);
      setDevOtpHint(res.devOtp || '4821');
      setOtp(res.devOtp || '4821');
    } finally {
      setIsLoading(false);
    }
  };

  // Admin Login Handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminIdentifier || !adminPassword) {
      setErrorMsg('Please enter both Admin ID and Password');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      await loginAdmin(adminIdentifier, adminPassword);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid admin credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={closeAuthModal}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(20, 32, 22, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FAF5EE',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
          border: '1px solid #E2D7C9',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: '#273C2E',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: '#F0E7DC',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4B5E53',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#E5DBD0')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#F0E7DC')}
        >
          <X size={18} />
        </button>

        {/* ALREADY LOGGED IN VIEW */}
        {isAuthenticated && user ? (
          <div style={{ padding: '36px 28px', textAlign: 'center' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: isAdmin ? '#FEF3C7' : '#EAF4ED',
                border: `2px solid ${isAdmin ? '#FCD34D' : '#C4DCCB'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: isAdmin ? '#B45309' : '#265438',
              }}
            >
              {isAdmin ? <Sliders size={32} /> : <User size={34} />}
            </div>

            <span
              style={{
                backgroundColor: isAdmin ? '#FEF3C7' : '#EFF7F1',
                color: isAdmin ? '#92400E' : '#15803D',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '8px',
              }}
            >
              {isAdmin ? '🛡️ Amrutam Site Administrator' : '🌿 Customer Portal'}
            </span>

            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1E3F2B',
                margin: '0 0 6px 0',
              }}
            >
              {user.fullName || (isAdmin ? 'Site Administrator' : 'Customer')}
            </h3>

            <p style={{ fontSize: '0.9rem', color: '#6A7D72', marginBottom: '20px' }}>
              {user.phone || user.email || '+91 98000 00000'}
            </p>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2D7C9',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'left',
                marginBottom: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5B6F62' }}>
                <span>Authentication:</span>
                <span style={{ fontWeight: 700, color: '#16A34A' }}>Verified & Active ✓</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5B6F62' }}>
                <span>Privileges:</span>
                <span style={{ fontWeight: 600, color: '#1E3F2B' }}>
                  {isAdmin ? 'Full Site Management & Order Control' : 'Online Store Orders & Express Delivery'}
                </span>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => {
                  closeAuthModal();
                  onOpenAdminDashboard?.();
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#1A3E29',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '13px',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                  boxShadow: '0 4px 14px rgba(26, 62, 41, 0.25)',
                }}
              >
                <Sliders size={18} />
                <span>Open Admin Management Dashboard</span>
              </button>
            )}

            {!isAdmin && (
              <button
                onClick={() => {
                  closeAuthModal();
                  onOpenTracking?.(user.phone);
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#1A3E29',
                  color: '#FDE68A',
                  border: '1px solid #D97706',
                  borderRadius: '12px',
                  padding: '13px',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                  boxShadow: '0 4px 14px rgba(26, 62, 41, 0.25)',
                }}
              >
                <Truck size={18} color="#FDE68A" />
                <span>Track My Live Orders</span>
              </button>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={closeAuthModal}
                style={{
                  flex: 1,
                  backgroundColor: '#3A643B',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Continue Browsing
              </button>
              <button
                onClick={() => logout()}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#DC2626',
                  border: '1px solid #FCA5A5',
                  borderRadius: '12px',
                  padding: '12px 18px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header with Forest Green Branding */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1A3E29 0%, #2A583B 100%)',
                padding: '28px 28px 20px',
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.16)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                }}
              >
                {authRole === 'ADMIN' ? (
                  <Sliders size={24} color="#FDE68A" />
                ) : (
                  <Phone size={24} color="#FFFFFF" />
                )}
              </div>

              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  margin: '0 0 4px 0',
                  color: '#FFFFFF',
                }}
              >
                {authRole === 'ADMIN' ? 'Admin Management Portal' : 'Customer Mobile Login'}
              </h2>
              <p style={{ margin: 0, fontSize: '0.84rem', opacity: 0.88 }}>
                {authRole === 'ADMIN'
                  ? 'Sign in to manage products, customer orders, and site metrics'
                  : 'Enter your mobile number to sign in or register instantly'}
              </p>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '22px 28px 26px' }}>
              
              {/* Only TWO Logins: Customer and Admin */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '6px',
                  backgroundColor: '#EDE3D5',
                  padding: '4px',
                  borderRadius: '12px',
                  marginBottom: '20px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setAuthRole('CUSTOMER')}
                  style={{
                    border: 'none',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: authRole === 'CUSTOMER' ? '#3A643B' : 'transparent',
                    color: authRole === 'CUSTOMER' ? '#FFFFFF' : '#4E6255',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Phone size={14} />
                  <span>Customer (OTP)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthRole('ADMIN')}
                  style={{
                    border: 'none',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: authRole === 'ADMIN' ? '#1A3E29' : 'transparent',
                    color: authRole === 'ADMIN' ? '#FFFFFF' : '#4E6255',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Sliders size={14} />
                  <span>Admin Portal</span>
                </button>
              </div>

              {/* Error Notification */}
              {errorMsg && (
                <div
                  style={{
                    backgroundColor: '#FEE2E2',
                    border: '1px solid #FCA5A5',
                    color: '#DC2626',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    marginBottom: '16px',
                    textAlign: 'center',
                  }}
                >
                  {errorMsg}
                </div>
              )}

              {/* ================= CUSTOMER LOGIN TAB ================= */}
              {authRole === 'CUSTOMER' && (
                <>
                  {customerStep === 'PHONE' ? (
                    <form onSubmit={handleCustomerSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#274433', display: 'block', marginBottom: '8px' }}>
                          Enter Customer Mobile Number
                        </label>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#FFFFFF',
                            border: '1.5px solid #D8CCBE',
                            borderRadius: '12px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: '#F3EAE0',
                              padding: '12px 14px',
                              fontSize: '0.92rem',
                              fontWeight: 700,
                              color: '#264A35',
                              borderRight: '1px solid #D8CCBE',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <Phone size={15} color="#3A643B" />
                            <span>+91</span>
                          </div>
                          <input
                            autoFocus
                            required
                            type="tel"
                            maxLength={10}
                            placeholder="98000 00000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            style={{
                              flex: 1,
                              border: 'none',
                              outline: 'none',
                              padding: '12px 14px',
                              fontSize: '1.05rem',
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              letterSpacing: '0.04em',
                              color: '#1E3F2B',
                              fontWeight: 600,
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#7E8F84', marginTop: '6px', display: 'block' }}>
                          A 4-digit code will be generated to sign in to your customer account.
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                          backgroundColor: '#3A643B',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '14px',
                          fontSize: '0.96rem',
                          fontWeight: 700,
                          cursor: isLoading ? 'wait' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 6px 18px rgba(58, 100, 59, 0.25)',
                          marginTop: '4px',
                        }}
                      >
                        <span>{isLoading ? 'Sending Code...' : 'Get Customer OTP'}</span>
                        <ArrowRight size={18} />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleCustomerVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div
                        style={{
                          backgroundColor: '#EFF7F1',
                          border: '1px solid #C5DFCC',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.84rem',
                          color: '#265438',
                        }}
                      >
                        <span>OTP sent to <strong>+91 {phone}</strong></span>
                        <button
                          type="button"
                          onClick={() => setCustomerStep('PHONE')}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#3A643B',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: '0.82rem',
                          }}
                        >
                          Change
                        </button>
                      </div>

                      {devOtpHint && (
                        <div
                          style={{
                            backgroundColor: '#FFF8EB',
                            border: '1px dashed #D99B26',
                            borderRadius: '10px',
                            padding: '10px 14px',
                            fontSize: '0.82rem',
                            color: '#925C05',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>Verification Code: <strong>{devOtpHint}</strong></span>
                          <button
                            type="button"
                            onClick={() => setOtp(devOtpHint)}
                            style={{
                              backgroundColor: '#3A643B',
                              color: '#FFF',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '3px 8px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Auto-fill
                          </button>
                        </div>
                      )}

                      <div>
                        <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#274433', display: 'block', marginBottom: '8px' }}>
                          Enter 4-Digit OTP
                        </label>
                        <input
                          autoFocus
                          required
                          type="text"
                          maxLength={4}
                          placeholder="• • • •"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          style={{
                            width: '100%',
                            textAlign: 'center',
                            padding: '14px',
                            borderRadius: '12px',
                            border: '1.5px solid #3A643B',
                            backgroundColor: '#FFFFFF',
                            fontSize: '1.6rem',
                            fontWeight: 800,
                            letterSpacing: '0.35em',
                            color: '#1E3F2B',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                        <span style={{ color: '#6A7D72' }}>Didn't receive code?</span>
                        {resendTimer > 0 ? (
                          <span style={{ color: '#88988D', fontWeight: 600 }}>
                            Resend in {resendTimer}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#3A643B',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <RefreshCw size={12} /> Resend OTP
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                          backgroundColor: '#3A643B',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '14px',
                          fontSize: '0.96rem',
                          fontWeight: 700,
                          cursor: isLoading ? 'wait' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 6px 18px rgba(58, 100, 59, 0.25)',
                          marginTop: '4px',
                        }}
                      >
                        <span>{isLoading ? 'Verifying...' : 'Verify & Log In'}</span>
                        <CheckCircle2 size={18} />
                      </button>
                    </form>
                  )}
                </>
              )}

              {/* ================= ADMIN LOGIN TAB ================= */}
              {authRole === 'ADMIN' && (
                <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div
                    style={{
                      backgroundColor: '#FEF3C7',
                      border: '1px solid #FCD34D',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '0.78rem',
                      color: '#92400E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Pre-filled credentials for instant admin access</span>
                    <span style={{ fontWeight: 700 }}>admin123</span>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#274433', display: 'block', marginBottom: '6px' }}>
                      Admin Identifier / Email
                    </label>
                    <input
                      required
                      type="text"
                      value={adminIdentifier}
                      onChange={(e) => setAdminIdentifier(e.target.value)}
                      placeholder="admin@amrutam.co"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #D8CCBE',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.94rem',
                        fontWeight: 600,
                        color: '#1E3F2B',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#274433', display: 'block', marginBottom: '6px' }}>
                      Admin Security Password
                    </label>
                    <input
                      required
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #D8CCBE',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.94rem',
                        fontWeight: 600,
                        color: '#1E3F2B',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      backgroundColor: '#1A3E29',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px',
                      fontSize: '0.96rem',
                      fontWeight: 700,
                      cursor: isLoading ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 18px rgba(26, 62, 41, 0.3)',
                      marginTop: '4px',
                    }}
                  >
                    <span>{isLoading ? 'Authenticating Admin...' : 'Sign In as Site Admin'}</span>
                    <ShieldCheck size={18} />
                  </button>
                </form>
              )}

              {/* Security Trust Note */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.76rem',
                  color: '#7A8C81',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid #E6DDD2',
                }}
              >
                <Lock size={13} color="#3A643B" />
                <span>Connected to Amrutam Ayurvedic Secure Backend (Port 3000)</span>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};
