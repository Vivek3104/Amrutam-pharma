import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  ShoppingBag,
  Zap,
  User,
  Sliders,
  Truck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (s: string) => void;
  onNavigateTab?: (tab: 'home' | 'pharmacy' | 'dashboard') => void;
  onSelectCategory?: (categoryId: string) => void;
  onOpenAuth?: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenTracking?: () => void;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
  onOpenZap?: () => void;
  onOpenPhone?: () => void;
  onOpenCommunity?: () => void;
  onOpenBlog?: () => void;
  onOpenAboutUs?: () => void;
  onKnowMoreClick?: (slide: HeroSlide) => void;
  activeSlideIndex?: number;
  onSlideChange?: (index: number) => void;
}

export interface HeroSlide {
  id: number;
  bgColor: string;
  gradientBg: string;
  prefixText: string;
  watermarkText: string;
  suffixText: string;
  productName: string;
  imageSrc: string;
  theme: 'green' | 'pink' | 'amber' | 'teal' | 'purple';
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 0,
    bgColor: '#8FAEA0',
    gradientBg: 'linear-gradient(135deg, #7FA08B 0%, #9BB6A4 100%)',
    prefixText: 'Ayurvedic Malt for',
    watermarkText: 'IRREGULAR',
    suffixText: 'Periods',
    productName: 'Nari Sondarya Malt',
    imageSrc: '/assets/nari_sondarya_transparent.png',
    theme: 'green',
  },
  {
    id: 1,
    bgColor: '#DE6A86',
    gradientBg: 'linear-gradient(135deg, #DF738C 0%, #BE506B 100%)',
    prefixText: 'Ayurvedic Malt for',
    watermarkText: 'TEENAGE',
    suffixText: 'Periods',
    productName: 'Kumari Sondarya Malt',
    imageSrc: '/assets/kumari_sondarya_transparent.png',
    theme: 'pink',
  },
  {
    id: 2,
    bgColor: '#D7913A',
    gradientBg: 'linear-gradient(135deg, #DF9842 0%, #B8721D 100%)',
    prefixText: 'Ayurvedic Malt for',
    watermarkText: 'DIGESTION',
    suffixText: '& Gut Health',
    productName: 'Digestive Care Herbal Malt',
    imageSrc: '/assets/nari_sondarya_transparent.png',
    theme: 'amber',
  },
  {
    id: 3,
    bgColor: '#2A7478',
    gradientBg: 'linear-gradient(135deg, #32858A 0%, #1D585C 100%)',
    prefixText: 'Ayurvedic Formula for',
    watermarkText: 'HAIR CARE',
    suffixText: '& Scalp Health',
    productName: 'Bhringraj Hair Care Malt',
    imageSrc: '/assets/kumari_sondarya_transparent.png',
    theme: 'teal',
  },
  {
    id: 4,
    bgColor: '#9C4B7D',
    gradientBg: 'linear-gradient(135deg, #A85389 0%, #7E3562 100%)',
    prefixText: 'Ayurvedic Formula for',
    watermarkText: 'HORMONES',
    suffixText: '& Radiance',
    productName: 'Shatavari Wellness Malt',
    imageSrc: '/assets/nari_sondarya_transparent.png',
    theme: 'purple',
  },
];

export const Hero: React.FC<HeroProps> = ({
  searchQuery: _searchQuery,
  setSearchQuery: _setSearchQuery,
  selectedSpecialty: _selectedSpecialty,
  setSelectedSpecialty: _setSelectedSpecialty,
  onNavigateTab,
  onSelectCategory,
  onOpenAuth,
  onOpenAdminDashboard,
  onOpenTracking,
  onOpenCart,
  onOpenSearch,
  onOpenZap,
  onOpenPhone,
  onOpenCommunity,
  onOpenBlog,
  onOpenAboutUs,
  onKnowMoreClick,
  activeSlideIndex,
  onSlideChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(activeSlideIndex ?? 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const { cartCount, openCart } = useCart();
  const { user, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (activeSlideIndex !== undefined && activeSlideIndex !== activeIndex) {
      changeSlide(activeSlideIndex);
    }
  }, [activeSlideIndex]);

  const currentSlide = HERO_SLIDES[activeIndex];

  const changeSlide = (newIndex: number) => {
    if (newIndex === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(newIndex);
    onSlideChange?.(newIndex);
    setTimeout(() => {
      setIsAnimating(false);
    }, 850);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % HERO_SLIDES.length;
    changeSlide(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    changeSlide(prevIdx);
  };

  // Auto-slide every 5 seconds L-to-R
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % HERO_SLIDES.length;
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 850);
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (deltaX < -50) {
      handleNext();
    } else if (deltaX > 50) {
      handlePrev();
    }
    touchStartXRef.current = null;
  };

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      
      {/* Exact Amrutam Header Top Bar */}
      <div style={{
        background: '#FAF5EE',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '12px 36px',
        color: '#3A643B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        {/* Left Phone Number */}
        <div 
          onClick={onOpenPhone}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '0.92rem', 
            fontWeight: 600, 
            color: '#3A643B',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          title="Customer Care & Vaidya Helpline"
        >
          <PhoneCall size={16} color="#3A643B" />
          <span>+91 98000 00000</span>
        </div>

        {/* Center AMRUTAM Logo */}
        <div 
          onClick={() => onNavigateTab?.('home')}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.85rem',
            fontWeight: 800,
            letterSpacing: '0.28em',
            color: '#3A643B',
            textTransform: 'uppercase',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          AMRUTAM
        </div>

        {/* Right Header Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isAdmin && (
            <button
              onClick={onOpenAdminDashboard}
              style={{
                backgroundColor: '#1A3E29',
                color: '#FDE68A',
                border: '1px solid #D97706',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              <Sliders size={13} color="#FDE68A" />
              <span>Admin Panel</span>
            </button>
          )}

          <span
            title="Search Formulations"
            onClick={onOpenSearch}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Search 
              size={20} 
              color="#3A643B" 
              style={{ transition: 'transform 0.15s ease' }}
            />
          </span>
          <span
            title="Daily Flash Deals & Offers"
            onClick={onOpenZap}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Zap 
              size={20} 
              color="#3A643B" 
              style={{ transition: 'transform 0.15s ease' }} 
            />
          </span>
          <div 
            onClick={onOpenCart || openCart} 
            style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="View Cart"
          >
            <ShoppingBag size={20} color="#3A643B" />
            <span style={{
              position: 'absolute',
              top: '-7px',
              right: '-9px',
              background: '#3A643B',
              color: '#FFF',
              fontSize: '0.62rem',
              fontWeight: 700,
              width: '17px',
              height: '17px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {cartCount}
            </span>
          </div>

          {/* User Account Icon */}
          <div
            onClick={onOpenAuth}
            style={{
              position: 'relative',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '50%',
              background: isAuthenticated ? '#EAF4ED' : 'transparent',
              border: isAuthenticated ? '1.5px solid #A8CFB4' : 'none',
            }}
            title={isAuthenticated ? `Logged in: ${user?.fullName || user?.role}` : 'Sign In / Register'}
          >
            <User size={20} color="#3A643B" />
            {isAuthenticated && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-1px',
                  right: '-1px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isAdmin ? '#D97706' : '#16A34A',
                  border: '1.5px solid #FAF5EE',
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Amrutam Sub-Navigation Links Bar */}
      <div style={{
        background: '#FAF5EE',
        padding: '12px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        flexWrap: 'wrap',
        fontSize: '0.92rem',
        fontWeight: 600,
        color: '#3A643B',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <span 
          onClick={() => onSelectCategory?.('shop-all')} 
          style={{ cursor: 'pointer', transition: 'all 0.2s', padding: '4px 0' }}
          className="nav-hover-link"
        >
          Shop All
        </span>
        
        <span 
          onClick={() => onSelectCategory?.('health')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 0' }}
          className="nav-hover-link"
        >
          Health
          <span style={{
            background: '#FF5722',
            color: '#FFF',
            fontSize: '0.58rem',
            padding: '1px 6px',
            borderRadius: '8px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            Hot
          </span>
        </span>

        <span 
          onClick={() => onSelectCategory?.('hair')} 
          style={{ cursor: 'pointer', padding: '4px 0' }}
          className="nav-hover-link"
        >
          Hair
        </span>
        
        <span 
          onClick={() => onSelectCategory?.('skin')} 
          style={{ cursor: 'pointer', padding: '4px 0' }}
          className="nav-hover-link"
        >
          Skin
        </span>
        
        <span 
          onClick={() => onSelectCategory?.('lifestyle')} 
          style={{ cursor: 'pointer', padding: '4px 0' }}
          className="nav-hover-link"
        >
          Lifestyle
        </span>
        
        <span 
          onClick={onOpenCommunity} 
          style={{ 
            cursor: 'pointer', 
            color: '#3A643B', 
            fontWeight: 700, 
            padding: '4px 0',
            borderBottom: '2px solid transparent',
            transition: 'all 0.2s',
          }}
          className="nav-hover-link"
        >
          Community
        </span>
        
        <span 
          onClick={onOpenBlog} 
          style={{ cursor: 'pointer', padding: '4px 0' }}
          className="nav-hover-link"
        >
          Blog
        </span>
        
        <span 
          onClick={onOpenAboutUs} 
          style={{ cursor: 'pointer', padding: '4px 0' }}
          className="nav-hover-link"
        >
          About Us
        </span>
        
        <span 
          onClick={onOpenTracking} 
          style={{
            cursor: 'pointer',
            padding: '3px 10px',
            borderRadius: '16px',
            backgroundColor: '#EFF7F1',
            color: '#15803D',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            border: '1px solid #C5DFCC',
          }}
          className="nav-hover-link"
          title="Track Live Order Status"
        >
          <Truck size={13} />
          Track Order
        </span>

        <span 
          onClick={onOpenAuth} 
          style={{ cursor: 'pointer', padding: '4px 0' }}
          className="nav-hover-link"
        >
          Account
        </span>
      </div>

      {/* Main Amrutam Hero Section matching User Images 1 & 2 */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          height: '600px',
          background: currentSlide.gradientBg,
          transition: 'background 0.85s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        {/* Top-Left Prefix Text ("Ayurvedic Malt for") */}
        <div
          key={`prefix_${activeIndex}`}
          className="animate-hero-text"
          style={{
            position: 'absolute',
            top: '15%',
            left: '8%',
            zIndex: 4,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.8rem, 3.4vw, 2.7rem)',
            color: '#FFFFFF',
            fontWeight: 400,
            letterSpacing: '0.02em',
            pointerEvents: 'none',
          }}
        >
          {currentSlide.prefixText}
        </div>

        {/* Giant Centered Background Typography ("IRREGULAR", "TEENAGE", etc.) ALWAYS ON A SINGLE LINE */}
        <div style={{
          position: 'absolute',
          top: '46%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          width: '100%',
          textAlign: 'center',
          pointerEvents: 'none',
          padding: '0 10px',
        }}>
          <h1
            key={`watermark_${activeIndex}`}
            className="animate-hero-text"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(3.2rem, 11vw, 10.5rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              opacity: 0.95,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              margin: 0,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              display: 'inline-block',
            }}
          >
            {currentSlide.watermarkText}
          </h1>
        </div>

        {/* Bottom-Right Suffix Text ("Periods") */}
        <div
          key={`suffix_${activeIndex}`}
          className="animate-hero-text"
          style={{
            position: 'absolute',
            bottom: '24%',
            right: '8%',
            zIndex: 4,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
            color: '#FFFFFF',
            fontWeight: 400,
            pointerEvents: 'none',
          }}
        >
          {currentSlide.suffixText}
        </div>

        {/* Center Hand Holding Jar Container with TRANSPARENT background cutout & gradient bottom fade */}
        <div
          key={`hand_container_${activeIndex}`}
          className={isAnimating ? 'animate-hand-3d' : 'animate-hand-idle'}
          style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            transformOrigin: 'bottom center',
            zIndex: 5,
            width: 'clamp(340px, 40vw, 520px)',
            height: '510px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <img
            src={currentSlide.imageSrc}
            alt={currentSlide.productName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center bottom',
              maskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
              filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.25))',
            }}
          />
        </div>

        {/* Floating Botanicals Matching Reference Images */}
        {currentSlide.theme === 'green' && (
          <>
            {/* Top-Left Neem / Herbal Leaf */}
            <div className="float-leaf-1" style={{ position: 'absolute', top: '26%', left: '12%', zIndex: 6, fontSize: '3.5rem', filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.2))' }}>
              🍃
            </div>
            {/* Bottom-Left Aloe Vera Slice */}
            <div className="float-leaf-2" style={{ position: 'absolute', bottom: '16%', left: '22%', zIndex: 6, fontSize: '2.8rem', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.15))' }}>
              🥬
            </div>
            {/* Bottom-Left Dried Herbal Nut */}
            <div className="float-leaf-1" style={{ position: 'absolute', bottom: '8%', left: '28%', zIndex: 6, fontSize: '2.4rem' }}>
              🌰
            </div>
            {/* Top-Right Amla Berry (Gooseberry) */}
            <div className="float-leaf-2" style={{ position: 'absolute', top: '22%', right: '30%', zIndex: 6, fontSize: '3.2rem', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.25))' }}>
              🍏
            </div>
            {/* Bottom-Right Green Leaves Branch */}
            <div className="float-leaf-1" style={{ position: 'absolute', bottom: '18%', right: '12%', zIndex: 6, fontSize: '3.8rem', filter: 'drop-shadow(0 10px 16px rgba(0,0,0,0.2))' }}>
              🌿
            </div>
            {/* Far-Right Floating Leaf Particle */}
            <div className="float-leaf-2" style={{ position: 'absolute', top: '48%', right: '8%', zIndex: 6, fontSize: '2rem' }}>
              🌱
            </div>
          </>
        )}

        {currentSlide.theme === 'pink' && (
          <>
            {/* Top-Left Aloe Vera Slice */}
            <div className="float-leaf-1" style={{ position: 'absolute', top: '28%', left: '13%', zIndex: 6, fontSize: '3.4rem', filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.2))' }}>
              🥬
            </div>
            {/* Bottom-Left Rose Petals */}
            <div className="float-leaf-2" style={{ position: 'absolute', bottom: '22%', left: '16%', zIndex: 6, fontSize: '2.6rem' }}>
              🌸
            </div>
            {/* Bottom-Left Clove */}
            <div className="float-leaf-1" style={{ position: 'absolute', bottom: '8%', left: '26%', zIndex: 6, fontSize: '2.2rem' }}>
              🧄
            </div>
            {/* Bottom-Left Walnut / Herb Nut */}
            <div className="float-leaf-2" style={{ position: 'absolute', bottom: '6%', left: '32%', zIndex: 6, fontSize: '2.4rem' }}>
              🌰
            </div>
            {/* Top-Right Clove Bud */}
            <div className="float-leaf-1" style={{ position: 'absolute', top: '20%', right: '22%', zIndex: 6, fontSize: '2.6rem' }}>
              🥜
            </div>
            {/* Right Green Leaves */}
            <div className="float-leaf-2" style={{ position: 'absolute', top: '18%', right: '4%', zIndex: 6, fontSize: '4.2rem', filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.25))' }}>
              🌿
            </div>
            {/* Bottom-Right Green Leaf */}
            <div className="float-leaf-1" style={{ position: 'absolute', bottom: '16%', right: '16%', zIndex: 6, fontSize: '3.2rem' }}>
              🍃
            </div>
            {/* Far-Right Resin/Gum */}
            <div className="float-leaf-2" style={{ position: 'absolute', bottom: '8%', right: '5%', zIndex: 6, fontSize: '2.5rem' }}>
              ✨
            </div>
          </>
        )}

        {currentSlide.theme !== 'green' && currentSlide.theme !== 'pink' && (
          <>
            <div className="float-leaf-1" style={{ position: 'absolute', top: '25%', left: '12%', zIndex: 6, fontSize: '3.5rem' }}>
              🌿
            </div>
            <div className="float-leaf-2" style={{ position: 'absolute', bottom: '18%', right: '12%', zIndex: 6, fontSize: '3.2rem' }}>
              🍃
            </div>
          </>
        )}

        {/* Glassmorphic "Know more" Box Button on Left */}
        <button
          className="amrutam-know-more-btn"
          style={{
            position: 'absolute',
            bottom: '22%',
            left: '8%',
            zIndex: 7,
          }}
          onClick={() => onKnowMoreClick?.(currentSlide)}
        >
          Know more
        </button>

        {/* Circular Dark Green Left Navigation Arrow (<) */}
        <button
          onClick={handlePrev}
          className="amrutam-nav-btn"
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 8,
          }}
          title="Previous Banner"
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </button>

        {/* Circular Dark Green Right Navigation Arrow (>) */}
        <button
          onClick={handleNext}
          className="amrutam-nav-btn"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 8,
          }}
          title="Next Banner"
        >
          <ChevronRight size={24} color="#FFFFFF" />
        </button>

        {/* Slide Pagination Dots */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 8,
          display: 'flex',
          gap: '8px',
        }}>
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => changeSlide(idx)}
              style={{
                width: activeIndex === idx ? '26px' : '10px',
                height: '10px',
                borderRadius: '5px',
                background: activeIndex === idx ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

      </section>

    </div>
  );
};

