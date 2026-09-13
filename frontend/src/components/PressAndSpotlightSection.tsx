import React from 'react';

export interface PressLogo {
  id: string;
  name: string;
  image: string;
  height?: number;
}

export interface SpotlightItem {
  id: string;
  title: string;
  concern: string;
  categoryId: string;
  image: string;
  productName: string;
}

const PRESS_LOGOS: PressLogo[] = [
  { id: 'forbes', name: 'Forbes 30 Under 30', image: '/assets/logos/forbes.webp' },
  { id: 'shark-tank', name: 'Shark Tank India', image: '/assets/logos/shark_tank.webp' },
  { id: 'bw-40u40', name: 'BW Wellbeing World 40 Under 40', image: '/assets/logos/bw_40u40.webp' },
  { id: 'vogue', name: 'VOGUE', image: '/assets/logos/vogue.webp' },
  { id: 'yourstory', name: 'YourStory', image: '/assets/logos/yourstory.webp' },
  { id: 'living-etc', name: 'Livingetc', image: '/assets/logos/living_etc.webp' },
  { id: 'gq', name: 'GQ India', image: '/assets/logos/gq.webp' },
];

const SPOTLIGHT_ITEMS: SpotlightItem[] = [
  {
    id: 'healthy-soft-hair',
    title: 'Healthy Soft Hair',
    concern: 'Hair Care',
    categoryId: 'shampoos',
    image: '/assets/spotlight/healthy_soft_hair.webp',
    productName: 'Amrutam Kuntal Care Herbal Shampoo',
  },
  {
    id: 'radiance-pigmentation',
    title: 'Radiance & Pigmentation',
    concern: 'Skin Care',
    categoryId: 'oils',
    image: '/assets/spotlight/radiance_pigmentation.webp',
    productName: 'Amrutam Kumkumadi Oil',
  },
  {
    id: 'erectile-dysfunction',
    title: 'Erectile Dysfunction',
    concern: 'Men Vitality',
    categoryId: 'malts',
    image: '/assets/spotlight/erectile_dysfunction.webp',
    productName: 'Amrutam B-Feral Gold Malt',
  },
  {
    id: 'last-longer-in-bed',
    title: 'Last Longer in Bed',
    concern: 'Men Vitality',
    categoryId: 'oils',
    image: '/assets/spotlight/last_longer_in_bed.webp',
    productName: 'Amrutam B-Feral Gold Oil',
  },
  {
    id: 'helpful-in-menopause',
    title: 'Helpful in Menopause',
    concern: 'Women Health',
    categoryId: 'period',
    image: '/assets/spotlight/helpful_in_menopause.webp',
    productName: 'Nari Sondarya Malt 40+',
  },
  {
    id: 'hair-fall-regrowth',
    title: 'Hair Fall & Regrowth',
    concern: 'Hair Therapy',
    categoryId: 'shampoos',
    image: '/assets/spotlight/hair_fall_regrowth.webp',
    productName: 'Amrutam Herbal Onion Shampoo',
  },
];

interface PressAndSpotlightSectionProps {
  onSelectCategory?: (categoryId: string) => void;
  onSelectSpotlightProduct?: (spotlightId: string) => void;
}

export const PressAndSpotlightSection: React.FC<PressAndSpotlightSectionProps> = ({
  onSelectCategory,
  onSelectSpotlightProduct,
}) => {
  // Duplicate logos for seamless infinite scrolling marquee
  const marqueeLogos = [...PRESS_LOGOS, ...PRESS_LOGOS, ...PRESS_LOGOS];

  return (
    <div
      id="spotlight-and-press-section"
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        boxSizing: 'border-box',
        overflow: 'hidden',
        borderTop: '1px solid #EEF3EF',
      }}
    >
      <style>{`
        /* Continuous Fast Auto-Scroll Marquee for Press Logos */
        @keyframes fastMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333333%);
          }
        }

        .marquee-wrapper {
          width: 100%;
          overflow: hidden;
          padding: 32px 0;
          background: #FFFFFF;
          border-bottom: 1px solid #F0F4F1;
          position: relative;
        }

        .marquee-wrapper::before,
        .marquee-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 60px;
          z-index: 2;
          pointer-events: none;
        }

        .marquee-wrapper::before {
          left: 0;
          background: linear-gradient(to right, #FFFFFF, rgba(255, 255, 255, 0));
        }

        .marquee-wrapper::after {
          right: 0;
          background: linear-gradient(to left, #FFFFFF, rgba(255, 255, 255, 0));
        }

        .marquee-track {
          display: flex;
          align-items: center;
          gap: clamp(36px, 5vw, 68px);
          width: max-content;
          animation: fastMarquee 15s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        .logo-item {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }

        .logo-item:hover {
          transform: scale(1.08);
          opacity: 1;
        }

        .logo-image {
          height: clamp(38px, 4.5vw, 56px);
          width: auto;
          max-width: 140px;
          object-fit: contain;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.04));
        }

        /* Spotlight Section */
        .spotlight-container {
          max-width: 1240px;
          width: 100%;
          margin: 0 auto;
          padding: clamp(48px, 6vw, 76px) 20px clamp(54px, 7vw, 88px);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .spotlight-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 4.2vw, 3rem);
          font-weight: 600;
          color: #1A3828;
          margin: 0;
          line-height: 1.25;
          text-align: center;
          letter-spacing: -0.015em;
        }

        .spotlight-accent-bar {
          width: 44px;
          height: 3px;
          background-color: #3A643B;
          border-radius: 999px;
          margin: 14px auto clamp(32px, 4vw, 48px) auto;
        }

        .spotlight-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: clamp(12px, 1.6vw, 20px);
          width: 100%;
        }

        @media (max-width: 1024px) {
          .spotlight-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 580px) {
          .spotlight-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }

        .spotlight-card {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          aspect-ratio: 9 / 16;
          background-color: #EDE8DE;
          box-shadow: 0 6px 20px rgba(25, 45, 35, 0.08);
          cursor: pointer;
          user-select: none;
          outline: none;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .spotlight-card:hover {
          transform: translateY(-7px) scale(1.02);
          box-shadow: 0 16px 36px -8px rgba(25, 45, 35, 0.22);
        }

        .spotlight-card:active {
          transform: translateY(-2px) scale(0.99);
        }

        .spotlight-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .spotlight-card:hover img {
          transform: scale(1.04);
        }
      `}</style>

      {/* 1. Fast Auto-Scroll Section Upside of "Products in Spotlight" */}
      <div className="marquee-wrapper" aria-label="Featured in Press and Media">
        <div className="marquee-track">
          {marqueeLogos.map((logo, index) => (
            <div key={`${logo.id}-${index}`} className="logo-item" title={logo.name}>
              <img
                src={logo.image}
                alt={logo.name}
                className="logo-image"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Products in Spotlight Section */}
      <div className="spotlight-container">
        <h2 className="spotlight-title">Products in Spotlight</h2>
        <div className="spotlight-accent-bar" aria-hidden="true" />

        {/* 6 Spotlight Visual Story Cards */}
        <div className="spotlight-grid">
          {SPOTLIGHT_ITEMS.map((item) => (
            <div
              key={item.id}
              className="spotlight-card"
              role="button"
              tabIndex={0}
              onClick={() => {
                if (onSelectSpotlightProduct) {
                  onSelectSpotlightProduct(item.id);
                } else {
                  onSelectCategory?.(item.categoryId);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (onSelectSpotlightProduct) {
                    onSelectSpotlightProduct(item.id);
                  } else {
                    onSelectCategory?.(item.categoryId);
                  }
                }
              }}
              aria-label={`View ${item.title} products (${item.productName})`}
              title={`Explore ${item.productName}`}
            >
              <img
                src={item.image}
                alt={`${item.title} - ${item.productName}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PressAndSpotlightSection;
