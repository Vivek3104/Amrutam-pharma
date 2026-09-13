import React, { useState } from 'react';
import { Zap, X, Copy, Check, Clock, Gift, Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface FlashDealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShopCategory?: (catId: string) => void;
}

export const FlashDealsModal: React.FC<FlashDealsModalProps> = ({
  isOpen,
  onClose,
  onShopCategory,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [addedDeal, setAddedDeal] = useState(false);

  if (!isOpen) return null;

  const coupons = [
    {
      code: 'VEDA20',
      discount: '20% OFF',
      description: 'Applicable on all Classical Malts & Health Formulations',
      minSpend: 'Min. Order ₹1,500',
    },
    {
      code: 'GLOW15',
      discount: '15% OFF',
      description: 'Flat discount on Kumkumadi Face Oils & Ayurvedic Hair Spas',
      minSpend: 'No Min. Order',
    },
    {
      code: 'FREESHIP',
      discount: 'FREE SHIPPING',
      description: 'Zero shipping charges on any herbal order today',
      minSpend: 'Min. Order ₹499',
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleClaimFlashDeal = () => {
    addToCart({
      id: 'nari-sondarya-flash',
      name: 'Nari Sondarya Malt [Special Flash Pack]',
      category: 'AYURVEDIC_MALT',
      dosageForm: 'Classical Herbal Lehya',
      price: 1099,
      originalPrice: 1499,
      rating: 5,
      reviewsCount: 2509,
      description: 'Exclusive lightning deal on authentic Ayurvedic menstrual & hormonal wellness malt.',
      keyIngredients: ['Shatavari', 'Ashoka', 'Lodhra', 'Pure Honey'],
      imageUrl: '/assets/products/nari_sondarya.jpg',
      inStock: true,
      gmpCertified: true,
    });
    setAddedDeal(true);
    setTimeout(() => setAddedDeal(false), 2500);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(20, 30, 20, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#FAF5EE',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          border: '1px solid #E2D7C9',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Banner Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1E462F 0%, #306544 100%)',
            padding: '24px 28px',
            color: '#FFFFFF',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              backgroundColor: '#FF5722',
              color: '#FFF',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <Zap size={12} fill="#FFF" /> LIVE FLASH DEALS
            </span>
            <span style={{ fontSize: '0.78rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} /> Ends in 04h : 22m : 18s
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.65rem',
            fontWeight: 700,
            margin: '0 0 4px 0',
          }}>
            Ayurvedic Wellness Offers
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', opacity: 0.85 }}>
            Apply exclusive Vedic coupon codes at checkout or claim the lightning deal below.
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Lightning Deal of the Day Card */}
          <div
            style={{
              backgroundColor: '#FFF8EB',
              border: '1.5px dashed #D99B26',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <img
              src="/assets/products/nari_sondarya.jpg"
              alt="Flash Deal"
              style={{ width: '76px', height: '76px', borderRadius: '12px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <Sparkles size={14} color="#D99B26" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#A06707', textTransform: 'uppercase' }}>
                  Deal of the Day • 27% OFF
                </span>
              </div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.98rem', color: '#273C2E' }}>
                Nari Sondarya Malt Flash Jar
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#DC2626' }}>₹1,099</span>
                <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: '#9CA3AF' }}>₹1,499</span>
              </div>
            </div>
            <button
              onClick={handleClaimFlashDeal}
              style={{
                backgroundColor: addedDeal ? '#15803D' : '#3A643B',
                color: '#FFF',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 16px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {addedDeal ? <Check size={16} /> : <ShoppingBag size={16} />}
              {addedDeal ? 'Added!' : 'Claim Deal'}
            </button>
          </div>

          {/* Active Promo Codes */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#3B5745', fontWeight: 700, margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Available Coupon Codes
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {coupons.map((c) => (
                <div
                  key={c.code}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5DBD0',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{
                        backgroundColor: '#EAF3EC',
                        color: '#255D37',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.86rem',
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        border: '1px dashed #3A643B',
                      }}>
                        {c.code}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#DC2626' }}>
                        {c.discount}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 2px 0', fontSize: '0.82rem', color: '#4B5E53' }}>
                      {c.description}
                    </p>
                    <span style={{ fontSize: '0.74rem', color: '#88988D' }}>
                      {c.minSpend}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(c.code)}
                    style={{
                      background: copiedCode === c.code ? '#DCFCE7' : '#F4ECE1',
                      border: '1px solid ' + (copiedCode === c.code ? '#86EFAC' : '#D6C8B8'),
                      color: copiedCode === c.code ? '#15803D' : '#3A643B',
                      borderRadius: '8px',
                      padding: '7px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    {copiedCode === c.code ? <Check size={14} /> : <Copy size={14} />}
                    {copiedCode === c.code ? 'Copied' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={() => {
              onShopCategory?.('shop-all');
              onClose();
            }}
            style={{
              backgroundColor: '#3A643B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '13px 20px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s',
            }}
          >
            <Gift size={18} />
            <span>Apply Coupon in Shop All (40+ Formulations)</span>
          </button>

        </div>
      </div>
    </div>
  );
};
