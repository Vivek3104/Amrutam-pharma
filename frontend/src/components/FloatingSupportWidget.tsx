import React, { useState, useEffect } from 'react';
import { ChevronUp, X } from 'lucide-react';

export const FloatingSupportWidget: React.FC = () => {
  const [showPill, setShowPill] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 240);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
        pointerEvents: 'none',
      }}
    >
      <style>{`
        .ask-amrutam-container {
          display: flex;
          align-items: center;
          gap: 10px;
          pointer-events: auto;
          cursor: pointer;
          transition: transform 0.25s ease;
        }

        .ask-amrutam-container:hover {
          transform: translateY(-2px);
        }

        .ask-pill {
          background-color: #2CA766;
          color: #FFFFFF;
          padding: 8px 14px;
          border-radius: 9999px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(44, 167, 102, 0.35);
          transition: all 0.25s ease;
        }

        .avatar-circle {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2.5px solid #FFFFFF;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          overflow: visible;
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .online-dot {
          position: absolute;
          bottom: 1px;
          right: 1px;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background-color: #10B981;
          border: 2px solid #FFFFFF;
        }

        .notif-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: #E53E3E;
          color: #FFFFFF;
          border: 2px solid #FFFFFF;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(229, 62, 62, 0.4);
        }

        .scroll-top-btn {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          background-color: #FFFFFF;
          border: 1px solid #E2ECE5;
          color: #2D4C3A;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          pointer-events: auto;
          transition: all 0.25s ease;
        }

        .scroll-top-btn:hover {
          background-color: #F4F8F5;
          border-color: #2D4C3A;
          transform: translateY(-2px);
        }
      `}</style>

      {/* Floating Doctor / Ask Amrutam Widget */}
      <div className="ask-amrutam-container" onClick={() => setShowConsultModal(!showConsultModal)}>
        {showPill && (
          <div className="ask-pill" onClick={(e) => e.stopPropagation()}>
            <span>Need help? Ask Amrutam</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPill(false);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                padding: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                opacity: 0.85,
              }}
              aria-label="Close help pill"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="avatar-circle">
          <img
            src="/assets/doctor_avatar.jpg"
            alt="Amrutam Ayurvedic Doctor"
            className="avatar-img"
          />
          <div className="online-dot" />
          <div className="notif-badge">1</div>
        </div>
      </div>

      {/* In-App Doctor Consultation Assistant Card (Demo - No External Links) */}
      {showConsultModal && (
        <div
          style={{
            pointerEvents: 'auto',
            width: '320px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 16px 40px rgba(25, 45, 35, 0.22)',
            border: '1px solid #D9E5DC',
            padding: '20px',
            boxSizing: 'border-box',
            animation: 'fadeIn 0.25s ease',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: '#1E3E2B',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
              <span style={{ fontWeight: 700, fontSize: '14.5px', color: '#1B3827' }}>Ayurvedic Doctor Online</span>
            </div>
            <button
              onClick={() => setShowConsultModal(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6A7D71' }}
            >
              <X size={18} />
            </button>
          </div>

          <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#485C50', margin: '0 0 14px 0' }}>
            Namaste! Connect with our certified Ayurvedic physicians for personalized herbal guidance and Prakriti analysis.
          </p>

          <div style={{ backgroundColor: '#F4FAF6', borderRadius: '10px', padding: '12px', fontSize: '12.5px', marginBottom: '14px', color: '#274C37' }}>
            <div><strong>Helpline:</strong> +91 98000 00000</div>
            <div style={{ marginTop: '4px' }}><strong>Email:</strong> care@amrutam-wellness.demo</div>
            <div style={{ marginTop: '4px' }}><strong>Clinic:</strong> 108, Herbal Garden Path, New Delhi</div>
          </div>

          <button
            onClick={() => {
              alert('Demo Consultation Scheduled! An Ayurvedic specialist will reach out shortly.');
              setShowConsultModal(false);
            }}
            style={{
              width: '100%',
              backgroundColor: '#2E5738',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '10px',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            Request Free Callback
          </button>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="scroll-top-btn"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
};

export default FloatingSupportWidget;
