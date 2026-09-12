import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShieldCheck, Phone, ShoppingBag, User, LogOut, Menu, X, Stethoscope, Pill, Calendar } from 'lucide-react';

interface EnterpriseNavbarProps {
  activeTab: 'home' | 'pharmacy' | 'dashboard';
  setActiveTab: (tab: 'home' | 'pharmacy' | 'dashboard') => void;
}

export const EnterpriseNavbar: React.FC<EnterpriseNavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { cartCount, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg-navy-dark)' }}>
      {/* Top ISO/GMP Compliance Ticker Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #09203F 0%, #1E3E62 50%, #00ADB5 100%)',
        padding: '6px 16px',
        fontSize: '0.75rem',
        color: '#E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div className="container-responsive" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <ShieldCheck size={14} color="var(--teal-glow)" />
            <span>ISO 9001:2026 & GMP Certified • AYUSH Ministry Compliant Platform</span>
          </div>

          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '16px', fontWeight: 500 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={12} color="var(--teal-glow)" /> 24/7 Medical Helpline: 1800-AMRUTAM
            </span>
            <span style={{ color: 'var(--teal-glow)', fontWeight: 700 }}>● Live Clinic Active</span>
          </div>
        </div>
      </div>

      {/* Main Corporate Header */}
      <div style={{
        background: 'rgba(11, 25, 44, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-card)',
        padding: '14px 0',
      }}>
        <div className="container-responsive" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--teal-primary) 0%, var(--bg-navy-main) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              boxShadow: '0 4px 15px rgba(0, 173, 181, 0.3)',
              border: '1px solid var(--teal-glow)',
            }}>
              <Stethoscope size={24} color="var(--teal-glow)" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.35rem', color: '#FFF', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                AMRUTAM <span style={{ color: 'var(--teal-glow)', fontWeight: 400 }}>PHARMA</span>
              </h1>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.08em', fontWeight: 600 }}>
                ENTERPRISE TELEMEDICINE & FORMULATIONS
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('home')}
              className={`btn ${activeTab === 'home' ? 'btn-teal' : 'btn-outline'}`}
              style={{ fontSize: '0.88rem' }}
            >
              <Stethoscope size={16} /> Doctor Clinic
            </button>

            <button
              onClick={() => setActiveTab('pharmacy')}
              className={`btn ${activeTab === 'pharmacy' ? 'btn-teal' : 'btn-outline'}`}
              style={{ fontSize: '0.88rem' }}
            >
              <Pill size={16} /> Pharmacy Catalog
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated) openAuthModal('login');
                else setActiveTab('dashboard');
              }}
              className={`btn ${activeTab === 'dashboard' ? 'btn-teal' : 'btn-outline'}`}
              style={{ fontSize: '0.88rem' }}
            >
              <Calendar size={16} /> Patient Portal
            </button>
          </nav>

          {/* User Account & Cart Actions */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Cart Pill */}
            <button
              onClick={openCart}
              className="btn btn-outline"
              style={{ position: 'relative', padding: '8px 16px', borderColor: cartCount > 0 ? 'var(--teal-primary)' : undefined }}
            >
              <ShoppingBag size={18} color="var(--teal-glow)" />
              <span style={{ fontSize: '0.85rem' }}>Cart</span>
              {cartCount > 0 && (
                <span style={{
                  background: 'var(--emerald-botanical)',
                  color: '#FFF',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  borderRadius: 'var(--radius-full)',
                  padding: '2px 8px',
                  marginLeft: '4px',
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  background: 'var(--teal-light)',
                  border: '1px solid rgba(0, 173, 181, 0.35)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <User size={16} color="var(--teal-glow)" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user?.fullName || user?.email}
                  </span>
                  <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>{user?.role}</span>
                </div>
                <button onClick={logout} className="btn btn-outline" title="Logout" style={{ padding: '8px 12px' }}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => openAuthModal('login')} className="btn btn-outline" style={{ fontSize: '0.88rem' }}>
                  Login
                </button>
                <button onClick={() => openAuthModal('register')} className="btn btn-teal" style={{ fontSize: '0.88rem' }}>
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="hide-desktop btn btn-outline"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ padding: '8px 12px' }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div style={{
          background: '#07111E',
          borderBottom: '1px solid var(--border-card)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }} className="hide-desktop">
          <button
            onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
            className={`btn ${activeTab === 'home' ? 'btn-teal' : 'btn-outline'}`}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Stethoscope size={18} /> Doctor Teleconsultation Clinic
          </button>

          <button
            onClick={() => { setActiveTab('pharmacy'); setIsMobileMenuOpen(false); }}
            className={`btn ${activeTab === 'pharmacy' ? 'btn-teal' : 'btn-outline'}`}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Pill size={18} /> Amrutam Pharmacy Catalog
          </button>

          <button
            onClick={() => { setIsMobileMenuOpen(false); openCart(); }}
            className="btn btn-teal"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <ShoppingBag size={18} /> View Cart ({cartCount} Items)
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (!isAuthenticated) openAuthModal('login');
              else setActiveTab('dashboard');
            }}
            className={`btn ${activeTab === 'dashboard' ? 'btn-teal' : 'btn-outline'}`}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Calendar size={18} /> My Consultations & Orders
          </button>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '4px' }}>
            {isAuthenticated ? (
              <button onClick={logout} className="btn btn-outline" style={{ width: '100%' }}>
                <LogOut size={16} /> Logout ({user?.fullName || user?.email})
              </button>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button onClick={() => { setIsMobileMenuOpen(false); openAuthModal('login'); }} className="btn btn-outline">
                  Login
                </button>
                <button onClick={() => { setIsMobileMenuOpen(false); openAuthModal('register'); }} className="btn btn-teal">
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
