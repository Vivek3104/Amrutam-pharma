import React, { useState, useEffect } from 'react';
import {
  Star,
  Check,
  Plus,
  Minus,
  Search,
  Filter,
  ArrowUpDown,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export interface SpotlightProductDetailsProps {
  spotlightId: string;
  onBackToHome: () => void;
  onAddToCart?: (productName: string) => void;
}

interface ProductVariant {
  size: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  savings: number;
}

interface SpotlightProductConfig {
  id: string;
  title: string;
  rating: number;
  reviewCount: number;
  ratingScore: string;
  featureImage: string;
  variants: ProductVariant[];
  callouts: {
    title: string;
    description: string;
    position: 'top-left' | 'right' | 'bottom-right';
  }[];
  productInfo: string[];
  howToUse: string[];
  ingredients: string[];
  aiSummary: {
    overview: string;
    highlights: string[];
  };
  customerPhotos: string[];
}

const SPOTLIGHT_PRODUCTS: Record<string, SpotlightProductConfig> = {
  'healthy-soft-hair': {
    id: 'healthy-soft-hair',
    title: 'Amrutam Kuntal Care Herbal Shampoo | Healthy, Natural And Dynamic Hair',
    rating: 5,
    reviewCount: 1459,
    ratingScore: '4.7',
    featureImage: '/assets/spotlight_detail/kuntal_shampoo_mirror.webp',
    variants: [
      {
        size: '200 ML',
        originalPrice: 667,
        discountedPrice: 599,
        discountPercent: 10,
        savings: 68,
      },
      {
        size: '500 ML',
        originalPrice: 1599,
        discountedPrice: 1399,
        discountPercent: 13,
        savings: 200,
      },
    ],
    callouts: [
      {
        title: 'Prevents hair fall and dandruff',
        description: 'Enriched with Bhringraj & Shikakai to cleanse without stripping natural oils',
        position: 'top-left',
      },
      {
        title: 'Makes hair silkier, shinier and bouncier!',
        description: 'Plant-based conditioning actives detangle hair smoothly',
        position: 'right',
      },
      {
        title: 'Prevents scalp infections',
        description: 'Neem & Reetha provide natural antimicrobial defense',
        position: 'bottom-right',
      },
    ],
    productInfo: [
      'Amrutam Kuntal Care Herbal Shampoo is a 100% natural, sulfate-free and paraben-free formulation crafted using classical Ayurvedic kashaya methods.',
      'Unlike chemical foaming shampoos that strip the scalp of protective sebum, this herbal shampoo balances scalp pH, soothes itching, and deeply strengthens weak follicles.',
      'Suitable for all hair types including curly, treated, dyed, and dry brittle hair.',
    ],
    howToUse: [
      'Wet hair thoroughly with lukewarm water.',
      'Take 5-10 ml of shampoo into your palms, dilute with a few drops of water, and massage gently onto the scalp in circular motions for 2-3 minutes.',
      'Rinse thoroughly. For optimal results, follow with Amrutam Kuntal Care Hair Spa or Hair Oil ritual twice a week.',
    ],
    ingredients: [
      'Bhringraj (Eclipta Alba) - The King of Hair Herbs, promotes active growth phase.',
      'Shikakai (Acacia Concinna) - Natural astringent and gentle dirt cleanser.',
      'Reetha (Sapindus Mukorossi) - Creates rich, plant-derived lather without sulfates.',
      'Amla (Emblica Officinalis) - Packed with Vitamin C and flavonoids for roots.',
      'Neem (Azadirachta Indica) - Prevents dandruff, flakes, and bacterial scalp irritations.',
    ],
    aiSummary: {
      overview:
        'This herbal shampoo cleanses hair and scalp effectively, with customers reporting reduced hairfall, increased shine, and softer texture. Many praised its natural ingredients and suitability for various hair types including curly and frizzy hair. Some noted concerns about price being high and occasional dryness requiring conditioner. Delivery speed and customer service received mixed feedback.',
      highlights: [
        'Best herbal shampoo I got my hands on. My hunt for the herbal shampoo was over.',
        'My hair fall reduce a lot. Thanks for making such good products.',
        'It softened my hair which was very frizzy. Retains that soft touch and shine for a week.',
      ],
    },
    customerPhotos: [
      '/assets/spotlight_detail/customer_1.jpg',
      '/assets/spotlight_detail/customer_2.jpg',
      '/assets/spotlight_detail/customer_3.jpg',
      '/assets/spotlight_detail/customer_4.jpg',
    ],
  },
  'radiance-pigmentation': {
    id: 'radiance-pigmentation',
    title: 'Amrutam Kumkumadi Oil | Ayurvedic Recipe For Radiant Skin Glow',
    rating: 5,
    reviewCount: 3120,
    ratingScore: '4.9',
    featureImage: '/assets/products/kumkumadi_oil.png',
    variants: [
      {
        size: '30 ML',
        originalPrice: 3599,
        discountedPrice: 3249,
        discountPercent: 10,
        savings: 350,
      },
      {
        size: '50 ML',
        originalPrice: 5499,
        discountedPrice: 4799,
        discountPercent: 13,
        savings: 700,
      },
    ],
    callouts: [
      {
        title: 'Fades stubborn dark spots',
        description: 'Kashmiri Saffron & Manjistha brighten hyperpigmented areas',
        position: 'top-left',
      },
      {
        title: 'Deep golden cellular glow',
        description: 'Pure goat milk & red sandalwood revitalize dull tired complexion',
        position: 'right',
      },
      {
        title: 'Anti-aging collagen boost',
        description: 'Classical Taila base smooths fine expression lines',
        position: 'bottom-right',
      },
    ],
    productInfo: [
      'Amrutam Kumkumadi Oil is formulated strictly adhering to the classical Ashtanga Hridaya texts.',
      'Contains Grade-A saffron stigma, padmaka, manjistha, and pure goat milk infused over 72 hours of slow herbal decoction.',
      'Restores skin barrier, improves natural moisture retention, and imparts an unmistakable inner luminescence.',
    ],
    howToUse: [
      'Cleanse your face thoroughly with a mild herbal face wash or warm water.',
      'Take 3-4 drops of Kumkumadi Oil on clean fingertips.',
      'Gently dab and massage upward onto forehead, cheeks, and neck until fully absorbed before sleep.',
    ],
    ingredients: [
      'Keshara (Crocus Sativus) - Pure Kashmiri Saffron for complexion lightening.',
      'Manjistha (Rubia Cordifolia) - Classical blood purifier and anti-pigmentation herb.',
      'Chandan (Santalum Album) - Cooling sandalwood that calms heat and redness.',
      'Goat Milk (Aja Ksheera) - Lactic acid nourishment for delicate skin cells.',
    ],
    aiSummary: {
      overview:
        'Customers frequently highlight dramatic improvements in morning glow, reduction in dark pigmentation circles, and non-greasy absorption. Many appreciate the authentic saffron aroma and visible results within 3 to 4 weeks of consistent nightly use.',
      highlights: [
        'Woke up with smooth glowing skin from day 3 onwards. Truly pure saffron quality.',
        'Hyperpigmentation on my cheekbones lightened visibly after one bottle.',
        'Non-greasy oil that sinks right into the skin without clogging pores.',
      ],
    },
    customerPhotos: [
      '/assets/spotlight_detail/customer_2.jpg',
      '/assets/spotlight_detail/customer_4.jpg',
      '/assets/spotlight_detail/customer_1.jpg',
      '/assets/spotlight_detail/customer_3.jpg',
    ],
  },
  'erectile-dysfunction': {
    id: 'erectile-dysfunction',
    title: 'Amrutam B-Feral Gold Malt | Classical Rejuvenation & Vitality',
    rating: 5,
    reviewCount: 1840,
    ratingScore: '4.8',
    featureImage: '/assets/products/b_feral_gold.png',
    variants: [
      {
        size: '400 GM',
        originalPrice: 2199,
        discountedPrice: 1899,
        discountPercent: 14,
        savings: 300,
      },
    ],
    callouts: [
      {
        title: 'Revitalizes stamina and vigor',
        description: 'Safed Musli and Ashwagandha restore physical strength',
        position: 'top-left',
      },
      {
        title: 'Boosts natural nitric oxide',
        description: 'Improves pelvic blood microcirculation and performance',
        position: 'right',
      },
      {
        title: 'Combats mental & physical burnout',
        description: 'Natural adaptogens reduce cortisol and fatigue',
        position: 'bottom-right',
      },
    ],
    productInfo: [
      'Amrutam B-Feral Gold Malt is a classical Vajikarana Rasayana designed for male reproductive vitality, vitality, and hormonal equilibrium.',
      'Enriched with purified Shilajit, Swarna Bhasma (Gold), Kaundha seeds, and Akarkara to enhance vigour and longevity.',
    ],
    howToUse: [
      'Consume 1 to 2 tablespoons (15-30g) twice daily after meals.',
      'Best taken with warm milk for optimal absorption and nourishment of Shukra Dhatu.',
    ],
    ingredients: [
      'Shilajit (Asphaltum Punjabianum) - Minerals, fulvic acid, and cellular bio-enhancer.',
      'Ashwagandha (Withania Somnifera) - Boosts testosterone and stamina.',
      'Safed Musli (Chlorophytum Borivilianum) - Renowned classical aphrodisiac herb.',
      'Swarna Bhasma - Classical gold preparation for deep cellular rejuvenation.',
    ],
    aiSummary: {
      overview:
        'Users praise B-Feral Gold Malt for noticeable increases in daily energy levels, reduced exhaustion after long workdays, and marked improvement in intimate confidence and stamina.',
      highlights: [
        'Noticeable energy upgrade within two weeks without any jitters.',
        'Great classical formulation with no artificial side effects.',
        'Tastes delicious with warm milk at night.',
      ],
    },
    customerPhotos: [
      '/assets/spotlight_detail/customer_3.jpg',
      '/assets/spotlight_detail/customer_1.jpg',
      '/assets/spotlight_detail/customer_2.jpg',
      '/assets/spotlight_detail/customer_4.jpg',
    ],
  },
  'last-longer-in-bed': {
    id: 'last-longer-in-bed',
    title: 'Amrutam B-Feral Gold Oil | Strength & Stamina Massage Oil',
    rating: 5,
    reviewCount: 940,
    ratingScore: '4.7',
    featureImage: '/assets/products/kayakey_oil.jpg',
    variants: [
      {
        size: '100 ML',
        originalPrice: 999,
        discountedPrice: 849,
        discountPercent: 15,
        savings: 150,
      },
    ],
    callouts: [
      {
        title: 'Deep tissue blood circulation',
        description: 'Stimulates local micro-vasculature and nerve sensitivity',
        position: 'top-left',
      },
      {
        title: 'Sustained endurance & tone',
        description: 'Classical herbs tone pelvic and vascular muscles',
        position: 'right',
      },
      {
        title: 'Quick absorption',
        description: 'Zero greasy residue with rich therapeutic sesame base',
        position: 'bottom-right',
      },
    ],
    productInfo: [
      'Crafted with potent herbal extracts boiled in sesame oil using traditional Taila Paka Vidhi.',
      'Provides intense local nourishment, relieves nerve tension, and improves vascular elasticity.',
    ],
    howToUse: [
      'Take 4-6 drops of oil onto fingertips.',
      'Massage gently onto local areas for 5 minutes before resting or sleep.',
    ],
    ingredients: [
      'Ashwagandha & Bala - Strengthen local nerve junctions and muscle tone.',
      'Jyotishmati - Improves localized blood circulation.',
      'Sesame Oil (Tila Taila) - Ancient carrier oil carrying therapeutic herbs deep into tissue.',
    ],
    aiSummary: {
      overview:
        'Reviewers report reliable improvements in performance confidence, relaxation, and ease of massage. Many recommend pairing with B-Feral Malt for comprehensive inside-out care.',
      highlights: [
        'Great aromatic oil that absorbs quickly and feels therapeutic.',
        'Consistent improvements observed after regular massage.',
      ],
    },
    customerPhotos: [
      '/assets/spotlight_detail/customer_4.jpg',
      '/assets/spotlight_detail/customer_3.jpg',
      '/assets/spotlight_detail/customer_2.jpg',
      '/assets/spotlight_detail/customer_1.jpg',
    ],
  },
  'helpful-in-menopause': {
    id: 'helpful-in-menopause',
    title: 'Amrutam Nari Sondarya Malt 40+ | Menopause Care & Hot Flashes',
    rating: 5,
    reviewCount: 1680,
    ratingScore: '4.8',
    featureImage: '/assets/products/brainkey_gold.jpg',
    variants: [
      {
        size: '400 GM',
        originalPrice: 1400,
        discountedPrice: 1250,
        discountPercent: 11,
        savings: 150,
      },
      {
        size: '625 GM',
        originalPrice: 1990,
        discountedPrice: 1749,
        discountPercent: 12,
        savings: 241,
      },
    ],
    callouts: [
      {
        title: 'Soothes hot flashes & night sweats',
        description: 'Cooling Pitta-pacifying herbs restore thermal harmony',
        position: 'top-left',
      },
      {
        title: 'Balances mood swings and fatigue',
        description: 'Jatamansi and Shankhpushpi support nervous relaxation',
        position: 'right',
      },
      {
        title: 'Maintains bone density',
        description: 'Praval Pishti & Hadjod provide bioavailable calcium',
        position: 'bottom-right',
      },
    ],
    productInfo: [
      'Amrutam Nari 40+ Malt is formulated for peri-menopausal and post-menopausal women transitioning into this sacred phase of life.',
      'Harmonizes estrogen decline naturally through phyto-estrogens like Shatavari, Ashoka, and Lodhra without synthetic hormones.',
    ],
    howToUse: [
      'Take 1 to 2 tablespoons twice daily with warm milk or lukewarm water after breakfast and dinner.',
    ],
    ingredients: [
      'Shatavari - Female tonic known to replenish cooling fluids (Ojas).',
      'Ashoka Bark - Tones reproductive system and eases menstrual cessation transition.',
      'Praval Pishti - Coral calcium that strengthens bone mineral matrix.',
    ],
    aiSummary: {
      overview:
        'Women aged 40+ praise this malt for dramatically reducing the frequency and severity of hot flashes, calming sleep disturbances, and sustaining daily stamina.',
      highlights: [
        'Night sweats and hot flashes reduced significantly by week 3.',
        'Felt more emotionally balanced and slept through the night without waking up restless.',
        'A truly comforting Ayurvedic companion for women over 40.',
      ],
    },
    customerPhotos: [
      '/assets/spotlight_detail/customer_1.jpg',
      '/assets/spotlight_detail/customer_4.jpg',
      '/assets/spotlight_detail/customer_2.jpg',
      '/assets/spotlight_detail/customer_3.jpg',
    ],
  },
  'hair-fall-regrowth': {
    id: 'hair-fall-regrowth',
    title: 'Amrutam Herbal Onion Shampoo | Anti-Hair Fall & Follicle Therapy',
    rating: 5,
    reviewCount: 1210,
    ratingScore: '4.7',
    featureImage: '/assets/spotlight/hair_fall_regrowth.webp',
    variants: [
      {
        size: '200 ML',
        originalPrice: 699,
        discountedPrice: 599,
        discountPercent: 14,
        savings: 100,
      },
      {
        size: '500 ML',
        originalPrice: 1699,
        discountedPrice: 1449,
        discountPercent: 15,
        savings: 250,
      },
    ],
    callouts: [
      {
        title: 'Reduces excessive shedding',
        description: 'Sulfur-rich Red Onion extract anchors weak roots firmly',
        position: 'top-left',
      },
      {
        title: 'Stimulates dormant follicles',
        description: 'Promotes micro-circulation along thinning hairline',
        position: 'right',
      },
      {
        title: 'Mild natural scent',
        description: 'Blended with fresh curry leaves and botanical flowers',
        position: 'bottom-right',
      },
    ],
    productInfo: [
      'Amrutam Onion Shampoo blends sulfur-rich Red Onion bulb oil with Bhringraj, Shikakai, and Amla for comprehensive follicle recovery.',
      'Free from harsh sulfates, parabens, and synthetic silicones that cause follicle suffocation.',
    ],
    howToUse: [
      'Apply to wet hair, gently massage scalp for 2 minutes to let sulfur and flavonoids penetrate, then rinse thoroughly.',
    ],
    ingredients: [
      'Red Onion Extract (Allium Cepa) - High sulfur content helps rebuild hair proteins.',
      'Curry Leaf Extract - Rich in beta-carotene and amino acids to reduce thinning.',
      'Bhringraj - Stimulates healthy follicle growth cycles.',
    ],
    aiSummary: {
      overview:
        'Customers report visible reduction in shower drain hair fall, healthier scalp sensation, and noticeable baby hair growth along temples within 4 to 6 weeks of use.',
      highlights: [
        'Hair fall reduced by more than 60% after three washes.',
        'Doesn’t smell like raw onion at all—leaves hair fragrant and clean.',
        'Great companion for sensitive scalp prone to seasonal hair loss.',
      ],
    },
    customerPhotos: [
      '/assets/spotlight_detail/customer_2.jpg',
      '/assets/spotlight_detail/customer_1.jpg',
      '/assets/spotlight_detail/customer_3.jpg',
      '/assets/spotlight_detail/customer_4.jpg',
    ],
  },
};

export const SpotlightProductDetailsPage: React.FC<SpotlightProductDetailsProps> = ({
  spotlightId,
  onBackToHome,
  onAddToCart,
}) => {
  const config = SPOTLIGHT_PRODUCTS[spotlightId] || SPOTLIGHT_PRODUCTS['healthy-soft-hair'];

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('info');
  const [showToast, setShowToast] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const selectedVariant = config.variants[selectedVariantIndex] || config.variants[0];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [spotlightId]);

  // Monitor scroll for sticky bottom bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOrderNow = () => {
    onAddToCart?.(config.title);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const toggleAccordion = (key: string) => {
    setActiveAccordion(activeAccordion === key ? null : key);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#1E3E2B', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Toast Notification */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 99999,
            backgroundColor: '#1E4332',
            color: '#FFFFFF',
            padding: '14px 24px',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'toastSlideIn 0.35s ease forwards',
          }}
        >
          <CheckCircle2 size={20} color="#4ADE80" />
          <span style={{ fontWeight: 600, fontSize: '14.5px' }}>
            Added {quantity}x {config.title} to your bag!
          </span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header
        style={{
          borderBottom: '1px solid #ECEEEB',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFFFFF',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <button
          onClick={onBackToHome}
          style={{
            background: '#F0F5F1',
            border: 'none',
            borderRadius: '9999px',
            padding: '8px 18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#214232',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#E2ECE5')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#F0F5F1')}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#2C5740',
            textTransform: 'uppercase',
          }}
        >
          AMRUTAM
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#346548',
              fontSize: '13.5px',
              fontWeight: 600,
              background: '#F5FAF6',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid #D6E8DC',
            }}
          >
            <ShieldCheck size={16} />
            <span>100% Authentic</span>
          </div>
        </div>
      </header>

      {/* Main Product Presentation (Two Column Layout Matching Screenshot 1) */}
      <main style={{ maxWidth: '1180px', margin: '0 auto', padding: 'clamp(32px, 5vw, 56px) 20px 40px' }}>
        <style>{`
          .product-grid-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: clamp(28px, 4.5vw, 56px);
            align-items: start;
          }

          @media (max-width: 920px) {
            .product-grid-layout {
              grid-template-columns: 1fr;
              gap: 36px;
            }
          }

          /* Left Hero Showcase Card */
          .showcase-media-box {
            position: relative;
            background: #F4E7DF;
            border-radius: 28px;
            overflow: hidden;
            box-shadow: 0 16px 40px -10px rgba(50, 30, 20, 0.12);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: clamp(20px, 3vw, 28px);
            box-sizing: border-box;
          }

          .showcase-image-wrapper {
            position: relative;
            width: 100%;
            aspect-ratio: 1 / 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .showcase-main-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 20px;
            display: block;
            transition: transform 0.4s ease;
          }

          .showcase-media-box:hover .showcase-main-img {
            transform: scale(1.02);
          }

          /* Badges on Image */
          .badge-expectation {
            position: absolute;
            top: 18px;
            left: 18px;
            background-color: #234833;
            color: #FFFFFF;
            padding: 8px 16px;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.01em;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
            z-index: 10;
          }

          .badge-discount-tag {
            position: absolute;
            top: 18px;
            right: 18px;
            background-color: #FF5A00;
            color: #FFFFFF;
            font-weight: 700;
            font-size: 13.5px;
            padding: 4px 10px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(255, 90, 0, 0.35);
            z-index: 10;
          }

          /* Carousel Dots */
          .carousel-dots-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            margin-top: 18px;
          }

          .carousel-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #CFC5BC;
            transition: all 0.3s ease;
          }

          .carousel-dot.active {
            width: 22px;
            height: 6px;
            border-radius: 9999px;
            background: #234833;
          }

          /* Size Selection Cards */
          .size-card-option {
            border: 2px solid #234833;
            background-color: #FCFDFB;
            border-radius: 8px;
            padding: 12px 18px;
            min-width: 140px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            position: relative;
            cursor: pointer;
            transition: all 0.25s ease;
            box-sizing: border-box;
          }

          .size-card-option.inactive {
            border-color: #DDE5DF;
            background-color: #FFFFFF;
            opacity: 0.85;
          }

          .size-card-option.inactive:hover {
            border-color: #8EAA97;
            opacity: 1;
          }

          /* Order Now Button */
          .order-now-button {
            flex: 1;
            background-color: #2E5738;
            color: #FFFFFF;
            border: none;
            border-radius: 6px;
            padding: 16px 28px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 6px 18px rgba(46, 87, 56, 0.25);
          }

          .order-now-button:hover {
            background-color: #22432B;
            transform: translateY(-2px);
            box-shadow: 0 10px 24px rgba(46, 87, 56, 0.35);
          }

          .order-now-button:active {
            transform: translateY(0);
          }

          /* Trust Banner Bar */
          .trust-ribbon-bar {
            background-color: #234833;
            color: #FFFFFF;
            padding: 10px 14px;
            border-radius: 6px;
            font-size: 11.5px;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-align: center;
            text-transform: uppercase;
            box-sizing: border-box;
            line-height: 1.4;
          }

          /* Shark Tank Banner */
          .shark-tank-banner-box {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid #E1E8E3;
            transition: transform 0.3s ease;
          }

          .shark-tank-banner-box:hover {
            transform: scale(1.01);
          }

          .shark-tank-banner-box img {
            width: 100%;
            height: auto;
            display: block;
          }

          /* Interactive Accordions */
          .accordion-item {
            background-color: #FAF8EE;
            border: 1px solid #E5E1C9;
            border-radius: 6px;
            margin-bottom: 12px;
            overflow: hidden;
            transition: border-color 0.2s ease;
          }

          .accordion-header {
            width: 100%;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: transparent;
            border: none;
            cursor: pointer;
            color: #274C37;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 16.5px;
            font-weight: 600;
            text-align: left;
          }

          .accordion-icon-box {
            width: 28px;
            height: 28px;
            background-color: #274C37;
            color: #FFFFFF;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 700;
            line-height: 1;
          }

          .accordion-content {
            padding: 0 20px 20px;
            font-size: 14.5px;
            color: #3E5446;
            line-height: 1.7;
          }

          /* Sticky Bottom Bar */
          .sticky-buy-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #FFFFFF;
            box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.1);
            border-top: 1px solid #E5ECE7;
            padding: 12px 24px;
            z-index: 900;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            animation: slideUpBar 0.35s ease;
          }

          @keyframes slideUpBar {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}</style>

        <div className="product-grid-layout">
          
          {/* LEFT COLUMN: Large Rounded Media Showcase with Callout Pointers */}
          <div className="showcase-media-box">
            {/* Top Left Badge */}
            <div className="badge-expectation">
              What to expect from this product?
            </div>

            {/* Top Right Discount Badge */}
            <div className="badge-discount-tag">
              -{selectedVariant.discountPercent}%
            </div>

            {/* Main Product Image */}
            <div className="showcase-image-wrapper">
              <img
                src={config.featureImage}
                alt={config.title}
                className="showcase-main-img"
              />
            </div>

            {/* Carousel Dots Row */}
            <div className="carousel-dots-row">
              <div className="carousel-dot active" />
              {[...Array(8)].map((_, i) => (
                <div key={i} className="carousel-dot" />
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Buy Box & Product Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Product Title */}
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(1.55rem, 2.6vw, 2.1rem)',
                fontWeight: 700,
                color: '#274C37',
                lineHeight: 1.3,
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              {config.title}
            </h1>

            {/* Star Rating & Review Count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '2px', color: '#F2AE1C' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#F2AE1C" strokeWidth={0} />
                ))}
              </div>
              <span style={{ fontSize: '14.5px', color: '#3A5243', fontWeight: 500 }}>
                {config.reviewCount} reviews
              </span>
            </div>

            {/* Price Line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span
                style={{
                  fontSize: '22px',
                  color: '#79897E',
                  textDecoration: 'line-through',
                  fontWeight: 500,
                }}
              >
                ₹{selectedVariant.originalPrice}
              </span>
              <span
                style={{
                  fontSize: '32px',
                  color: '#D1381A',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                }}
              >
                ₹{selectedVariant.discountedPrice}
              </span>
              <span
                style={{
                  backgroundColor: '#FF5A00',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '4px',
                  letterSpacing: '0.04em',
                }}
              >
                SAVE {selectedVariant.discountPercent}%
              </span>
            </div>

            {/* Size Selector */}
            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#274C37',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '10px',
                }}
              >
                SIZE: {selectedVariant.size}
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                {config.variants.map((v, idx) => {
                  const isSelected = idx === selectedVariantIndex;
                  return (
                    <div
                      key={v.size}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`size-card-option ${isSelected ? '' : 'inactive'}`}
                    >
                      {/* Checkmark circle badge when active */}
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#274C37',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={13} strokeWidth={3} />
                        </div>
                      )}

                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#274C37' }}>
                        {v.size}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#274C37' }}>
                        -{v.discountPercent}%
                      </span>
                      <span style={{ fontSize: '17px', fontWeight: 800, color: '#274C37' }}>
                        ₹{v.discountedPrice}
                      </span>
                      <span style={{ fontSize: '12.5px', textDecoration: 'line-through', color: '#88988D' }}>
                        ₹{v.originalPrice}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#D1381A' }}>
                        Save ₹{v.savings}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stepper and ORDER NOW CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
              {/* Quantity Stepper */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #C4D4C8',
                  borderRadius: '6px',
                  backgroundColor: '#FFFFFF',
                  padding: '4px',
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    background: 'none',
                    border: 'none',
                    width: '36px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#274C37',
                  }}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span
                  style={{
                    width: '32px',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#274C37',
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    width: '36px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#274C37',
                  }}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Order Now Button */}
              <button onClick={handleOrderNow} className="order-now-button">
                ORDER NOW
              </button>
            </div>

            {/* Trust Ribbon Bar */}
            <div className="trust-ribbon-bar">
              ★ AYUSH APPROVED • RECOMMENDED BY AYURVEDIC DOCTORS • BASED ON 5000+ YEARS OF AYURVEDA
            </div>

            {/* Shark Tank Banner */}
            <div className="shark-tank-banner-box">
              <img
                src="/assets/spotlight_detail/shark_tank_banner.webp"
                alt="Amrutam as seen on Shark Tank India"
              />
            </div>

          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECONDARY SECTION (ACCORDIONS & REVIEWS MATCHING SCREENSHOT 2) */}
        {/* ------------------------------------------------------------- */}

        <div style={{ marginTop: 'clamp(44px, 6vw, 68px)' }}>
          
          {/* 1. Interactive Accordions */}
          <div style={{ marginBottom: '48px' }}>
            
            {/* Product Info */}
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => toggleAccordion('info')}
                aria-expanded={activeAccordion === 'info'}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>♡</span>
                  <span>Product Info</span>
                </span>
                <div className="accordion-icon-box">
                  {activeAccordion === 'info' ? '−' : '+'}
                </div>
              </button>
              {activeAccordion === 'info' && (
                <div className="accordion-content">
                  {config.productInfo.map((p, i) => (
                    <p key={i} style={{ margin: '0 0 10px 0' }}>
                      {p}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* How to Use? */}
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => toggleAccordion('usage')}
                aria-expanded={activeAccordion === 'usage'}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>☆</span>
                  <span>How to Use?</span>
                </span>
                <div className="accordion-icon-box">
                  {activeAccordion === 'usage' ? '−' : '+'}
                </div>
              </button>
              {activeAccordion === 'usage' && (
                <div className="accordion-content">
                  <ol style={{ margin: 0, paddingLeft: '20px' }}>
                    {config.howToUse.map((step, i) => (
                      <li key={i} style={{ marginBottom: '8px' }}>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* All Herbal Ingredients */}
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => toggleAccordion('ingredients')}
                aria-expanded={activeAccordion === 'ingredients'}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🌿</span>
                  <span>All Herbal Ingredients</span>
                </span>
                <div className="accordion-icon-box">
                  {activeAccordion === 'ingredients' ? '−' : '+'}
                </div>
              </button>
              {activeAccordion === 'ingredients' && (
                <div className="accordion-content">
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {config.ingredients.map((ing, i) => (
                      <li key={i} style={{ marginBottom: '8px' }}>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* 2. Reviews Section: "Your Review Helps Others" */}
          <div style={{ marginTop: '36px' }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)',
                fontWeight: 600,
                color: '#274C37',
                margin: '0 0 16px 0',
              }}
            >
              Your Review Helps Others
            </h2>

            {/* Rating Bar + Review Us Button + Filter Icons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#1B3827' }}>
                  {config.ratingScore}
                </span>
                <span style={{ fontSize: '15px', color: '#5A6F62', fontWeight: 500 }}>
                  {config.reviewCount.toLocaleString()} Reviews
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  style={{
                    backgroundColor: '#E8A800',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 24px',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(232, 168, 0, 0.3)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#CF9600')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E8A800')}
                >
                  Review Us!
                </button>

                <button
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #C4D2C9',
                    borderRadius: '6px',
                    padding: '10px',
                    cursor: 'pointer',
                    color: '#274C37',
                  }}
                  aria-label="Search reviews"
                >
                  <Search size={18} />
                </button>

                <button
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #C4D2C9',
                    borderRadius: '6px',
                    padding: '10px',
                    cursor: 'pointer',
                    color: '#274C37',
                  }}
                  aria-label="Filter reviews"
                >
                  <Filter size={18} />
                </button>

                <button
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #C4D2C9',
                    borderRadius: '6px',
                    padding: '10px',
                    cursor: 'pointer',
                    color: '#274C37',
                  }}
                  aria-label="Sort reviews"
                >
                  <ArrowUpDown size={18} />
                </button>
              </div>
            </div>

            {/* Customer Photo Thumbnails */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '14px',
                maxWidth: '480px',
                marginBottom: '32px',
              }}
            >
              {config.customerPhotos.map((photo, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    aspectRatio: '1 / 1',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    transition: 'transform 0.25s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <img
                    src={photo}
                    alt={`Customer review transformation ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ))}
            </div>

            {/* Customers Say AI-powered Box */}
            <div
              style={{
                backgroundColor: '#FAF8F5',
                border: '1px solid #EBE5DB',
                borderRadius: '14px',
                padding: '24px 28px',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '14px',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#1C3828',
                  }}
                >
                  Customers say
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: '#71867A',
                  }}
                >
                  <Sparkles size={14} color="#274C37" />
                  <span>AI-powered review summary based on recent customer reviews</span>
                </div>
              </div>

              <p
                style={{
                  fontSize: '14px',
                  lineHeight: 1.65,
                  color: '#273C30',
                  margin: '0 0 18px 0',
                }}
              >
                {config.aiSummary.overview}
              </p>

              <div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#1C3828',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Review highlights
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {config.aiSummary.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontSize: '13.5px',
                        color: '#263D31',
                        lineHeight: 1.5,
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '6px',
                      }}
                    >
                      <span style={{ color: '#D97706', fontWeight: 700 }}>›</span>
                      <span>"{item}"</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Sticky Bottom Bar (Slides in on scroll) */}
      {showStickyBar && (
        <div className="sticky-buy-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src={config.featureImage}
              alt={config.title}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #E1ECE5',
              }}
            />
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '14.5px',
                  color: '#1C3828',
                  maxWidth: '380px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {config.title}
              </div>
              <div style={{ fontSize: '13px', color: '#587063' }}>
                <span style={{ textDecoration: 'line-through', marginRight: '6px' }}>
                  ₹{selectedVariant.originalPrice}
                </span>
                <span style={{ color: '#D1381A', fontWeight: 700 }}>
                  ₹{selectedVariant.discountedPrice}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#274C37',
                textDecoration: 'underline',
              }}
            >
              {selectedVariant.size}
            </span>

            {/* Stepper */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #C4D4C8',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                padding: '2px',
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  background: 'none',
                  border: 'none',
                  width: '28px',
                  height: '32px',
                  cursor: 'pointer',
                  color: '#274C37',
                }}
              >
                <Minus size={14} />
              </button>
              <span style={{ width: '24px', textAlign: 'center', fontWeight: 700, fontSize: '14px' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  width: '28px',
                  height: '32px',
                  cursor: 'pointer',
                  color: '#274C37',
                }}
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleOrderNow}
              style={{
                backgroundColor: '#2E5738',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 22px',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default SpotlightProductDetailsPage;
