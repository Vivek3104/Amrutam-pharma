export interface StoreProduct {
  id: string;
  name: string;
  badge: string;
  bannerImage: string;
  overlayText?: string;
  subheadline?: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  slideId?: number;
  categoryTag: 'health' | 'hair' | 'skin' | 'lifestyle' | 'oils' | 'churnas';
  inStock: boolean;
  stockCount: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface StoreOrder {
  id: string;
  orderRef: string;
  customerPhone: string;
  phone?: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  deliveryAddress: string;
  address?: string;
  paymentMethod: 'UPI' | 'CARD' | 'COD';
  status: 'CONFIRMED' | 'PREPARING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt?: string;
}

export interface ConsultationCallback {
  id: string;
  name: string;
  phone: string;
  concern: string;
  status: 'NEW' | 'CONTACTED' | 'RESOLVED';
  createdAt: string;
}

export interface AppUser {
  id: string;
  phone: string;
  email?: string;
  role: 'CUSTOMER' | 'ADMIN';
  fullName: string;
  createdAt: string;
}

export const INITIAL_PRODUCTS: StoreProduct[] = [
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
    inStock: true,
    stockCount: 145,
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
    inStock: true,
    stockCount: 80,
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
    inStock: true,
    stockCount: 65,
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
    inStock: true,
    stockCount: 110,
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
    inStock: true,
    stockCount: 95,
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
    inStock: true,
    stockCount: 130,
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
    inStock: true,
    stockCount: 180,
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
    inStock: true,
    stockCount: 120,
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
    inStock: true,
    stockCount: 85,
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
    inStock: true,
    stockCount: 45,
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
    inStock: true,
    stockCount: 160,
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
    inStock: true,
    stockCount: 90,
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
    inStock: true,
    stockCount: 200,
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
    inStock: true,
    stockCount: 210,
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
    inStock: true,
    stockCount: 75,
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
    inStock: true,
    stockCount: 140,
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
    inStock: true,
    stockCount: 220,
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
    inStock: true,
    stockCount: 195,
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
    inStock: true,
    stockCount: 150,
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
    inStock: true,
    stockCount: 90,
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
    inStock: true,
    stockCount: 115,
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
    inStock: true,
    stockCount: 75,
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
    inStock: true,
    stockCount: 60,
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
    inStock: true,
    stockCount: 70,
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
    inStock: true,
    stockCount: 50,
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
    inStock: true,
    stockCount: 35,
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
    inStock: true,
    stockCount: 88,
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
    inStock: true,
    stockCount: 65,
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
    inStock: true,
    stockCount: 110,
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
    inStock: true,
    stockCount: 40,
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
    inStock: true,
    stockCount: 55,
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
    inStock: true,
    stockCount: 75,
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
    inStock: true,
    stockCount: 60,
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
    inStock: true,
    stockCount: 82,
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
    inStock: true,
    stockCount: 48,
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
    inStock: true,
    stockCount: 92,
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
    inStock: true,
    stockCount: 130,
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
    inStock: true,
    stockCount: 140,
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
    inStock: true,
    stockCount: 85,
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
    inStock: true,
    stockCount: 62,
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
    inStock: true,
    stockCount: 77,
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
    inStock: true,
    stockCount: 250,
  },
];

class StoreService {
  private products: StoreProduct[] = [...INITIAL_PRODUCTS];
  private orders: StoreOrder[] = [
    {
      id: 'ord-1001',
      orderRef: 'AMR-728192',
      customerPhone: '+91 9876543210',
      customerName: 'Ananya Sharma',
      items: [
        {
          productId: 'nari-sondarya-malt',
          name: 'Nari Sondarya Malt',
          price: 1250,
          quantity: 1,
          image: '/assets/products/nari_sondarya.jpg',
        },
      ],
      subtotal: 1250,
      shippingFee: 0,
      totalAmount: 1250,
      deliveryAddress: 'House 42, Green Park, New Delhi - 110016',
      paymentMethod: 'UPI',
      status: 'DISPATCHED',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'ord-1002',
      orderRef: 'AMR-819204',
      customerPhone: '+91 9811223344',
      customerName: 'Rohit Verma',
      items: [
        {
          productId: 'kumkumadi-oil',
          name: 'Amrutam Kumkumadi Oil',
          price: 3249,
          quantity: 1,
          image: '/assets/products/kumkumadi_oil.png',
        },
      ],
      subtotal: 3249,
      shippingFee: 0,
      totalAmount: 3249,
      deliveryAddress: 'Flat 102, Powai Heights, Mumbai - 400076',
      paymentMethod: 'CARD',
      status: 'PREPARING',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
  ];
  private callbacks: ConsultationCallback[] = [
    {
      id: 'cb-1',
      name: 'Sneha Patel',
      phone: '+91 98200 11223',
      concern: 'Hair Fall & Scalp Care',
      status: 'NEW',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'cb-2',
      name: 'Rajesh Nair',
      phone: '+91 97100 44556',
      concern: 'Digestion & Gut Agni',
      status: 'RESOLVED',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
  ];

  // Products
  getAllProducts(category?: string, search?: string): StoreProduct[] {
    let list = [...this.products];
    if (category && category !== 'shop-all' && category !== 'all') {
      list = list.filter((p) => p.categoryTag === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.overlayText && p.overlayText.toLowerCase().includes(q)));
    }
    return list;
  }

  getProductById(id: string): StoreProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  createProduct(product: Partial<StoreProduct>): StoreProduct {
    const newProd: StoreProduct = {
      id: product.id || 'prod-' + Date.now(),
      name: product.name || 'New Classical Formulation',
      badge: product.badge || 'NEW',
      bannerImage: product.bannerImage || '/assets/products/nari_sondarya.jpg',
      overlayText: product.overlayText || 'Classical Ayurvedic formulation',
      subheadline: product.subheadline || 'Prepared with authentic Vedic botanicals',
      rating: 5,
      reviewCount: 1,
      priceRange: `₹${product.minPrice || 999} - ₹${product.maxPrice || 1999}`,
      minPrice: product.minPrice || 999,
      maxPrice: product.maxPrice || 1999,
      categoryTag: product.categoryTag || 'health',
      inStock: product.inStock ?? true,
      stockCount: product.stockCount ?? 100,
    };
    this.products.unshift(newProd);
    return newProd;
  }

  updateProduct(id: string, updates: Partial<StoreProduct>): StoreProduct | null {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...updates };
    return this.products[idx];
  }

  deleteProduct(id: string): boolean {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    return true;
  }

  // Orders
  createOrder(data: Partial<StoreOrder> & { phone?: string; address?: string }): StoreOrder {
    const orderRef = 'AMR-' + Math.floor(100000 + Math.random() * 900000);
    const phoneVal = data.customerPhone || data.phone || '+91 98000 00000';
    const addressVal = data.deliveryAddress || data.address || 'Standard Shipping Address';
    const newOrder: StoreOrder = {
      id: 'ord-' + Date.now(),
      orderRef,
      customerPhone: phoneVal,
      phone: phoneVal,
      customerName: data.customerName || 'Amrutam Customer',
      items: (data.items || []).map((it: any) => ({
        productId: it.productId || it.id || 'prod-item',
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: it.image || it.bannerImage,
      })),
      subtotal: data.subtotal || data.totalAmount || 0,
      shippingFee: data.shippingFee || 0,
      totalAmount: data.totalAmount || (data.subtotal || 0) + (data.shippingFee || 0),
      deliveryAddress: addressVal,
      address: addressVal,
      paymentMethod: data.paymentMethod || 'UPI',
      status: data.status || 'CONFIRMED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  getAllOrders(): StoreOrder[] {
    return this.orders;
  }

  getOrderByIdOrRef(idOrRef: string): StoreOrder | undefined {
    return this.orders.find(
      (o) =>
        o.id.toLowerCase() === idOrRef.toLowerCase() ||
        o.orderRef.toLowerCase() === idOrRef.toLowerCase()
    );
  }

  getOrdersByPhone(phone: string): StoreOrder[] {
    const clean = phone.replace(/\D/g, '').slice(-10);
    return this.orders.filter((o) => {
      const p1 = (o.customerPhone || '').replace(/\D/g, '');
      const p2 = (o.phone || '').replace(/\D/g, '');
      return p1.includes(clean) || p2.includes(clean);
    });
  }

  updateOrderStatus(orderId: string, status: StoreOrder['status']): StoreOrder | null {
    const order = this.orders.find((o) => o.id === orderId || o.orderRef === orderId);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  }

  // Callbacks
  createCallback(data: { name: string; phone: string; concern: string }): ConsultationCallback {
    const cb: ConsultationCallback = {
      id: 'cb-' + Date.now(),
      name: data.name,
      phone: data.phone,
      concern: data.concern || 'General Wellness',
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };
    this.callbacks.unshift(cb);
    return cb;
  }

  getAllCallbacks(): ConsultationCallback[] {
    return this.callbacks;
  }

  updateCallbackStatus(id: string, status: ConsultationCallback['status']): ConsultationCallback | null {
    const cb = this.callbacks.find((c) => c.id === id);
    if (!cb) return null;
    cb.status = status;
    return cb;
  }

  // Admin Stats
  getAdminStats() {
    const totalRevenue = this.orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = this.orders.length;
    const totalProducts = this.products.length;
    const inStockCount = this.products.filter((p) => p.inStock).length;
    const pendingCallbacks = this.callbacks.filter((c) => c.status === 'NEW').length;

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      inStockCount,
      pendingCallbacks,
      recentOrders: this.orders.slice(0, 5),
    };
  }
}

export const storeService = new StoreService();
