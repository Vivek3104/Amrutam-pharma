import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Search,
  Zap,
  ShoppingBag,
  CheckCircle2,
  Award,
  ShieldCheck,
  Star,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  ArrowLeft,
  Heart
} from 'lucide-react';
import type { HeroSlide } from '../components/Hero';

export interface ProductDetailsPageProps {
  onBackToHome: () => void;
  slide?: HeroSlide;
}

interface PackOption {
  id: string;
  name: string;
  weight: string;
  originalPrice: number;
  discountedPrice: number;
  discountBadge: string;
  pricePerGram: string;
  badgeTag: string;
  savings: number;
}

interface ProductData {
  name: string;
  headline: string;
  bannerImage: string;
  productImage: string;
  gradient: string;
  rating: number;
  reviewCount: number;
  packOptions: PackOption[];
  miniTestimonials: {
    name: string;
    age: string;
    image: string;
    date: string;
    text: string;
  }[];
  faqs: { id: number; question: string; answer: string }[];
  reviews: { id: number; name: string; age: string; rating: number; date: string; title: string; comment: string }[];
}

const PRODUCTS_DATA: Record<number, ProductData> = {
  // Slide 0: Nari Sondarya Malt (Irregular Periods)
  0: {
    name: 'Nari Sondarya Malt',
    headline: 'Ayurvedic Malt for Irregular Periods, Period Pain & PCOD',
    bannerImage: '/assets/nari_malt_spoon_banner.jpg',
    productImage: '/assets/nari_sondarya_transparent.png',
    gradient: 'linear-gradient(to right, rgba(110, 65, 25, 0.88) 0%, rgba(130, 80, 30, 0.45) 60%, rgba(0,0,0,0.05) 100%)',
    rating: 4.9,
    reviewCount: 1420,
    packOptions: [
      { id: 'starter', name: 'Starter', weight: '400 GM', originalPrice: 1401, discountedPrice: 1250, discountBadge: '11% OFF', pricePerGram: '₹3.12/g', badgeTag: 'Starter', savings: 151 },
      { id: 'bestseller', name: 'Best Seller', weight: '625 GM', originalPrice: 1990, discountedPrice: 1749, discountBadge: '12% OFF', pricePerGram: '₹2.79/g', badgeTag: 'Best Seller', savings: 241 },
      { id: 'ritual', name: 'Wellness Ritual', weight: '2 x 625 GM', originalPrice: 3980, discountedPrice: 3348, discountBadge: '16% OFF', pricePerGram: '₹2.67/g', badgeTag: 'Wellness Ritual', savings: 632 },
    ],
    miniTestimonials: [
      {
        name: 'Swati',
        age: '30 yrs',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
        date: 'Apr 20, 2026',
        text: 'Struggled with PCOD and irregular periods for years. After 3 months of consistent use, my cycles are finally regular and my stress feels so much under control. ✨',
      },
      {
        name: 'Pooja',
        age: '35 yrs',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120',
        date: 'Jan 28, 2026',
        text: 'After 3 months with Amrutam malt, my period cycles returned to normal. Cramps and fatigue improved significantly within 2 weeks. Honestly can’t recommend it enough!',
      },
    ],
    faqs: [
      {
        id: 1,
        question: 'How soon can I expect results from Amrutam Nari Sondarya Malt?',
        answer: 'Most women report reduced period pain, reduced bloating, and improved daily energy within 2-3 weeks of daily intake. Cycle regularity and hormonal balance typically stabilize after 2-3 months of consistent use.',
      },
      {
        id: 2,
        question: 'What is the recommended daily dosage and best time to consume?',
        answer: 'Take 1 to 2 tablespoons (15g - 30g) twice daily after breakfast and dinner. You can consume it directly or mix it in a cup of warm milk or warm water.',
      },
      {
        id: 3,
        question: 'Is Nari Sondarya Malt effective for PCOD / PCOS management?',
        answer: 'Yes! Nari Sondarya Malt is formulated with classical Ayurvedic rasayanas including Shatavari, Ashwagandha, Lodhra, and Nagkesar. These herbs help regulate ovarian hormone secretion, balance estrogen levels, and reduce systemic inflammation associated with PCOD/PCOS.',
      },
      {
        id: 4,
        question: 'Are there any side effects, synthetic preservatives, or added sugar?',
        answer: 'Amrutam Malts are 100% natural, 100% vegetarian, ISO & GMP-certified. They contain zero artificial colors, synthetic hormones, or chemical preservatives.',
      },
      {
        id: 5,
        question: 'Can I consume this during my period days?',
        answer: 'Yes, Nari Sondarya Malt can be consumed continuously throughout your entire cycle, including during menstruation, as it actively relieves severe cramps and abdominal spasms.',
      },
    ],
    reviews: [
      { id: 1, name: 'Swati M.', age: '30 yrs', rating: 5, date: 'Apr 20, 2026', title: 'Cycle regularized within 2.5 months!', comment: 'Struggled with PCOD and irregular periods for 4+ years. After 3 months of consistent use of Nari Sondarya Malt, my cycles are finally regular (28-30 days) and my stress feels so much under control. Truly life changing! ✨' },
      { id: 2, name: 'Pooja K.', age: '35 yrs', rating: 5, date: 'Jan 28, 2026', title: 'Severe cramps completely gone', comment: 'I used to take heavy painkillers every month for period cramps. Switching to Amrutam malt was the best decision. Cramps and fatigue reduced significantly by month 2. Highly recommended!' },
      { id: 3, name: 'Ananya R.', age: '26 yrs', rating: 5, date: 'Mar 14, 2026', title: 'Pure authentic Ayurvedic taste', comment: 'Tastes rich, herbal, and naturally sweet. My hormonal acne cleared up as well. Buying the 2x625g Wellness Ritual pack now.' },
    ],
  },

  // Slide 1: Kumari Sondarya Malt (Teenage Periods)
  1: {
    name: 'Kumari Sondarya Malt',
    headline: 'Ayurvedic Malt for Teenage Periods, Puberty Balance & Cramp Relief',
    bannerImage: '/assets/kumari_malt_spoon_banner.jpg',
    productImage: '/assets/kumari_sondarya_transparent.png',
    gradient: 'linear-gradient(to right, rgba(140, 45, 75, 0.9) 0%, rgba(170, 60, 95, 0.45) 60%, rgba(0,0,0,0.05) 100%)',
    rating: 4.92,
    reviewCount: 980,
    packOptions: [
      { id: 'starter', name: 'Starter', weight: '400 GM', originalPrice: 1401, discountedPrice: 1250, discountBadge: '11% OFF', pricePerGram: '₹3.12/g', badgeTag: 'Starter', savings: 151 },
      { id: 'bestseller', name: 'Best Seller', weight: '625 GM', originalPrice: 1990, discountedPrice: 1749, discountBadge: '12% OFF', pricePerGram: '₹2.79/g', badgeTag: 'Best Seller', savings: 241 },
      { id: 'ritual', name: 'Wellness Ritual', weight: '2 x 625 GM', originalPrice: 3980, discountedPrice: 3348, discountBadge: '16% OFF', pricePerGram: '₹2.67/g', badgeTag: 'Wellness Ritual', savings: 632 },
    ],
    miniTestimonials: [
      {
        name: 'Riya',
        age: '17 yrs',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
        date: 'May 04, 2026',
        text: 'School days during periods used to be unbearable with awful stomach aches. Now after 2 months of Kumari Malt, periods are so smooth and completely manageable!',
      },
      {
        name: 'Sunita (Mom)',
        age: '44 yrs',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
        date: 'Apr 11, 2026',
        text: 'My 15-year-old daughter was missing school every month due to painful irregular periods. Our Vaidya recommended Kumari Sondarya Malt and it has been a blessing.',
      },
    ],
    faqs: [
      {
        id: 1,
        question: 'Is Kumari Sondarya Malt safe for adolescent girls aged 12-19?',
        answer: 'Yes, absolutely. Kumari Sondarya Malt is specifically tailored for adolescents and growing teenage girls. It contains gentle Rasayanas like Aloe Vera (Kumari), Manjistha, and Shatavari to support puberty development safely without synthetic hormones.',
      },
      {
        id: 2,
        question: 'How does it help with irregular cycles and teenage menstrual cramps?',
        answer: 'During teenage years, the hypothalamic-pituitary-ovarian axis is still maturing. Kumari Malt nourishes the reproductive channels (Artava Vaha Srotas), relieves muscle spasms, and helps cycles settle into a regular rhythm.',
      },
      {
        id: 3,
        question: 'How should a teenager take Kumari Sondarya Malt?',
        answer: 'Take 1 to 2 tablespoons twice daily after meals with a glass of warm milk or water. It has a naturally delicious, sweet herbal taste that teens love.',
      },
      {
        id: 4,
        question: 'Does it help with teenage hormonal acne breakouts?',
        answer: 'Yes! Aloe Vera, Rose, and Manjistha act as blood purifiers that eliminate Pitta toxins, calming down teenage skin flare-ups and hormonal breakouts.',
      },
    ],
    reviews: [
      { id: 1, name: 'Riya S.', age: '17 yrs', rating: 5, date: 'May 04, 2026', title: 'Zero school absences now!', comment: 'I used to get such bad cramps that I had to lie in bed with a hot water bottle. Kumari Malt reduced the pain so much by my second month. Totally recommend it to all teenage girls.' },
      { id: 2, name: 'Sunita P.', age: 'Mother of 15-yr-old', rating: 5, date: 'Apr 11, 2026', title: 'Safe & natural for young girls', comment: 'I did not want to give synthetic hormone pills to my daughter. Kumari Sondarya Malt has regulated her cycle naturally and her mood swings are much better.' },
      { id: 3, name: 'Mehak G.', age: '19 yrs', rating: 5, date: 'Feb 19, 2026', title: 'Tastes amazing and works fast', comment: 'Very easy to eat with warm milk. My energy is up and period pain is basically gone.' },
    ],
  },

  // Slide 2: Digestive Care Herbal Malt (Digestion)
  2: {
    name: 'Digestive Care Herbal Malt',
    headline: 'Ayurvedic Formula for Digestion, Acidity, Gas & Gut Health',
    bannerImage: '/assets/amrutam_digestive_malt_1789275587207.jpg',
    productImage: '/assets/digestive_malt.jpg',
    gradient: 'linear-gradient(to right, rgba(130, 75, 15, 0.9) 0%, rgba(160, 95, 25, 0.45) 60%, rgba(0,0,0,0.05) 100%)',
    rating: 4.88,
    reviewCount: 1150,
    packOptions: [
      { id: 'starter', name: 'Starter', weight: '400 GM', originalPrice: 1350, discountedPrice: 1199, discountBadge: '11% OFF', pricePerGram: '₹3.00/g', badgeTag: 'Starter', savings: 151 },
      { id: 'bestseller', name: 'Best Seller', weight: '625 GM', originalPrice: 1890, discountedPrice: 1649, discountBadge: '13% OFF', pricePerGram: '₹2.64/g', badgeTag: 'Best Seller', savings: 241 },
      { id: 'ritual', name: 'Wellness Ritual', weight: '2 x 625 GM', originalPrice: 3780, discountedPrice: 3199, discountBadge: '15% OFF', pricePerGram: '₹2.56/g', badgeTag: 'Wellness Ritual', savings: 581 },
    ],
    miniTestimonials: [
      {
        name: 'Rohit K.',
        age: '38 yrs',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
        date: 'Apr 02, 2026',
        text: 'Years of chronic acid reflux and indigestion cured within weeks. No more daily antacid pills!',
      },
      {
        name: 'Divya N.',
        age: '42 yrs',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
        date: 'Mar 15, 2026',
        text: 'Gentle on the stomach and works wonders for bloating after meals. An essential daily habit now.',
      },
    ],
    faqs: [
      { id: 1, question: 'How does Amrutam Digestive Malt relieve acid reflux and gas?', answer: 'Formulated with classical Deepana and Pachana herbs like Haritaki, Ajwain, Pippali, and Jeeraka that rekindle the digestive fire (Jatharagni) without causing excess heat.' },
      { id: 2, question: 'Can it be taken for chronic constipation?', answer: 'Yes, it provides mild natural lubrication to the intestines and supports smooth daily elimination without causing dependency.' },
    ],
    reviews: [
      { id: 1, name: 'Rohit K.', age: '38 yrs', rating: 5, date: 'Apr 02, 2026', title: 'No more antacids!', comment: 'I used to take antacid tablets every morning. This Ayurvedic malt has completely healed my gut burning and acidity.' },
      { id: 2, name: 'Divya N.', age: '42 yrs', rating: 5, date: 'Mar 15, 2026', title: 'Bloating gone in 10 days', comment: 'Very soothing for post-lunch bloating and heavy stomach feel.' },
    ],
  },

  // Slide 3: Bhringraj Hair Care Malt (Hair Care)
  3: {
    name: 'Bhringraj Hair Care Malt',
    headline: 'Ayurvedic Formula for Hair Fall Control, Density & Scalp Health',
    bannerImage: '/assets/amrutam_hair_malt_1789275609062.jpg',
    productImage: '/assets/hair_malt.jpg',
    gradient: 'linear-gradient(to right, rgba(20, 70, 75, 0.9) 0%, rgba(30, 95, 100, 0.45) 60%, rgba(0,0,0,0.05) 100%)',
    rating: 4.9,
    reviewCount: 1830,
    packOptions: [
      { id: 'starter', name: 'Starter', weight: '400 GM', originalPrice: 1450, discountedPrice: 1299, discountBadge: '10% OFF', pricePerGram: '₹3.25/g', badgeTag: 'Starter', savings: 151 },
      { id: 'bestseller', name: 'Best Seller', weight: '625 GM', originalPrice: 2050, discountedPrice: 1799, discountBadge: '12% OFF', pricePerGram: '₹2.88/g', badgeTag: 'Best Seller', savings: 251 },
      { id: 'ritual', name: 'Wellness Ritual', weight: '2 x 625 GM', originalPrice: 4100, discountedPrice: 3449, discountBadge: '16% OFF', pricePerGram: '₹2.76/g', badgeTag: 'Wellness Ritual', savings: 651 },
    ],
    miniTestimonials: [
      {
        name: 'Varun M.',
        age: '29 yrs',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
        date: 'Apr 25, 2026',
        text: 'Hair fall stopped by almost 80% after finishing my first jar. Roots feel visibly stronger.',
      },
      {
        name: 'Neha S.',
        age: '33 yrs',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
        date: 'Mar 29, 2026',
        text: 'Internal hair nourishment really works! My hair density has improved and scalp feels clean.',
      },
    ],
    faqs: [
      { id: 1, question: 'How does consuming malt improve hair growth compared to hair oil?', answer: 'Hair follicles receive nutrients through blood circulation. Consuming Bhringraj and Amla internally nourishes Asthi Dhatu (bone tissue), which in Ayurveda directly governs hair growth and strength.' },
      { id: 2, question: 'Does it prevent premature greying of hair?', answer: 'Yes! Bhringraj is revered as Keshya (hair tonic) and Rasayana that calms aggravated Pitta dosha, preventing premature melanin loss.' },
    ],
    reviews: [
      { id: 1, name: 'Varun M.', age: '29 yrs', rating: 5, date: 'Apr 25, 2026', title: 'Noticeable hair fall reduction', comment: 'Saw a huge reduction in hair strands on my pillow and comb. Very potent formula.' },
      { id: 2, name: 'Neha S.', age: '33 yrs', rating: 5, date: 'Mar 29, 2026', title: 'Must-have for thinning hair', comment: 'Pairing this with a balanced diet has made my hair noticeably thicker.' },
    ],
  },

  // Slide 4: Shatavari Wellness Malt (Hormones & Radiance)
  4: {
    name: 'Shatavari Wellness Malt',
    headline: 'Ayurvedic Formula for Hormonal Vitality, Radiance & Strength',
    bannerImage: '/assets/amrutam_shatavari_malt_1789275626529.jpg',
    productImage: '/assets/shatavari_malt.jpg',
    gradient: 'linear-gradient(to right, rgba(95, 30, 75, 0.9) 0%, rgba(125, 45, 100, 0.45) 60%, rgba(0,0,0,0.05) 100%)',
    rating: 4.93,
    reviewCount: 2100,
    packOptions: [
      { id: 'starter', name: 'Starter', weight: '400 GM', originalPrice: 1401, discountedPrice: 1250, discountBadge: '11% OFF', pricePerGram: '₹3.12/g', badgeTag: 'Starter', savings: 151 },
      { id: 'bestseller', name: 'Best Seller', weight: '625 GM', originalPrice: 1990, discountedPrice: 1749, discountBadge: '12% OFF', pricePerGram: '₹2.79/g', badgeTag: 'Best Seller', savings: 241 },
      { id: 'ritual', name: 'Wellness Ritual', weight: '2 x 625 GM', originalPrice: 3980, discountedPrice: 3348, discountBadge: '16% OFF', pricePerGram: '₹2.67/g', badgeTag: 'Wellness Ritual', savings: 632 },
    ],
    miniTestimonials: [
      {
        name: 'Shreya B.',
        age: '31 yrs',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
        date: 'May 02, 2026',
        text: 'Restored my natural energy and female vitality. Best natural Shatavari formula on the market.',
      },
      {
        name: 'Maya T.',
        age: '45 yrs',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120',
        date: 'Apr 19, 2026',
        text: 'Helped tremendously with perimenopause hot flashes, mood fluctuations, and daily vitality.',
      },
    ],
    faqs: [
      { id: 1, question: 'What makes Shatavari so important for women wellness?', answer: 'Shatavari (Asparagus racemosus) is known as the "Queen of Herbs". It balances female hormones, enhances Ojas (vital immunity), and nourishes bodily tissues.' },
      { id: 2, question: 'Can it be taken for postpartum recovery and lactation support?', answer: 'Yes! Shatavari is widely prescribed by Ayurvedic Vaidyas to support healthy breast milk production and postpartum strength.' },
    ],
    reviews: [
      { id: 1, name: 'Shreya B.', age: '31 yrs', rating: 5, date: 'May 02, 2026', title: 'Fabulous energy booster', comment: 'I feel so much more balanced and energetic. Best herbal tonic for women.' },
      { id: 2, name: 'Maya T.', age: '45 yrs', rating: 5, date: 'Apr 19, 2026', title: 'Perimenopause relief', comment: 'Hot flashes and sleep disturbances reduced dramatically within 3 weeks.' },
    ],
  },
};

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  onBackToHome,
  slide,
}) => {
  // Use slide id (default to 0 if undefined)
  const slideId = slide?.id ?? 0;
  const currentProduct = PRODUCTS_DATA[slideId] || PRODUCTS_DATA[0];

  const [selectedPack, setSelectedPack] = useState<PackOption>(currentProduct.packOptions[1]); // Best Seller default
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);
  const [showOrderToast, setShowOrderToast] = useState(false);

  useEffect(() => {
    setSelectedPack(currentProduct.packOptions[1]);
    setQuantity(1);
  }, [slideId]);

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleAddToCart = () => {
    setCartCount((prev) => prev + quantity);
    setShowOrderToast(true);
    setTimeout(() => setShowOrderToast(false), 3500);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF5EE', color: '#2D4C3A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Toast Notification */}
      {showOrderToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: '#1E4332',
          color: '#FFF',
          padding: '14px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.95rem',
          animation: 'slideUp 0.3s ease-out',
        }}>
          <CheckCircle2 color="#10B981" size={22} />
          <div>
            <strong>Added to Bag!</strong>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
              {quantity}x {currentProduct.name} ({selectedPack.weight})
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <header style={{ background: '#FAF5EE', borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{
          padding: '12px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onBackToHome}
              style={{
                background: 'rgba(58, 100, 59, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#3A643B',
              }}
              title="Back to Hero Home"
            >
              <ArrowLeft size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', fontWeight: 600, color: '#3A643B' }}>
              <PhoneCall size={16} />
              <span>+91 98000 00000</span>
            </div>
          </div>

          <div
            onClick={onBackToHome}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.85rem',
              fontWeight: 800,
              letterSpacing: '0.28em',
              color: '#3A643B',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            AMRUTAM
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Search size={20} color="#3A643B" style={{ cursor: 'pointer' }} />
            <Zap size={20} color="#3A643B" style={{ cursor: 'pointer' }} />
            <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ShoppingBag size={20} color="#3A643B" />
              <span style={{
                position: 'absolute',
                top: '-7px',
                right: '-9px',
                background: '#3A643B',
                color: '#FFF',
                fontSize: '0.6rem',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {cartCount}
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Links */}
        <div style={{
          padding: '12px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          fontSize: '0.92rem',
          fontWeight: 600,
          color: '#3A643B',
          borderTop: '1px solid rgba(0,0,0,0.04)',
        }}>
          <span onClick={onBackToHome} style={{ cursor: 'pointer' }}>Shop All</span>
          <span onClick={onBackToHome} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            Health
            <span style={{ background: '#FF5722', color: '#FFF', fontSize: '0.58rem', padding: '1px 6px', borderRadius: '8px', fontWeight: 800 }}>
              Hot
            </span>
          </span>
          <span onClick={onBackToHome} style={{ cursor: 'pointer' }}>Hair</span>
          <span onClick={onBackToHome} style={{ cursor: 'pointer' }}>Skin</span>
          <span onClick={onBackToHome} style={{ cursor: 'pointer' }}>Lifestyle</span>
          <span onClick={onBackToHome} style={{ cursor: 'pointer', color: '#3A643B', fontWeight: 700, borderBottom: '2px solid #3A643B', paddingBottom: '2px' }}>
            Community
          </span>
          <span style={{ cursor: 'pointer' }}>Blog</span>
          <span style={{ cursor: 'pointer' }}>About Us</span>
          <span style={{ cursor: 'pointer' }}>Account</span>
        </div>
      </header>

      {/* SECTION 1: Product Detail Hero & Pack Selection Grid */}
      <section style={{ maxWidth: '1280px', margin: '32px auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '36px',
          alignItems: 'start',
        }}>
          
          {/* Left Card Image Banner */}
          <div style={{
            borderRadius: '24px',
            position: 'relative',
            minHeight: '560px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.14)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}>
            {/* Background Image of Selected Product */}
            <img
              src={currentProduct.bannerImage}
              alt={currentProduct.name}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
            {/* Dark/Warm gradient vignette overlay for crystal clear text readability */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: currentProduct.gradient,
              pointerEvents: 'none',
            }} />

            {/* Left Headline Overlay */}
            <div style={{
              position: 'relative',
              zIndex: 3,
              padding: '38px',
              maxWidth: '360px',
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2rem, 3.4vw, 2.7rem)',
                color: '#FFFFFF',
                fontWeight: 700,
                lineHeight: 1.22,
                textShadow: '0 4px 14px rgba(0,0,0,0.35)',
              }}>
                {currentProduct.headline}
              </h2>
            </div>
          </div>

          {/* Right Product Selection & Purchase Details */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1E4332' }}>
                  {currentProduct.name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', color: '#F59E0B' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2D4C3A' }}>{currentProduct.rating}</span>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>({currentProduct.reviewCount.toLocaleString('en-IN')} Verified Reviews)</span>
              </div>
            </div>

            {/* Pack Size Selection Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
              {currentProduct.packOptions.map((pack) => {
                const isSelected = selectedPack.id === pack.id;
                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedPack(pack)}
                    style={{
                      border: isSelected ? '2px solid #2D5B46' : '1px solid #E2D9CC',
                      background: isSelected ? '#FAF7F0' : '#FFFFFF',
                      borderRadius: '14px',
                      padding: '14px 12px',
                      cursor: 'pointer',
                      position: 'relative',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 6px 18px rgba(45, 91, 70, 0.15)' : 'none',
                    }}
                  >
                    {/* Badge Tag */}
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: isSelected ? '#2D5B46' : '#555',
                      color: '#FFF',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '2px 10px',
                      borderRadius: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      whiteSpace: 'nowrap',
                    }}>
                      {pack.badgeTag}
                    </div>

                    {/* Pack Visual Image */}
                    <div style={{ height: '70px', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={currentProduct.productImage}
                        alt={pack.name}
                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>

                    {/* Weight & Price */}
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E4332', marginTop: '8px' }}>
                      {pack.weight}
                    </div>
                    <div style={{ fontSize: '0.82rem', marginTop: '2px' }}>
                      <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '6px' }}>
                        ₹{pack.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontWeight: 800, color: '#1E4332' }}>
                        ₹{pack.discountedPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Discount & Price Per Gram */}
                    <div style={{
                      background: '#E8F5E9',
                      color: '#2E7D32',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '6px',
                      marginTop: '6px',
                      display: 'inline-block',
                    }}>
                      {pack.discountBadge}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#666', marginTop: '4px' }}>
                      {pack.pricePerGram}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Compliance Badges Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              background: '#FFFFFF',
              border: '1px solid #E2D9CC',
              borderRadius: '12px',
              padding: '12px 18px',
              marginBottom: '24px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#2D4C3A',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#10B981" /> 100% Ayurvedic
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={16} color="#10B981" /> GMP Certified
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#10B981" /> Ayush Certification
              </span>
            </div>

            {/* Quantity Selector & Order Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
              {/* Quantity counter */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #2D5B46',
                borderRadius: '10px',
                background: '#FFF',
                padding: '4px 8px',
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#2D5B46' }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ padding: '0 12px', fontWeight: 800, fontSize: '1rem', color: '#2D5B46' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#2D5B46' }}
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Order Button */}
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  background: '#2D5B46',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 20px rgba(45, 91, 70, 0.3)',
                  transition: 'transform 0.2s',
                }}
              >
                ORDER NOW - ₹{(selectedPack.discountedPrice * quantity).toLocaleString('en-IN')}
                <span style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 800,
                }}>
                  SAVE ₹{selectedPack.savings * quantity}
                </span>
              </button>
            </div>

            {/* Testimonials Mini Cards Carousel */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              {currentProduct.miniTestimonials.map((t, idx) => (
                <div key={idx} style={{ background: '#FFF7ED', border: '1px solid #FFE4E6', borderRadius: '16px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <img
                      src={t.image}
                      alt={t.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1E4332' }}>{t.name}</div>
                      <div style={{ display: 'flex', color: '#F59E0B' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />
                        ))}
                        <span style={{ fontSize: '0.72rem', color: '#666', marginLeft: '6px' }}>{t.age}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#4A5568', lineHeight: 1.5 }}>
                    {t.text}
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '8px' }}>{t.date}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: Frequently Asked Questions (FAQ Section) */}
      <section style={{ maxWidth: '980px', margin: '70px auto 50px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '2.4rem',
            color: '#1E4332',
            fontWeight: 700,
            marginBottom: '10px',
          }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: '#666', fontSize: '0.98rem' }}>
            Everything you need to know about {currentProduct.name}, usage & dosage.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {currentProduct.faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2D9CC',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: isOpen ? '0 8px 24px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#1E4332',
                  }}
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp size={20} color="#2D5B46" /> : <ChevronDown size={20} color="#2D5B46" />}
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 24px 22px 24px',
                    fontSize: '0.95rem',
                    color: '#4A5568',
                    lineHeight: 1.6,
                    borderTop: '1px solid #FAF5EE',
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: Verified Customer Reviews (Reviews Section) */}
      <section style={{ maxWidth: '1180px', margin: '70px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '2.4rem',
            color: '#1E4332',
            fontWeight: 700,
            marginBottom: '10px',
          }}>
            Real Results & Verified Feedback
          </h2>
          <p style={{ color: '#666', fontSize: '0.98rem' }}>
            Over 10,000+ satisfied customers trust {currentProduct.name}.
          </p>
        </div>

        {/* Rating Breakdown Header Card */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2D9CC',
          borderRadius: '20px',
          padding: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3.2rem', fontWeight: 800, color: '#1E4332', lineHeight: 1 }}>{currentProduct.rating}</div>
              <div style={{ display: 'flex', color: '#F59E0B', justifyContent: 'center', margin: '6px 0' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Out of 5 Stars</div>
            </div>
            <div style={{ width: '1px', height: '60px', background: '#E2D9CC' }} />
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E4332' }}>98.4% Satisfaction Rate</div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                Based on {currentProduct.reviewCount.toLocaleString('en-IN')} verified customer submissions.
              </div>
            </div>
          </div>

          <button style={{
            background: 'none',
            border: '2px solid #2D5B46',
            color: '#2D5B46',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.92rem',
            cursor: 'pointer',
          }}>
            Write a Review
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {currentProduct.reviews.map((rev) => (
            <div key={rev.id} style={{
              background: '#FFFFFF',
              border: '1px solid #E2D9CC',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', color: '#F59E0B' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#888' }}>{rev.date}</span>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1E4332', marginBottom: '8px' }}>
                  {rev.title}
                </h4>

                <p style={{ fontSize: '0.88rem', color: '#4A5568', lineHeight: 1.6 }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{
                borderTop: '1px solid #F5EFE6',
                paddingTop: '14px',
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.82rem',
              }}>
                <div style={{ fontWeight: 700, color: '#1E4332' }}>
                  {rev.name} <span style={{ fontWeight: 400, color: '#888' }}>({rev.age})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2E7D32', fontWeight: 700, fontSize: '0.75rem' }}>
                  <CheckCircle2 size={14} /> Verified Buyer
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Amrutam Brand Footer */}
      <footer style={{ background: '#1E4332', color: '#FAF5EE', padding: '60px 0 30px 0', marginTop: '60px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '36px',
            marginBottom: '40px',
          }}>
            <div>
              <div 
                onClick={onBackToHome}
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  letterSpacing: '0.24em',
                  color: '#FAF5EE',
                  marginBottom: '14px',
                  cursor: 'pointer',
                }}
              >
                AMRUTAM
              </div>
              <p style={{ fontSize: '0.88rem', opacity: 0.85, lineHeight: 1.6 }}>
                Bridging ancient Vedic healing wisdom with authentic pharmaceutical precision. ISO 9001:2026 & GMP Certified Classical Ayurvedic Formulations.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: '#FAF5EE' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', opacity: 0.85 }}>
                <li><a onClick={onBackToHome} style={{ color: 'inherit', cursor: 'pointer' }}>Home Carousel</a></li>
                <li><a onClick={onBackToHome} style={{ color: 'inherit', cursor: 'pointer' }}>Shop All Formulations</a></li>
                <li><a style={{ color: 'inherit', cursor: 'pointer' }}>Ayurvedic Blog</a></li>
                <li><a style={{ color: 'inherit', cursor: 'pointer' }}>About Amrutam</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: '#FAF5EE' }}>Contact & Support</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', opacity: 0.85 }}>
                <li>Helpline: +91 98000 00000 (24/7)</li>
                <li>Email: care@amrutam-wellness.demo</li>
                <li>AYUSH License: AYU-DEL-4011</li>
              </ul>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.82rem',
            opacity: 0.75,
          }}>
            <div>© 2026 Amrutam Pharmaceuticals Ltd. All rights reserved.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Crafted with <Heart size={14} color="#EF4444" fill="#EF4444" /> for Amrutam Healthcare
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
