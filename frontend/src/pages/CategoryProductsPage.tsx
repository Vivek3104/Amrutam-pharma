import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ShoppingBag,
  Star,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Search,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { apiClient } from '../api/client';

export interface CategoryProduct {
  id: string;
  name: string;
  badge: string;
  badgeColor?: string;
  bannerImage: string;
  overlayText?: string;
  subheadline?: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  slideId?: number; // Links to product details page if available
  categoryTag?: 'health' | 'hair' | 'skin' | 'lifestyle' | 'oils' | 'churnas';
}

export interface CategoryData {
  id: string;
  title: string;
  categoryGroup: string;
  navTabs: string[];
  products: CategoryProduct[];
}

// 42 Comprehensive, Authentic Amrutam Formulations (> 30 Products for Shop All)
export const ALL_AMRUTAM_PRODUCTS: CategoryProduct[] = [
  {
    id: 'nari-sondarya-malt',
    name: 'Nari Sondarya Malt',
    badge: '-12%',
    bannerImage: '/assets/products/nari_sondarya.jpg',
    overlayText: 'Ayurvedic Malt for Irregular Periods & Hormonal Balance',
    subheadline: 'Ashoka, Lodhra & Shatavari classical lehya',
    rating: 5,
    reviewCount: 2509,
    priceRange: '₹1,250 - ₹3,348',
    minPrice: 1250,
    maxPrice: 3348,
    slideId: 0,
    categoryTag: 'health',
  },
  {
    id: 'kumari-sondarya-malt',
    name: 'Kumari Sondarya Malt for Teenage Periods',
    badge: '-28%',
    bannerImage: '/assets/kumari_malt_spoon_banner.jpg',
    overlayText: 'Ayurvedic Malt for Teenage Cramps & Hormonal Mood Swings',
    subheadline: 'Gentle classical herbs for adolescent menstrual health',
    rating: 5,
    reviewCount: 840,
    priceRange: '₹1,250 - ₹3,191',
    minPrice: 1250,
    maxPrice: 3191,
    slideId: 1,
    categoryTag: 'health',
  },
  {
    id: 'nari-40-plus',
    name: 'Nari 40+ Malt',
    badge: '-28%',
    bannerImage: '/assets/nari_40_malt_banner.jpg',
    overlayText: 'Ayurvedic Malt for Menopause, Hot Flashes & Bone Vitality',
    subheadline: 'Classical rasayana for graceful transitions and deep sleep',
    rating: 5,
    reviewCount: 590,
    priceRange: '₹1,250 - ₹3,191',
    minPrice: 1250,
    maxPrice: 3191,
    categoryTag: 'health',
  },
  {
    id: 'b-feral-gold-malt',
    name: 'Amrutam B Feral Gold Malt',
    badge: '-15%',
    bannerImage: '/assets/products/b_feral_gold.png',
    overlayText: 'Ayurvedic Formula for Strength, Stamina & Male Vitality',
    subheadline: 'Safed Musli, Ashwagandha & Kaunch Beej energy tonic',
    rating: 5,
    reviewCount: 1420,
    priceRange: '₹1,499 - ₹3,599',
    minPrice: 1499,
    maxPrice: 3599,
    categoryTag: 'health',
  },
  {
    id: 'kuntal-hair-malt',
    name: 'Kuntal Care Hair Malt',
    badge: '-18%',
    bannerImage: '/assets/amrutam_hair_malt_1789275609062.jpg',
    overlayText: 'Herbal Nutrition for Hair Regrowth & Scalp Nourishment',
    subheadline: 'Internal nourishment with Bhringraj, Amla & Triphala',
    rating: 5,
    reviewCount: 1830,
    priceRange: '₹1,299 - ₹3,449',
    minPrice: 1299,
    maxPrice: 3449,
    slideId: 3,
    categoryTag: 'hair',
  },
  {
    id: 'bhringraj-hair-therapy-shampoo',
    name: 'Amrutam Bhringraj Hair Therapy 2-in-1 Shampoo & Conditioner',
    badge: '-20%',
    bannerImage: '/assets/products/bhringraj_therapy.jpg',
    overlayText: 'Rich in Bhringraj, Shikakai & Reetha for Soft Voluminous Hair',
    subheadline: 'Sulfate-free botanical cleanser and natural detangler',
    rating: 5,
    reviewCount: 1640,
    priceRange: '₹1,299 - ₹2,890',
    minPrice: 1299,
    maxPrice: 2890,
    categoryTag: 'hair',
  },
  {
    id: 'kuntal-care-herbal-shampoo',
    name: 'Amrutam Kuntal Care Herbal Shampoo',
    badge: '-15%',
    bannerImage: '/assets/products/kuntal_shampoo.jpg',
    overlayText: 'Mild Botanical Cleanser for Scalp Health & Breakage Control',
    subheadline: 'Infused with Neem, Shikakai & Hibiscus flower extracts',
    rating: 5,
    reviewCount: 980,
    priceRange: '₹599 - ₹1,490',
    minPrice: 599,
    maxPrice: 1490,
    categoryTag: 'hair',
  },
  {
    id: 'kuntal-care-hair-spa',
    name: 'Amrutam Kuntal Care Hair Spa | Do-It-Yourself Hair Treatment',
    badge: '-22%',
    bannerImage: '/assets/products/kuntal_hair_spa.jpg',
    overlayText: 'Triphala & Balchhad for Dry, Damaged Hair Restoration',
    subheadline: 'Intensive scalp revitalization and deep follicle conditioning',
    rating: 5,
    reviewCount: 1350,
    priceRange: '₹649 - ₹1,690',
    minPrice: 649,
    maxPrice: 1690,
    categoryTag: 'hair',
  },
  {
    id: 'hair-spa-deluxe-mask',
    name: 'Kuntal Care Ayurvedic Deep Conditioning Hair Spa Mask',
    badge: '-18%',
    bannerImage: '/assets/products/hair_spa_mask.jpg',
    overlayText: 'Nourishing Nectar with Neem & Camphor for Scalp Rejuvenation',
    subheadline: 'Weekly hair ritual for smoothing frizz and controlling split ends',
    rating: 5,
    reviewCount: 780,
    priceRange: '₹999 - ₹2,450',
    minPrice: 999,
    maxPrice: 2450,
    categoryTag: 'hair',
  },
  {
    id: 'kumkumadi-oil',
    name: 'Amrutam Kumkumadi Oil | Ayurvedic Recipe for Skin Radiance',
    badge: '-25%',
    bannerImage: '/assets/products/kumkumadi_oil.png',
    overlayText: 'Kashmiri Saffron & Red Sandalwood for Youthful Glow & Radiance',
    subheadline: 'Centuries-old night elixir for hyperpigmentation and fine lines',
    rating: 5,
    reviewCount: 3120,
    priceRange: '₹3,249 - ₹6,890',
    minPrice: 3249,
    maxPrice: 6890,
    categoryTag: 'skin',
  },
  {
    id: 'kayakey-body-oil',
    name: 'Amrutam Kayakey Body Oil | Ayurvedic Blend for Abhyanga Massage',
    badge: '-15%',
    bannerImage: '/assets/products/kayakey_oil.jpg',
    overlayText: 'Deep Tissue Relaxation & Blood Circulation Enhancement',
    subheadline: 'Medicated sesame oil infused with Bala, Ashwagandha & Camphor',
    rating: 5,
    reviewCount: 940,
    priceRange: '₹299 - ₹890',
    minPrice: 299,
    maxPrice: 890,
    categoryTag: 'lifestyle',
  },
  {
    id: 'nari-sondarya-oil',
    name: 'Amrutam Nari Sondarya Oil | Nourishing Feminine Therapy',
    badge: '-18%',
    bannerImage: '/assets/products/nari_sondarya_oil.jpg',
    overlayText: 'Ayurvedic Herbs for Skin Firmness, Tone & Youthfulness',
    subheadline: 'Herbal massage oil with Lodhra, Manjistha & Gambhari',
    rating: 5,
    reviewCount: 620,
    priceRange: '₹549 - ₹1,350',
    minPrice: 549,
    maxPrice: 1350,
    categoryTag: 'skin',
  },
  {
    id: 'amrutam-chawanprash',
    name: 'Amrutam Chawanprash | Ancient Ayurvedic Recipe',
    badge: '-20%',
    bannerImage: '/assets/products/chawanprash.jpg',
    overlayText: 'Rich in Raw Amla, Wild Honey & 40+ Classical Rejuvenators',
    subheadline: 'Immunity shield, respiratory vitality, and daily longevity',
    rating: 5,
    reviewCount: 2190,
    priceRange: '₹1,199 - ₹2,890',
    minPrice: 1199,
    maxPrice: 2890,
    categoryTag: 'health',
  },
  {
    id: 'dentkey-manjan',
    name: 'Dentkey Manjan | Ayurvedic Tooth & Gum Powder',
    badge: '-15%',
    bannerImage: '/assets/products/dentkey_manjan.jpg',
    overlayText: 'Bakul, Babool & Clove for Strong Teeth and Clean Enamel',
    subheadline: 'Traditional oral hygiene powder for bleeding gums and fresh breath',
    rating: 5,
    reviewCount: 680,
    priceRange: '₹537 - ₹1,150',
    minPrice: 537,
    maxPrice: 1150,
    categoryTag: 'lifestyle',
  },
  {
    id: 'amrutam-chandan',
    name: 'Amrutam Chandan Herbal Paste & Powder',
    badge: '-12%',
    bannerImage: '/assets/products/chandan_powder.png',
    overlayText: 'Pure Sandalwood for Meditative Calm and Skin Coolness',
    subheadline: 'Soothes Pitta redness, cools facial skin, and relieves heat stress',
    rating: 5,
    reviewCount: 490,
    priceRange: '₹715 - ₹1,490',
    minPrice: 715,
    maxPrice: 1490,
    categoryTag: 'skin',
  },
  {
    id: 'aloe-vera-gel',
    name: 'Amrutam Pure Aloe Vera Gel',
    badge: '-10%',
    bannerImage: '/assets/products/aloe_vera_gel.jpg',
    overlayText: 'Soothing Hydration for Sunburns, Dry Scalp and Natural Glow',
    subheadline: 'Cold-pressed aloe inner leaf fillet with zero added synthetic fragrance',
    rating: 5,
    reviewCount: 820,
    priceRange: '₹449 - ₹980',
    minPrice: 449,
    maxPrice: 980,
    categoryTag: 'skin',
  },
  {
    id: 'triphala-churna',
    name: 'Amrutam Triphala Churna | Ayurvedic Tridosha Balancer',
    badge: '-20%',
    bannerImage: '/assets/products/triphala_churna.jpg',
    overlayText: 'Haritaki, Bibhitaki & Amalaki for Gut Cleansing and Eye Health',
    subheadline: 'Classical digestion booster and gentle internal detoxifier',
    rating: 5,
    reviewCount: 1890,
    priceRange: '₹329 - ₹790',
    minPrice: 329,
    maxPrice: 790,
    categoryTag: 'churnas',
  },
  {
    id: 'ashwagandha-churna',
    name: 'Amrutam Ashwagandha Churna | Vitality & Stress Relief Booster',
    badge: '-18%',
    bannerImage: '/assets/products/ashwagandha_churna.jpg',
    overlayText: '100% Pure Withania Somnifera for Ojas & Sound Restorative Sleep',
    subheadline: 'Soothes nervous system exhaustion and builds athletic stamina',
    rating: 5,
    reviewCount: 1240,
    priceRange: '₹319 - ₹760',
    minPrice: 319,
    maxPrice: 760,
    categoryTag: 'churnas',
  },
  {
    id: 'amla-churna',
    name: 'Amrutam Amla Churna | Classical Vitamin C & Immunity Shield',
    badge: '-15%',
    bannerImage: '/assets/products/amla_churna.jpg',
    overlayText: 'Wild Emblica Officinalis for Digestion, Hair & Cellular Health',
    subheadline: 'Natural antioxidant powerhouse for radiant skin and sharp eyesight',
    rating: 5,
    reviewCount: 830,
    priceRange: '₹329 - ₹750',
    minPrice: 329,
    maxPrice: 750,
    categoryTag: 'churnas',
  },
  {
    id: 'brainkey-gold-malt',
    name: 'Amrutam Brainkey Gold Malt',
    badge: '-16%',
    bannerImage: '/assets/products/brainkey_gold.jpg',
    overlayText: 'Ayurvedic Memory, Mental Clarity & Concentration Tonic',
    subheadline: 'Shankhpushpi, Brahmi & Gotu Kola classical Medhya Rasayana',
    rating: 5,
    reviewCount: 970,
    priceRange: '₹1,399 - ₹3,299',
    minPrice: 1399,
    maxPrice: 3299,
    categoryTag: 'health',
  },
  {
    id: 'digestive-care-malt',
    name: 'Digestive Care Herbal Malt',
    badge: '-15%',
    bannerImage: '/assets/digestive_malt.jpg',
    overlayText: 'Herbal Formula for Bloating, Acidity & Gut Agni Optimization',
    subheadline: 'Classical carminative herbs that gently soothe hyperacidity',
    rating: 5,
    reviewCount: 1120,
    priceRange: '₹1,150 - ₹2,890',
    minPrice: 1150,
    maxPrice: 2890,
    slideId: 2,
    categoryTag: 'health',
  },
  {
    id: 'haritaki-gut-relief',
    name: 'Haritaki Gut Relief Formula',
    badge: '-18%',
    bannerImage: '/assets/products/triphala_churna.jpg',
    overlayText: 'Gentle Colon Cleanser & Chronic Constipation Relief',
    subheadline: 'Deep digestive balance and natural toxic ama elimination',
    rating: 5,
    reviewCount: 640,
    priceRange: '₹899 - ₹1,990',
    minPrice: 899,
    maxPrice: 1990,
    categoryTag: 'health',
  },
  {
    id: 'triphala-gut-agni',
    name: 'Triphala Gut Agni Elixir',
    badge: '-12%',
    bannerImage: '/assets/nari_malt_spoon_banner.jpg',
    overlayText: 'Metabolic Agni Stimulator & Morning Cleansing Tonic',
    subheadline: 'Harmonizes gut microbiome and enhances nutrient absorption',
    rating: 5,
    reviewCount: 510,
    priceRange: '₹799 - ₹1,750',
    minPrice: 799,
    maxPrice: 1750,
    categoryTag: 'health',
  },
  {
    id: 'shatavari-vitality',
    name: 'Shatavari Vitality Wellness Malt',
    badge: '-15%',
    bannerImage: '/assets/shatavari_malt.jpg',
    overlayText: 'Feminine Nourishment, Lactation Support & Hormonal Balance',
    subheadline: 'Queen of herbs for endocrine equilibrium and radiant vitality',
    rating: 5,
    reviewCount: 880,
    priceRange: '₹1,299 - ₹3,190',
    minPrice: 1299,
    maxPrice: 3190,
    slideId: 4,
    categoryTag: 'health',
  },
  {
    id: 'shilajit-power-nectar',
    name: 'Pure Himalayan Shilajit Power Nectar',
    badge: '-22%',
    bannerImage: '/assets/products/b_feral_gold.png',
    overlayText: 'Shilajit, Safed Musli & Gokshura for Unmatched Peak Energy',
    subheadline: 'High fulvic acid resin formulation for athletic recovery and vitality',
    rating: 5,
    reviewCount: 1670,
    priceRange: '₹1,899 - ₹4,450',
    minPrice: 1899,
    maxPrice: 4450,
    categoryTag: 'health',
  },
  {
    id: 'amrutam-gold-chyawanprash',
    name: 'Amrutam Gold Chyawanprash Supreme',
    badge: '-25%',
    bannerImage: '/assets/products/chawanprash.jpg',
    overlayText: 'Enriched with Swarna Bhasma, Kashmiri Saffron & Silver Foil',
    subheadline: 'Ultra-luxurious cellular rejuvenation for lifetime immunity',
    rating: 5,
    reviewCount: 790,
    priceRange: '₹1,999 - ₹4,990',
    minPrice: 1999,
    maxPrice: 4990,
    categoryTag: 'health',
  },
  {
    id: 'giloy-tulsi-defense',
    name: 'Giloy Tulsi Defense Elixir',
    badge: '-14%',
    bannerImage: '/assets/products/triphala_churna.jpg',
    overlayText: 'Potent Classical Shield against Seasonal Infections & Fever',
    subheadline: 'Guduchi and holy basil brew for immune white blood cells',
    rating: 5,
    reviewCount: 460,
    priceRange: '₹649 - ₹1,450',
    minPrice: 649,
    maxPrice: 1450,
    categoryTag: 'health',
  },
  {
    id: 'asthi-poshan-malt',
    name: 'Asthi Poshan Joint Care Malt',
    badge: '-16%',
    bannerImage: '/assets/nari_40_malt_banner.jpg',
    overlayText: 'Hadjod, Shallaki & Ashwagandha for Bone Strength & Joint Ease',
    subheadline: 'Promotes synovial fluid lubrication and strengthens cartilage',
    rating: 5,
    reviewCount: 920,
    priceRange: '₹1,249 - ₹2,990',
    minPrice: 1249,
    maxPrice: 2990,
    categoryTag: 'health',
  },
  {
    id: 'shallaki-joint-malt',
    name: 'Shallaki Joint Strength Oil & Lepa',
    badge: '-15%',
    bannerImage: '/assets/products/kayakey_oil.jpg',
    overlayText: 'Boswellia Serrata Deep Penetrating Joint Flexibility Oil',
    subheadline: 'Fast soothing relief for stiff knees, lower back, and joints',
    rating: 5,
    reviewCount: 540,
    priceRange: '₹599 - ₹1,390',
    minPrice: 599,
    maxPrice: 1390,
    categoryTag: 'lifestyle',
  },
  {
    id: 'lakshadi-strength-nectar',
    name: 'Lakshadi Bone & Tendon Strength Nectar',
    badge: '-12%',
    bannerImage: '/assets/digestive_malt.jpg',
    overlayText: 'Classical Formulation for Ligament Healing & Mobility',
    subheadline: 'Post-injury rehabilitation and connective tissue reinforcement',
    rating: 5,
    reviewCount: 380,
    priceRange: '₹999 - ₹2,250',
    minPrice: 999,
    maxPrice: 2250,
    categoryTag: 'health',
  },
  {
    id: 'netra-jyoti-malt',
    name: 'Netra Jyoti Eye Therapy Malt',
    badge: '-15%',
    bannerImage: '/assets/products/brainkey_gold.jpg',
    overlayText: 'Triphala Ghrita, Yashtimadhu & Saptamrit Lauha Vision Care',
    subheadline: 'Relieves screen eye strain, dry eyes, and blurred vision',
    rating: 5,
    reviewCount: 430,
    priceRange: '₹1,150 - ₹2,690',
    minPrice: 1150,
    maxPrice: 2690,
    categoryTag: 'health',
  },
  {
    id: 'yakrit-detox-malt',
    name: 'Yakrit Detox Liver Rejuvenator Malt',
    badge: '-18%',
    bannerImage: '/assets/products/nari_sondarya.jpg',
    overlayText: 'Kalmegh, Bhumi Amla & Kutki for Complete Hepatic Cleansing',
    subheadline: 'Eliminates sluggish liver toxins and optimizes metabolism',
    rating: 5,
    reviewCount: 890,
    priceRange: '₹1,299 - ₹2,990',
    minPrice: 1299,
    maxPrice: 2990,
    categoryTag: 'health',
  },
  {
    id: 'kalmegh-liver-tonic',
    name: 'Kalmegh Liver Tonic Elixir',
    badge: '-10%',
    bannerImage: '/assets/products/triphala_churna.jpg',
    overlayText: 'Pure Classical Bitter Decoction for Optimum Bile Secretion',
    subheadline: 'Supports healthy lipid breakdown and post-antibiotic recovery',
    rating: 5,
    reviewCount: 370,
    priceRange: '₹799 - ₹1,690',
    minPrice: 799,
    maxPrice: 1690,
    categoryTag: 'health',
  },
  {
    id: 'stress-relief-sleep-malt',
    name: 'Stress Relief & Deep Restorative Sleep Malt',
    badge: '-20%',
    bannerImage: '/assets/products/brainkey_gold.jpg',
    overlayText: 'Tagar, Jatamansi & Ashwagandha for Natural Calming Sleep',
    subheadline: 'Non-addictive herbal relaxation without morning grogginess',
    rating: 5,
    reviewCount: 1140,
    priceRange: '₹1,299 - ₹3,090',
    minPrice: 1299,
    maxPrice: 3090,
    categoryTag: 'health',
  },
  {
    id: 'shwas-kuthar-malt',
    name: 'Shwas Kuthar Respiratory Prana Malt',
    badge: '-15%',
    bannerImage: '/assets/digestive_malt.jpg',
    overlayText: 'Vasaka, Kantakari & Pippali for Clear Lungs & Easy Breathing',
    subheadline: 'Expels stubborn congestion and strengthens bronchial pathways',
    rating: 5,
    reviewCount: 580,
    priceRange: '₹1,199 - ₹2,790',
    minPrice: 1199,
    maxPrice: 2790,
    categoryTag: 'health',
  },
  {
    id: 'vasavaleha-cough-malt',
    name: 'Vasavaleha Classical Cough Malt',
    badge: '-12%',
    bannerImage: '/assets/products/chawanprash.jpg',
    overlayText: 'Herbal Cough Lehya for Dry, Chronic Cough & Throat Soothing',
    subheadline: 'Time-tested Ayurvedic formulation with wild honey and Vasaka',
    rating: 5,
    reviewCount: 420,
    priceRange: '₹849 - ₹1,890',
    minPrice: 849,
    maxPrice: 1890,
    categoryTag: 'health',
  },
  {
    id: 'danta-sondarya-malt',
    name: 'Danta Sondarya Gum Strengthening Oil',
    badge: '-10%',
    bannerImage: '/assets/products/dentkey_manjan.jpg',
    overlayText: 'Ayurvedic Sesame & Clove Oil for Daily Gandusha (Oil Pulling)',
    subheadline: 'Toughens enamel, pulls toxins, and strengthens loose gums',
    rating: 5,
    reviewCount: 310,
    priceRange: '₹499 - ₹1,190',
    minPrice: 499,
    maxPrice: 1190,
    categoryTag: 'lifestyle',
  },
  {
    id: 'kuntal-care-hair-oil',
    name: 'Amrutam Kuntal Care Herbal Hair Oil',
    badge: '-15%',
    bannerImage: '/assets/products/kayakey_oil.jpg',
    overlayText: 'Bhringraj, Triphala & Rosemary Herbal Follicle Nourisher',
    subheadline: 'Ancient kshirpak method oil that feeds deep hair roots',
    rating: 5,
    reviewCount: 1470,
    priceRange: '₹899 - ₹2,190',
    minPrice: 899,
    maxPrice: 2190,
    categoryTag: 'hair',
  },
  {
    id: 'kumari-skin-glow',
    name: 'Kumari Skin Glow Herbal Lepa',
    badge: '-18%',
    bannerImage: '/assets/products/chandan_powder.png',
    overlayText: 'Turmeric, Kashmiri Saffron & Sandalwood Herbal Face Pack',
    subheadline: 'Unclogs pores, gently removes tan, and reveals spotless glow',
    rating: 5,
    reviewCount: 650,
    priceRange: '₹699 - ₹1,590',
    minPrice: 699,
    maxPrice: 1590,
    categoryTag: 'skin',
  },
  {
    id: 'vridhi-radiance',
    name: 'Vridhi Radiance Kumkumadi Day Cream',
    badge: '-20%',
    bannerImage: '/assets/products/kumkumadi_oil.png',
    overlayText: 'Anti-Aging Saffron Day Moisturizer with Natural Sun Protection',
    subheadline: 'Enriched with lotus petals and saffron stigmas for radiant tone',
    rating: 5,
    reviewCount: 520,
    priceRange: '₹1,450 - ₹3,200',
    minPrice: 1450,
    maxPrice: 3200,
    categoryTag: 'skin',
  },
  {
    id: 'ashtagandha-formula',
    name: 'Ashtagandha Herbal Body Cleanser Ubtan',
    badge: '-15%',
    bannerImage: '/assets/products/chandan_powder.png',
    overlayText: '8 Sacred Vedic Herbs Exfoliating Bath Powder',
    subheadline: 'Replaces chemical soaps with holy fragrant Vedic botanical powder',
    rating: 5,
    reviewCount: 410,
    priceRange: '₹599 - ₹1,290',
    minPrice: 599,
    maxPrice: 1290,
    categoryTag: 'lifestyle',
  },
  {
    id: 'kuntal-shampoo-travel',
    name: 'Amrutam Kuntal Care Herbal Shampoo | Travel Pack',
    badge: '-10%',
    bannerImage: '/assets/products/kuntal_travel_shampoo.jpg',
    overlayText: 'On-the-go Ayurvedic Cleansing & Moisture Lock (50ml)',
    subheadline: 'TSA-friendly travel essential for smooth hair anywhere',
    rating: 5,
    reviewCount: 420,
    priceRange: '₹149 - ₹299',
    minPrice: 149,
    maxPrice: 299,
    categoryTag: 'hair',
  },
];

export const CATEGORIES_MAP: Record<string, CategoryData> = {
  'shop-all': {
    id: 'shop-all',
    title: 'Shop All - Complete Ayurvedic Formulations',
    categoryGroup: 'All Formulations',
    navTabs: ['Shop All', 'Health Care', 'Hair Care', 'Skin Care', 'Everyday Essentials', 'Oils & Churnas'],
    products: ALL_AMRUTAM_PRODUCTS,
  },
  health: {
    id: 'health',
    title: 'Health Care - Classical Ayurvedic Malts & Lehyas',
    categoryGroup: 'Health Care',
    navTabs: ['All Health', 'Malts & Tonics', 'Vitality & Men', 'Women Health', 'Gut & Digestion', 'Immunity Shield'],
    products: ALL_AMRUTAM_PRODUCTS.filter((p) => p.categoryTag === 'health'),
  },
  hair: {
    id: 'hair',
    title: 'Hair Care - Fall Control, Shampoos & Scalp Therapy',
    categoryGroup: 'Hair Care',
    navTabs: ['Shop All', 'Hair Oils', 'Hair Malts', 'Hair Shampoos', 'Hair Spas'],
    products: ALL_AMRUTAM_PRODUCTS.filter((p) => p.categoryTag === 'hair'),
  },
  skin: {
    id: 'skin',
    title: 'Skin Care - Kumkumadi Radiance, Pastes & Glow Formulations',
    categoryGroup: 'Skin Care',
    navTabs: ['Shop All', 'Face Oils', 'Herbal Pastes', 'Skin Malts', 'Body Glow'],
    products: ALL_AMRUTAM_PRODUCTS.filter((p) => p.categoryTag === 'skin'),
  },
  lifestyle: {
    id: 'lifestyle',
    title: 'Everyday Lifestyle - Daily Ayurvedic Living & Rituals',
    categoryGroup: 'Daily Wellness',
    navTabs: ['Shop All', 'Everyday Essentials', 'Oral Care', 'Stress & Mind', 'Churna & Rasayana'],
    products: ALL_AMRUTAM_PRODUCTS.filter((p) => p.categoryTag === 'lifestyle' || p.categoryTag === 'churnas'),
  },
  period: {
    id: 'period',
    title: 'Health Care - Menstrual Health & Hormones',
    categoryGroup: 'Health Care',
    navTabs: ['Shop All', 'Hair Care', 'Skin Care', 'Health Care', 'Period Wellness Guide'],
    products: ALL_AMRUTAM_PRODUCTS.filter((p) => p.id.includes('nari') || p.id.includes('kumari')),
  },
  malts: {
    id: 'malts',
    title: 'Health Care - Classical Ayurvedic Malts & Lehyas',
    categoryGroup: 'Health Care',
    navTabs: ['Shop All', 'Women Health', 'Vitality & Energy', 'Immunity & Prana', 'Malt Guide'],
    products: ALL_AMRUTAM_PRODUCTS.filter((p) => p.name.toLowerCase().includes('malt')),
  },
  shampoos: {
    id: 'shampoos',
    title: 'Hair Care - Herbal Shampoos & Cleansers',
    categoryGroup: 'Hair Care',
    navTabs: ['Shop All', 'Bhringraj Care', 'Anti-Dandruff', 'Travel Sizes', 'Hair Cleansing Guide'],
    products: ALL_AMRUTAM_PRODUCTS.filter((p) => p.name.toLowerCase().includes('shampoo')),
  },
  'hair-spas': {
    id: 'hair-spas',
    title: 'Hair Care - Ayurvedic Hair Spas & Intensive Masks',
    categoryGroup: 'Hair Care',
    navTabs: ['Shop All', 'Hair Spas', 'Deep Nourishing Masks', 'Scalp Detox', 'Ayurvedic Hair Ritual'],
    products: ALL_AMRUTAM_PRODUCTS.filter((p) => p.name.toLowerCase().includes('spa') || p.name.toLowerCase().includes('mask')),
  },
  everyday: {
    id: 'everyday',
    title: 'Everyday Essentials - Daily Ayurvedic Living & Wellness',
    categoryGroup: 'Daily Wellness',
    navTabs: ['Shop All', 'Chawanprash', 'Oral Care', 'Cooling Pastes', 'Daily Ritual Guide'],
    products: ALL_AMRUTAM_PRODUCTS.filter((p) => p.categoryTag === 'lifestyle'),
  },
  oils: {
    id: 'oils',
    title: 'Pure Herbal Oils - Hair, Face & Body Massage Therapy',
    categoryGroup: 'Oil Therapy',
    navTabs: ['Shop All', 'Kumkumadi Radiance', 'Body Massage', 'Keshya Hair Oils', 'Abhyanga Guide'],
    products: ALL_AMRUTAM_PRODUCTS.filter((p) => p.name.toLowerCase().includes('oil')),
  },
  herbs: {
    id: 'herbs',
    title: 'Classical Herbs & Churna - Pure Ayurvedic Rasayanas',
    categoryGroup: 'Herbal Powders',
    navTabs: ['Shop All', 'Triphala', 'Ashwagandha', 'Amla Rasayana', 'Ayurvedic Kwath Preparation'],
    products: ALL_AMRUTAM_PRODUCTS.filter((p) => p.name.toLowerCase().includes('churna')),
  },
};

interface CategoryProductsPageProps {
  categoryId: string;
  onBackToHome: () => void;
  onOpenProductDetails?: (slideId?: number) => void;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
  onOpenPhone?: () => void;
}

export const CategoryProductsPage: React.FC<CategoryProductsPageProps> = ({
  categoryId,
  onBackToHome,
  onOpenProductDetails,
  onOpenCart,
  onOpenSearch,
  onOpenPhone,
}) => {
  const categoryData = CATEGORIES_MAP[categoryId] || CATEGORIES_MAP['shop-all'];
  const [activeTab, setActiveTab] = useState<string>(categoryData.navTabs[0]);
  const [sortBy, setSortBy] = useState<'best' | 'price-low' | 'price-high' | 'rating'>('best');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const { addToCart, cartCount, openCart } = useCart();
  const [serverProducts, setServerProducts] = useState<CategoryProduct[]>([]);

  useEffect(() => {
    apiClient
      .get('/products')
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data)) {
          const customProds = res.data.data
            .filter((sp: any) => sp.id.startsWith('prod-'))
            .map((sp: any) => ({
              id: sp.id,
              name: sp.name,
              badge: sp.badge || 'NEW',
              bannerImage: sp.bannerImage || '/assets/products/nari_sondarya.jpg',
              rating: sp.rating || 4.8,
              reviewCount: sp.reviewCount || 32,
              priceRange: `₹${sp.minPrice} - ₹${sp.originalPrice}`,
              minPrice: sp.minPrice,
              maxPrice: sp.originalPrice,
              inStock: sp.inStock !== false,
              categoryTag: sp.categoryTag || 'health',
            }));
          setServerProducts(customProds);
        }
      })
      .catch(() => {});
  }, []);

  const allAvailableProducts = [...serverProducts, ...categoryData.products];

  // Dynamic filtering based on active subcategory tab
  const filteredProducts = allAvailableProducts.filter((prod) => {
    if (!activeTab || activeTab === 'Shop All' || activeTab === 'All' || activeTab === 'All Health') {
      return true;
    }
    const tabLower = activeTab.toLowerCase();
    if (tabLower.includes('hair') || tabLower.includes('shampoo') || tabLower.includes('spa')) {
      return prod.categoryTag === 'hair' || prod.name.toLowerCase().includes('hair') || prod.name.toLowerCase().includes('bhringraj') || prod.name.toLowerCase().includes('kuntal');
    }
    if (tabLower.includes('skin') || tabLower.includes('face') || tabLower.includes('glow') || tabLower.includes('lepa')) {
      return prod.categoryTag === 'skin' || prod.name.toLowerCase().includes('skin') || prod.name.toLowerCase().includes('kumkumadi') || prod.name.toLowerCase().includes('radiance') || prod.name.toLowerCase().includes('chandan');
    }
    if (tabLower.includes('health') || tabLower.includes('malt') || tabLower.includes('vitality') || tabLower.includes('women') || tabLower.includes('gut') || tabLower.includes('immunity')) {
      return prod.categoryTag === 'health' || prod.name.toLowerCase().includes('malt') || prod.name.toLowerCase().includes('chyawanprash') || prod.name.toLowerCase().includes('nari') || prod.name.toLowerCase().includes('gut');
    }
    if (tabLower.includes('everyday') || tabLower.includes('oral') || tabLower.includes('living')) {
      return prod.categoryTag === 'lifestyle' || prod.name.toLowerCase().includes('chawanprash') || prod.name.toLowerCase().includes('dentkey') || prod.name.toLowerCase().includes('kayakey') || prod.name.toLowerCase().includes('aloe');
    }
    if (tabLower.includes('oil') || tabLower.includes('churna') || tabLower.includes('rasayana')) {
      return prod.categoryTag === 'churnas' || prod.name.toLowerCase().includes('oil') || prod.name.toLowerCase().includes('churna');
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.minPrice - b.minPrice;
    if (sortBy === 'price-high') return b.maxPrice - a.maxPrice;
    if (sortBy === 'rating') return b.reviewCount - a.reviewCount;
    return 0; // default best selling
  });

  const handleAddToCart = (e: React.MouseEvent, product: CategoryProduct) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      category: 'AYURVEDIC_MALT',
      dosageForm: 'Classical Formulation',
      price: product.minPrice,
      originalPrice: product.maxPrice,
      rating: product.rating,
      reviewsCount: product.reviewCount,
      description: product.overlayText || product.subheadline || product.name,
      keyIngredients: ['Pure Himalayan Botanicals', 'Organic Wild Honey', 'Natural Extracts'],
      imageUrl: product.bannerImage,
      inStock: true,
      gmpCertified: true,
    });
    setAddedToast(`Added ${product.name} to Cart`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF5EE', color: '#273B30', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Toast Notification */}
      {addedToast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: '#1E4332',
          color: '#FFFFFF',
          padding: '12px 22px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '14px',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease',
        }}>
          <CheckCircle2 size={18} color="#4ADE80" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header
        style={{
          borderBottom: '1px solid #ECE3D6',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FAF5EE',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <button
          onClick={onBackToHome}
          style={{
            background: '#FFFFFF',
            border: '1px solid #DFD3C3',
            borderRadius: '9999px',
            padding: '8px 18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#214232',
            fontWeight: 600,
            fontSize: '13.5px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#F0E8DC')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <span
          onClick={onBackToHome}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
            fontWeight: 800,
            letterSpacing: '0.24em',
            color: '#2C5740',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          AMRUTAM
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {onOpenPhone && (
            <button
              onClick={onOpenPhone}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#2C5740',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <PhoneCall size={16} />
              <span className="hidden-mobile">+91 98000 00000</span>
            </button>
          )}

          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C5740', display: 'flex', alignItems: 'center' }}
              title="Search Formulations"
            >
              <Search size={20} />
            </button>
          )}

          <div
            onClick={() => onOpenCart ? onOpenCart() : openCart()}
            style={{
              position: 'relative',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#2C5740',
              padding: '6px',
            }}
            title="Open Cart"
          >
            <ShoppingBag size={22} />
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-4px',
                background: '#2C5740',
                color: '#FFF',
                fontSize: '11px',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {cartCount}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(28px, 4vw, 48px) 20px clamp(48px, 6vw, 84px)' }}>
        
        {/* Category Header with Live Count */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#E8EFEA',
            color: '#255838',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginBottom: '10px',
            textTransform: 'uppercase',
          }}>
            <Sparkles size={13} /> {categoryData.categoryGroup} • {sortedProducts.length} Formulations Available
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.7rem, 3vw, 2.5rem)',
              fontWeight: 700,
              color: '#1E432F',
              margin: '0 0 10px 0',
              letterSpacing: '-0.01em',
            }}
          >
            {categoryData.title}
          </h1>
          <p style={{ margin: 0, fontSize: '0.94rem', color: '#5C7063', maxWidth: '640px', marginInline: 'auto', lineHeight: 1.5 }}>
            Formulated according to authentic Ayurvedic Charaka Samhita guidelines. Tested for purity and clinical potency.
          </p>
        </div>

        {/* Sub-navigation Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(12px, 2.2vw, 28px)',
            flexWrap: 'wrap',
            marginBottom: '32px',
            fontSize: '14px',
          }}
        >
          {categoryData.navTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '6px 2px',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: activeTab === tab ? '#1E432F' : '#6A7D72',
                fontWeight: activeTab === tab ? 700 : 500,
                borderBottom: activeTab === tab ? '2.5px solid #1E432F' : '2.5px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sort & Count Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
            paddingBottom: '14px',
            borderBottom: '1px solid #E6DCD0',
          }}
        >
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#5B6F62' }}>
            Showing <strong>{sortedProducts.length}</strong> classical formulations
          </span>

          <div
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              border: '1px solid #D5C9B8',
              borderRadius: '9999px',
              padding: '6px 16px',
              background: '#FFFFFF',
            }}
          >
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                appearance: 'none',
                border: 'none',
                background: 'transparent',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#2A4435',
                paddingRight: '22px',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="best">Best selling</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown size={15} style={{ position: 'absolute', right: '12px', pointerEvents: 'none', color: '#4B6354' }} />
          </div>
        </div>

        {/* Product Grid (3 Columns, Exact Amrutam aesthetic: Rounded cards, badge, rating, red price, forest green Add to Cart) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'clamp(24px, 3.5vw, 40px)',
          }}
        >
          {sortedProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onOpenProductDetails?.(prod.slideId)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: prod.slideId !== undefined ? 'pointer' : 'default',
                transition: 'transform 0.25s ease',
              }}
              onMouseEnter={(e) => {
                if (prod.slideId !== undefined) e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Product Card Image Container */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#EBE2D8',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  marginBottom: '16px',
                }}
              >
                <img
                  src={prod.bannerImage}
                  alt={prod.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />

                {/* Discount Badge on Top Left */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: '#FF4D26',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    boxShadow: '0 2px 8px rgba(255, 77, 38, 0.4)',
                  }}
                >
                  {prod.badge}
                </div>
              </div>

              {/* Product Title */}
              <h3
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1F3728',
                  margin: '0 0 6px 0',
                  lineHeight: 1.35,
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {prod.name}
              </h3>

              {/* Stars & Review Count */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', gap: '2px', color: '#F59E0B' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#F59E0B" />
                  ))}
                </div>
                <span
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: '#1F3728',
                    marginLeft: '4px',
                  }}
                >
                  {prod.reviewCount} reviews
                </span>
              </div>

              {/* Price Range in Bright Red */}
              <div
                style={{
                  color: '#EF4444',
                  fontSize: '15.5px',
                  fontWeight: 700,
                  marginBottom: '16px',
                  letterSpacing: '0.01em',
                }}
              >
                {prod.priceRange}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={(e) => handleAddToCart(e, prod)}
                style={{
                  width: '100%',
                  maxWidth: '280px',
                  backgroundColor: '#2D5B41',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(45, 91, 65, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1E4330';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2D5B41';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </button>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default CategoryProductsPage;
