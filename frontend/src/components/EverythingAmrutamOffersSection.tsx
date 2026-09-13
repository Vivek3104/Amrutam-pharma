import React from 'react';

export interface OfferCategory {
  id: string;
  title: string;
  image: string;
  alt: string;
  itemCount?: string;
  badge?: string;
}

interface EverythingAmrutamOffersSectionProps {
  onSelectCategory: (categoryId: string) => void;
}

export const OFFER_CATEGORIES: OfferCategory[] = [
  {
    id: 'malts',
    title: 'Malts',
    image: '/assets/offers/malts.png',
    alt: 'Amrutam Ayurvedic Malts Collection',
  },
  {
    id: 'shampoos',
    title: 'Shampoos',
    image: '/assets/offers/shampoos.webp',
    alt: 'Amrutam Bhringraj & Herbal Shampoos',
  },
  {
    id: 'hair-spas',
    title: 'Hair Spas',
    image: '/assets/offers/hair_spas.webp',
    alt: 'Amrutam Kuntal Care Hair Spa',
  },
  {
    id: 'everyday',
    title: 'Everyday',
    image: '/assets/offers/everyday.webp',
    alt: 'Amrutam Everyday Essentials & Chawanprash',
  },
  {
    id: 'oils',
    title: 'Oils',
    image: '/assets/offers/oils.webp',
    alt: 'Amrutam Kayakey & Kumkumadi Oils',
  },
  {
    id: 'herbs',
    title: 'Herbs',
    image: '/assets/offers/herbs.webp',
    alt: 'Amrutam Classical Ayurvedic Herbs & Churna',
  },
];

export const EverythingAmrutamOffersSection: React.FC<EverythingAmrutamOffersSectionProps> = ({
  onSelectCategory,
}) => {
  return (
    <section
      id="everything-amrutam-offers"
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 'clamp(48px, 6vw, 84px) 20px clamp(56px, 7vw, 96px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        borderTop: '1px solid #EEF3EF',
      }}
    >
      <style>{`
        .offers-section-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 4.2vw, 3rem);
          font-weight: 600;
          color: '#1A3828';
          margin: 0;
          line-height: 1.25;
          letter-spacing: -0.015em;
          text-align: center;
        }

        .offers-accent-bar {
          width: 44px;
          height: 3px;
          background-color: #3A643B;
          border-radius: 999px;
          margin: 14px auto clamp(36px, 4.5vw, 52px) auto;
        }

        .offers-grid-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          column-gap: clamp(20px, 3vw, 36px);
          row-gap: clamp(28px, 4vw, 44px);
          width: 100%;
          max-width: 1040px;
          margin: 0 auto;
        }

        @media (max-width: 820px) {
          .offers-grid-container {
            grid-template-columns: repeat(2, 1fr);
            column-gap: 16px;
            row-gap: 28px;
          }
        }

        @media (max-width: 480px) {
          .offers-grid-container {
            grid-template-columns: repeat(2, 1fr);
            column-gap: 12px;
            row-gap: 22px;
          }
          .offers-card-image-box {
            border-radius: 20px !important;
          }
          .offers-item-label {
            font-size: 15px !important;
            margin-top: 10px !important;
          }
        }

        .offers-item-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          user-select: none;
          outline: none;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .offers-item-card:hover {
          transform: translateY(-6px);
        }

        .offers-item-card:active {
          transform: translateY(-2px) scale(0.99);
        }

        .offers-card-image-box {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 28px;
          overflow: hidden;
          background-color: #F7F5F0;
          box-shadow: 0 4px 18px rgba(35, 60, 45, 0.06);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .offers-item-card:hover .offers-card-image-box {
          box-shadow: 0 16px 36px -8px rgba(35, 60, 45, 0.16);
        }

        .offers-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .offers-item-card:hover .offers-card-img {
          transform: scale(1.05);
        }

        .offers-item-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(16px, 1.8vw, 18.5px);
          font-weight: 600;
          color: #3A643B;
          margin-top: 16px;
          letter-spacing: 0.01em;
          text-align: center;
          transition: color 0.25s ease, transform 0.25s ease;
          position: relative;
        }

        .offers-item-card:hover .offers-item-label {
          color: #1E3B27;
          transform: translateY(1px);
        }
      `}</style>

      <div style={{ maxWidth: '1040px', width: '100%', margin: '0 auto' }}>
        {/* Heading */}
        <h2 className="offers-section-title" style={{ color: '#1A3828' }}>
          Everything That Amrutam Offers
        </h2>
        
        {/* Accent Bar */}
        <div className="offers-accent-bar" aria-hidden="true" />

        {/* Categories Grid */}
        <div className="offers-grid-container">
          {OFFER_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="offers-item-card"
              role="button"
              tabIndex={0}
              onClick={() => onSelectCategory(category.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCategory(category.id);
                }
              }}
              aria-label={`Explore ${category.title} category`}
            >
              <div className="offers-card-image-box">
                <img
                  src={category.image}
                  alt={category.alt}
                  className="offers-card-img"
                  loading="lazy"
                />
              </div>

              <div className="offers-item-label">
                {category.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EverythingAmrutamOffersSection;
