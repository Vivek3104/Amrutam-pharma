import React, { useState } from 'react';

export interface HealingConcern {
  id: string;
  name: string;
  subtitle?: string;
  slideIndex?: number;
  icon: React.ReactNode;
}

interface HealingConcernsSectionProps {
  onSelectConcern?: (concern: HealingConcern) => void;
}

export const HealingConcernsSection: React.FC<HealingConcernsSectionProps> = ({
  onSelectConcern,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeConcern, setActiveConcern] = useState<string | null>(null);

  const CONCERNS: HealingConcern[] = [
    {
      id: 'period',
      name: 'Period',
      slideIndex: 0,
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21V12" />
          <path d="M7 6C5 6 3 8 3 10.5C3 13 4.5 14.5 7 15C9 15.4 11 14 12 12C13 14 15 15.4 17 15C19.5 14.5 21 13 21 10.5C21 8 19 6 17 6" />
          <circle cx="7" cy="8" r="1.2" fill="currentColor" />
          <circle cx="17" cy="8" r="1.2" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'sexual',
      name: 'Sexual',
      slideIndex: 4,
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="14" r="5" />
          <path d="M19 5L13.5 10.5" />
          <path d="M14 5H19V10" />
          <path d="M10 19V22" />
          <path d="M8 21H12" />
        </svg>
      ),
    },
    {
      id: 'immunity',
      name: 'Immunity',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22S4 18 4 10V4L12 2L20 4V10C20 18 12 22 12 22Z" />
          <path d="M12 8V14" />
          <path d="M12 11C13.5 9.5 15 10 15 11" />
          <path d="M12 13C10.5 11.5 9 12 9 13" />
        </svg>
      ),
    },
    {
      id: 'hair',
      name: 'Hair',
      slideIndex: 3,
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 11C6 8 8 8 10 11C12 14 14 14 16 11C18 8 20 8 22 11" />
          <path d="M4 15C6 12 8 12 10 15C12 18 14 18 16 15C18 12 20 12 22 15" />
        </svg>
      ),
    },
    {
      id: 'skin',
      name: 'Skin',
      slideIndex: 1,
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" />
        </svg>
      ),
    },
    {
      id: 'liver',
      name: 'Liver',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 7C10 5 18 6 20 9C21.5 11.5 20 15 18 17C15 20 11 19 8 18C4.5 16.5 3 13 4 10C4.5 8.5 5 7.5 6 7Z" />
          <path d="M11 10C12.5 11.5 15 12 17 12" />
        </svg>
      ),
    },
    // Row 3 & 4 (Expanded items)
    {
      id: 'stomach',
      name: 'Stomach',
      slideIndex: 2,
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 4C9 4 11 6 11 8C11 12 5 13 5 17C5 19.5 7.5 21 11 21C16 21 19 18 19 13C19 8 16 5 13 4" />
          <path d="M9 4V2" />
        </svg>
      ),
    },
    {
      id: 'mind',
      name: 'Mind',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 4a3.5 3.5 0 0 0-3.5 3.5c0 .7.2 1.4.6 2A3.5 3.5 0 0 0 4 13c0 1.2.6 2.3 1.5 3A3.5 3.5 0 0 0 9 19.5c.7 0 1.3-.2 1.9-.5.6.9 1.6 1.5 2.8 1.5" />
          <path d="M14.5 4a3.5 3.5 0 0 1 3.5 3.5c0 .7-.2 1.4-.6 2A3.5 3.5 0 0 1 20 13c0 1.2-.6 2.3-1.5 3a3.5 3.5 0 0 1-3.5 3.5c-.7 0-1.3-.2-1.9-.5-.6.9-1.6 1.5-2.8 1.5" />
          <path d="M12 4v16" />
        </svg>
      ),
    },
    {
      id: 'lungs',
      name: 'Lungs',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v7" />
          <path d="M9 7l3 3 3-3" />
          <path d="M10 10C7 10 4 12 4 16c0 3.5 2.5 5 5.5 5 1.5 0 2.5-1 2.5-3v-8" />
          <path d="M14 10C17 10 20 12 20 16c0 3.5-2.5 5-5.5 5-1.5 0-2.5-1-2.5-3v-8" />
        </svg>
      ),
    },
    {
      id: 'bone',
      name: 'Bone',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 5.5a2.5 2.5 0 0 0-4.3-1.8l-7.4 7.4a2.5 2.5 0 1 0 3.5 3.5l7.4-7.4A2.5 2.5 0 0 0 17 5.5Z" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="6" r="2" />
        </svg>
      ),
    },
    {
      id: 'dental',
      name: 'Dental',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 4C5 4 4 6 4 9C4 13 6 18 8 20C9.5 21.5 10.5 18 12 18C13.5 18 14.5 21.5 16 20C18 18 20 13 20 9C20 6 19 4 17 4C14.5 4 13.5 6 12 6C10.5 6 9.5 4 7 4Z" />
        </svg>
      ),
    },
    {
      id: 'eyes',
      name: 'Eyes',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 10a2 2 0 0 1 2 2" />
        </svg>
      ),
    },
  ];

  const visibleConcerns = isExpanded ? CONCERNS : CONCERNS.slice(0, 6);

  const handleCardClick = (concern: HealingConcern) => {
    setActiveConcern(concern.id);
    onSelectConcern?.(concern);
  };

  return (
    <section
      id="healing-concerns-section"
      style={{
        width: '100%',
        padding: 'clamp(52px, 7vw, 92px) 20px clamp(48px, 6vw, 84px)',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .healing-grid-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          width: 100%;
          max-width: 980px;
          margin-bottom: 40px;
          transition: all 0.4s ease;
        }

        @media (max-width: 860px) {
          .healing-grid-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 520px) {
          .healing-grid-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 28px;
          }
          .healing-card {
            padding: 18px 12px;
            min-height: 104px;
            gap: 10px;
            border-radius: 16px;
          }
          .healing-icon-badge {
            width: 44px;
            height: 44px;
          }
        }

        .healing-card {
          background-color: #F8FAF8;
          border: 1px solid #D6E4DA;
          border-radius: 18px;
          padding: 26px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
          position: relative;
          min-height: 128px;
          box-sizing: border-box;
        }

        .healing-card:hover {
          transform: translateY(-4px);
          border-color: #3A644B;
          background-color: #F2F8F4;
          box-shadow: 0 12px 28px -6px rgba(45, 76, 58, 0.12);
        }

        .healing-card:active {
          transform: translateY(-1px) scale(0.985);
        }

        .healing-card.active {
          border-color: #1E4332;
          background-color: #EBF3ED;
          box-shadow: 0 0 0 2px #1E4332;
        }

        .healing-icon-badge {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background-color: #EBF3ED;
          color: #315B43;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .healing-card:hover .healing-icon-badge {
          background-color: #2D4C3A;
          color: #FFFFFF;
          transform: scale(1.08) rotate(4deg);
          box-shadow: 0 6px 16px rgba(45, 76, 58, 0.22);
        }

        .expand-toggle-btn {
          background-color: #2D4C3A;
          color: #FFFFFF;
          border: none;
          padding: 13px 40px;
          border-radius: 9999px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(45, 76, 58, 0.2);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          letter-spacing: 0.01em;
        }

        .expand-toggle-btn:hover {
          background-color: #1E3729;
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(45, 76, 58, 0.3);
        }

        .expand-toggle-btn:active {
          transform: translateY(0);
        }

        @keyframes cardFadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(22px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .card-stagger-enter {
          animation: cardFadeSlideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div style={{ maxWidth: '980px', width: '100%', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Section Heading */}
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.3rem, 5vw, 3.6rem)',
            fontWeight: 500,
            color: '#1E3E2B',
            margin: '0 0 clamp(32px, 4.5vw, 48px) 0',
            lineHeight: 1.2,
            letterSpacing: '-0.015em',
          }}
        >
          What are you
          <br />
          healing today?
        </h2>

        {/* Responsive Grid */}
        <div className="healing-grid-container">
          {visibleConcerns.map((concern, index) => {
            const isNewlyExpanded = index >= 6;
            return (
              <div
                key={concern.id}
                onClick={() => handleCardClick(concern)}
                className={`healing-card ${activeConcern === concern.id ? 'active' : ''} ${
                  isNewlyExpanded ? 'card-stagger-enter' : ''
                }`}
                style={{
                  animationDelay: isNewlyExpanded ? `${(index - 6) * 0.045}s` : '0s',
                }}
              >
                <div className="healing-icon-badge">
                  {concern.icon}
                </div>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '17px',
                    fontWeight: 500,
                    color: '#243B2E',
                    letterSpacing: '0.01em',
                  }}
                >
                  {concern.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Expand / Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="expand-toggle-btn"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
        </button>

      </div>
    </section>
  );
};

export default HealingConcernsSection;
