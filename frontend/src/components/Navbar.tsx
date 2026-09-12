import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Calendar, User, LogOut, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'dashboard';
  setActiveTab: (tab: 'home' | 'dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(7, 25, 19, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
      padding: '14px 24px',
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-gold) 0%, #0F382C 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#071913',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', color: '#FFF', lineHeight: 1 }}>AMRUTAM</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', letterSpacing: '0.1em', fontWeight: 600 }}>TELEMEDICINE</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('home')}
            className={`btn ${activeTab === 'home' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.9rem' }}
          >
            <Activity size={16} /> Find Doctors
          </button>

          <button
            onClick={() => {
              if (!isAuthenticated) openAuthModal('login');
              else setActiveTab('dashboard');
            }}
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.9rem' }}
          >
            <Calendar size={16} /> My Consultations
          </button>
        </nav>

        {/* User Action / Profile */}
        <div>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <User size={16} color="var(--accent-gold)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {user?.fullName || user?.email}
                </span>
                <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{user?.role}</span>
              </div>
              <button 
                onClick={logout} 
                className="btn btn-secondary" 
                title="Logout"
                style={{ padding: '8px 12px', borderRadius: 'var(--radius-full)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => openAuthModal('login')} className="btn btn-secondary">
                Login
              </button>
              <button onClick={() => openAuthModal('register')} className="btn btn-primary">
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
