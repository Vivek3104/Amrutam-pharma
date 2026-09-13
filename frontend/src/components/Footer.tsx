import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Heart,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer
      id="amrutam-footer"
      style={{
        backgroundColor: '#1E3E2B',
        color: '#E3ECE6',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        borderTop: '4px solid #3A643B',
      }}
    >
      {/* 1. Trust & Certification Banner */}
      <div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '24px 20px',
          backgroundColor: '#163022',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(58, 100, 59, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#85E3A1',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#FFFFFF' }}>100% Ayurvedic</div>
              <div style={{ fontSize: '12px', color: '#A3C2AE' }}>Classical herbal recipes</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(58, 100, 59, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#85E3A1',
                flexShrink: 0,
              }}
            >
              <Award size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#FFFFFF' }}>GMP & Ayush Certified</div>
              <div style={{ fontSize: '12px', color: '#A3C2AE' }}>Strict quality standards</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(58, 100, 59, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#85E3A1',
                flexShrink: 0,
              }}
            >
              <Heart size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#FFFFFF' }}>Cruelty Free</div>
              <div style={{ fontSize: '12px', color: '#A3C2AE' }}>Zero parabens or sulfates</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(58, 100, 59, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#85E3A1',
                flexShrink: 0,
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#FFFFFF' }}>Doctor Consultations</div>
              <div style={{ fontSize: '12px', color: '#A3C2AE' }}>Personalized telemedicine</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(48px, 6vw, 72px) 20px clamp(36px, 4vw, 48px)' }}>
        <style>{`
          .footer-grid-layout {
            display: grid;
            grid-template-columns: 1.4fr 1fr 1fr 1fr 1.3fr;
            gap: clamp(24px, 3.5vw, 42px);
          }

          @media (max-width: 1040px) {
            .footer-grid-layout {
              grid-template-columns: 1fr 1fr;
              gap: 36px;
            }
          }

          @media (max-width: 600px) {
            .footer-grid-layout {
              grid-template-columns: 1fr;
              gap: 32px;
            }
          }

          .footer-link-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .footer-link-item {
            color: #BACFC2;
            font-size: 14px;
            text-decoration: none;
            transition: color 0.2s ease, transform 0.2s ease;
            display: inline-block;
            cursor: pointer;
          }

          .footer-link-item:hover {
            color: #85E3A1;
            transform: translateX(3px);
          }

          .footer-column-heading {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 18px;
            font-weight: 600;
            color: #FFFFFF;
            margin: 0 0 18px 0;
            letter-spacing: 0.02em;
          }

          .social-circle-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #BACFC2;
            transition: all 0.25s ease;
            text-decoration: none;
          }

          .social-circle-btn:hover {
            background-color: #3A643B;
            color: #FFFFFF;
            transform: translateY(-2px);
          }
        `}</style>

        <div className="footer-grid-layout">
          
          {/* Column 1: Brand & Contact Info */}
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '26px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#FFFFFF',
                marginBottom: '14px',
              }}
            >
              AMRUTAM
            </div>
            <p
              style={{
                fontSize: '13.5px',
                lineHeight: 1.65,
                color: '#BACFC2',
                margin: '0 0 20px 0',
              }}
            >
              Amrutam brings classical Ayurvedic wisdom to modern holistic healthcare. Formulated with pure natural herbs, ancient recipes, and certified manufacturing.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#BACFC2' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} color="#85E3A1" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>108, Herbal Garden Path, Green Valley, New Delhi, India - 110001</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="#85E3A1" style={{ flexShrink: 0 }} />
                <span>care@amrutam-wellness.demo</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="#85E3A1" style={{ flexShrink: 0 }} />
                <span>+91 98000 00000</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} color="#85E3A1" style={{ flexShrink: 0 }} />
                <span>Mon - Sat: 10:00 AM - 7:00 PM IST</span>
              </div>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className="footer-column-heading">Categories</h4>
            <ul className="footer-link-list">
              <li><span className="footer-link-item">Ayurvedic Malts & Lehyas</span></li>
              <li><span className="footer-link-item">Herbal Shampoos</span></li>
              <li><span className="footer-link-item">Hair Spas & Masks</span></li>
              <li><span className="footer-link-item">Kumkumadi & Body Oils</span></li>
              <li><span className="footer-link-item">Classical Churnas & Kwath</span></li>
              <li><span className="footer-link-item">Everyday Essentials</span></li>
            </ul>
          </div>

          {/* Column 3: Healing Concerns */}
          <div>
            <h4 className="footer-column-heading">Healing Concerns</h4>
            <ul className="footer-link-list">
              <li><span className="footer-link-item">Hair Fall & Scalp Health</span></li>
              <li><span className="footer-link-item">Period & PCOD Balance</span></li>
              <li><span className="footer-link-item">Digestive Health & Agni</span></li>
              <li><span className="footer-link-item">Reproductive & Men Vitality</span></li>
              <li><span className="footer-link-item">Skin Glow & Radiance</span></li>
              <li><span className="footer-link-item">Mind, Memory & Restful Sleep</span></li>
            </ul>
          </div>

          {/* Column 4: Information */}
          <div>
            <h4 className="footer-column-heading">Information</h4>
            <ul className="footer-link-list">
              <li><span className="footer-link-item">Our Story & Heritage</span></li>
              <li><span className="footer-link-item">Ayurvedic Telemedicine</span></li>
              <li><span className="footer-link-item">Shark Tank India Showcase</span></li>
              <li><span className="footer-link-item">Track Your Order</span></li>
              <li><span className="footer-link-item">Shipping & Returns Policy</span></li>
              <li><span className="footer-link-item">Terms & Conditions</span></li>
            </ul>
          </div>

          {/* Column 5: Newsletter & Social */}
          <div>
            <h4 className="footer-column-heading">Join the Family</h4>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#BACFC2', margin: '0 0 16px 0' }}>
              Subscribe to receive Ayurvedic wellness routines, seasonal health tips, and exclusive offers.
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#3A643B',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease',
                }}
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>

            {subscribed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#85E3A1', fontSize: '12.5px', marginBottom: '14px' }}>
                <CheckCircle2 size={14} />
                <span>Thank you for joining Amrutam!</span>
              </div>
            )}

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <a href="#" onClick={(e) => e.preventDefault()} className="social-circle-btn" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="social-circle-btn" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="social-circle-btn" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                  <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="social-circle-btn" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="social-circle-btn" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bottom Legal & Copyright Bar */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '20px 20px',
          backgroundColor: '#162F20',
          fontSize: '12.5px',
          color: '#9BB5A4',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            © 2026 Amrutam Pharmaceuticals Private Limited. All Rights Reserved. Formulated with Classical Ayurvedic Herbs in India.
          </div>
          <div style={{ display: 'flex', gap: '18px' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }}>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
