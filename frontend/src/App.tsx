import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Sparkles, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard'>('home');

  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Navigation Bar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Page Content */}
        <main style={{ flex: 1 }}>
          {activeTab === 'home' ? <Home /> : <Dashboard />}
        </main>

        {/* Authentication Modal */}
        <AuthModal />

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid var(--border-glass)',
          background: 'rgba(4, 16, 12, 0.95)',
          padding: '40px 24px 30px 24px',
          marginTop: 'auto',
        }}>
          <div style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color="var(--accent-gold)" />
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>AMRUTAM TELEMEDICINE</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>— Authentic Holistic Healthcare</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Crafted with <Heart size={14} color="#EF4444" fill="#EF4444" /> for Amrutam Engineering Team © 2026
            </p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
};

export default App;
