import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { EnterpriseNavbar } from './components/EnterpriseNavbar';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { Home } from './pages/Home';
import { PharmacyCatalog } from './components/PharmacyCatalog';
import { Dashboard } from './pages/Dashboard';
import { ShieldCheck, Heart, Building2, Mail, Phone, MapPin } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'pharmacy' | 'dashboard'>('home');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-navy-dark)' }}>
      {/* Enterprise Navigation Header */}
      <EnterpriseNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Dynamic Page Views */}
      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <Home onExplorePharmacyClick={() => setActiveTab('pharmacy')} />
        )}

        {activeTab === 'pharmacy' && <PharmacyCatalog />}

        {activeTab === 'dashboard' && <Dashboard />}
      </main>

      {/* Slide-over Shopping Cart Drawer */}
      <CartDrawer />

      {/* Auth Modal */}
      <AuthModal />

      {/* Corporate Enterprise Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-card)',
        background: '#040C16',
        padding: '50px 0 30px 0',
        marginTop: 'auto',
      }}>
        <div className="container-responsive">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
            marginBottom: '40px',
          }}>
            {/* Brand & ISO */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Building2 size={24} color="var(--teal-glow)" />
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>AMRUTAM PHARMACEUTICALS</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
                Enterprise Telemedicine & GMP-certified Classical Ayurvedic Formulations. ISO 9001:2026 Certified Facility.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--emerald-botanical)', fontSize: '0.8rem', fontWeight: 600 }}>
                <ShieldCheck size={16} /> AYUSH Ministry License No: AYU-DEL-4011
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ color: '#FFF', fontSize: '0.95rem', marginBottom: '14px' }}>Quick Portals</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <li><a onClick={() => setActiveTab('home')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Doctor Teleconsultation Clinic</a></li>
                <li><a onClick={() => setActiveTab('pharmacy')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Amrutam Pharmacy Catalog</a></li>
                <li><a onClick={() => setActiveTab('dashboard')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Patient Portal & e-Prescriptions</a></li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h4 style={{ color: '#FFF', fontSize: '0.95rem', marginBottom: '14px' }}>Corporate Headquarters</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="var(--teal-glow)" /> Amrutam House, Institutional Area, New Delhi
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} color="var(--teal-glow)" /> 1800-AMRUTAM (Toll Free 24/7)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} color="var(--teal-glow)" /> support@amrutam.co
                </li>
              </ul>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8rem',
            color: 'var(--text-dim)',
          }}>
            <p>© 2026 Amrutam Pharmaceuticals Ltd. All rights reserved.</p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Crafted for Amrutam Client Team <Heart size={12} color="#EF4444" fill="#EF4444" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
