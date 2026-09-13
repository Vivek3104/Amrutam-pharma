import React from 'react';
import { X, Award, ShieldCheck, Heart, Leaf, Sparkles } from 'lucide-react';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreProducts?: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose, onExploreProducts }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(18, 30, 20, 0.65)',
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
          maxWidth: '680px',
          backgroundColor: '#FAF5EE',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          border: '1px solid #E2D7C9',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '88vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1A3E29 0%, #2A583B 100%)',
            padding: '26px 30px',
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

          <span style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: '#FFF',
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '0.74rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            display: 'inline-block',
            marginBottom: '6px',
          }}>
            SINCE 1990 • 30+ YEARS OF AYURVEDIC PURITY
          </span>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.75rem',
            fontWeight: 700,
            margin: '0 0 6px 0',
          }}>
            The Legacy of Amrutam
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.88, lineHeight: 1.45 }}>
            Crafting classical Vedic medicines, authentic Ayurvedic malts, and holistic botanicals from timeless texts.
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '26px 30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          <div>
            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.25rem',
              color: '#1E3E2B',
              margin: '0 0 8px 0',
            }}>
              Rooted in Classical Vedic Wisdom
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#4B5E53', lineHeight: 1.6 }}>
              Amrutam began with a humble mission: to revive the authentic science of Ayurveda as prescribed in the classical scriptures — Charaka Samhita, Sushruta Samhita, and Ashtanga Hridaya. Rather than using mass-produced chemical extracts, every Amrutam formulation is brewed slowly in traditional copper and earthen pots using raw, wild-harvested herbs.
            </p>
          </div>

          {/* Pillars Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4DAD0', borderRadius: '14px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ backgroundColor: '#EAF4ED', padding: '8px', borderRadius: '8px' }}>
                  <Leaf size={20} color="#275638" />
                </div>
                <h4 style={{ margin: 0, fontSize: '0.96rem', color: '#1F3728' }}>100% Himalayan Herbs</h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#5A6E63', lineHeight: 1.45 }}>
                Sourced from pristine organic bio-reserves at high altitudes for maximum bio-active potency.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4DAD0', borderRadius: '14px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ backgroundColor: '#EAF4ED', padding: '8px', borderRadius: '8px' }}>
                  <Award size={20} color="#275638" />
                </div>
                <h4 style={{ margin: 0, fontSize: '0.96rem', color: '#1F3728' }}>GMP & Ayush Certified</h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#5A6E63', lineHeight: 1.45 }}>
                Strict pharmaceutical-grade sterilization, rigorous heavy-metal testing, and authentic lab purity.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4DAD0', borderRadius: '14px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ backgroundColor: '#EAF4ED', padding: '8px', borderRadius: '8px' }}>
                  <ShieldCheck size={20} color="#275638" />
                </div>
                <h4 style={{ margin: 0, fontSize: '0.96rem', color: '#1F3728' }}>Zero Harsh Chemicals</h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#5A6E63', lineHeight: 1.45 }}>
                Free from parabens, artificial silicones, phthalates, synthetic binders, or chemical preservatives.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4DAD0', borderRadius: '14px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ backgroundColor: '#EAF4ED', padding: '8px', borderRadius: '8px' }}>
                  <Heart size={20} color="#275638" />
                </div>
                <h4 style={{ margin: 0, fontSize: '0.96rem', color: '#1F3728' }}>Holistic Wellbeing</h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#5A6E63', lineHeight: 1.45 }}>
                Treating the root cause by rebalancing Vata, Pitta, and Kapha doshas rather than masking symptoms.
              </p>
            </div>
          </div>

          {/* Quick Action */}
          <button
            onClick={() => {
              onExploreProducts?.();
              onClose();
            }}
            style={{
              backgroundColor: '#275638',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 22px',
              fontSize: '0.94rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s',
            }}
          >
            <Sparkles size={18} />
            <span>Discover 40+ Certified Amrutam Formulations</span>
          </button>

        </div>
      </div>
    </div>
  );
};
