import React, { useState } from 'react';
import { Hero, type HeroSlide, HERO_SLIDES } from './components/Hero';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CategoryProductsPage, ALL_AMRUTAM_PRODUCTS } from './pages/CategoryProductsPage';
import { SpotlightProductDetailsPage } from './pages/SpotlightProductDetailsPage';
import { BlogDetailsPage } from './pages/BlogDetailsPage';
import { DoctorDirectoryPage } from './pages/DoctorDirectoryPage';
import { Dashboard } from './pages/Dashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { TrustCompliance } from './components/TrustCompliance';
import { HealingConcernsSection, type HealingConcern } from './components/HealingConcernsSection';
import { EverythingAmrutamOffersSection } from './components/EverythingAmrutamOffersSection';
import { PressAndSpotlightSection } from './components/PressAndSpotlightSection';
import { RediscoveringSelfSection } from './components/RediscoveringSelfSection';
import { Footer } from './components/Footer';
import { FloatingSupportWidget } from './components/FloatingSupportWidget';

// Cart & Auth Contexts & Modals
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { SearchModal, type SearchItem } from './components/SearchModal';
import { FlashDealsModal } from './components/FlashDealsModal';
import { CommunityModal } from './components/CommunityModal';
import { AboutUsModal } from './components/AboutUsModal';
import { PhoneSupportModal } from './components/PhoneSupportModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ArrowLeft } from 'lucide-react';

type AppView =
  | 'hero'
  | 'doctors'
  | 'patient-dashboard'
  | 'doctor-dashboard'
  | 'compliance'
  | 'product-details'
  | 'category-products'
  | 'spotlight-product'
  | 'blog-details';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('hero');
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string>('shop-all');
  const [selectedSpotlightId, setSelectedSpotlightId] = useState<string>('healthy-soft-hair');
  const [selectedBlogId, setSelectedBlogId] = useState<string>('episode-1');
  const [activeHeroIndex, setActiveHeroIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFlashDealsOpen, setIsFlashDealsOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isPhoneSupportOpen, setIsPhoneSupportOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [trackedOrderRef, setTrackedOrderRef] = useState<string | undefined>(undefined);

  const handleOpenTracking = (orderRefOrPhone?: string) => {
    setTrackedOrderRef(orderRefOrPhone);
    setIsOrderTrackingOpen(true);
  };

  const { openCart } = useCart();
  const { openAuthModal } = useAuth();

  const handleKnowMore = (slide: HeroSlide) => {
    setSelectedSlide(slide);
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectConcern = (concern: HealingConcern) => {
    setSelectedCategory(concern.id);
    if (concern.slideIndex !== undefined) {
      setActiveHeroIndex(concern.slideIndex);
    }
    setCurrentView('category-products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOffersCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('category-products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryTab = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('category-products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSpotlightProduct = (spotlightId: string) => {
    setSelectedSpotlightId(spotlightId);
    setCurrentView('spotlight-product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBlog = (blogId: string) => {
    setSelectedBlogId(blogId);
    setCurrentView('blog-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBlog = () => {
    if (currentView !== 'hero') {
      setCurrentView('hero');
      setTimeout(() => {
        const blogElem = document.getElementById('rediscovering-self-section');
        if (blogElem) {
          blogElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const blogElem = document.getElementById('rediscovering-self-section');
      if (blogElem) {
        blogElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenProductDetails = (slideId?: number) => {
    if (slideId !== undefined) {
      const slide = HERO_SLIDES.find((s) => s.id === slideId) || HERO_SLIDES[0];
      setSelectedSlide(slide);
      setCurrentView('product-details');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const searchItems: SearchItem[] = ALL_AMRUTAM_PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.categoryTag ? p.categoryTag.toUpperCase() : 'HERBAL REMEDY',
    price: p.minPrice,
    priceRange: p.priceRange,
    rating: p.rating,
    reviewCount: p.reviewCount,
    image: p.bannerImage,
    badge: p.badge,
    slideId: p.slideId,
    categoryId: p.categoryTag || 'shop-all',
  }));

  return (
    <div style={{ minHeight: '100vh', background: '#FAF5EE' }}>
      {/* 1. HERO HOME VIEW */}
      {currentView === 'hero' && (
        <>
          <Hero
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSpecialty={selectedSpecialty}
            setSelectedSpecialty={setSelectedSpecialty}
            onSelectCategory={handleSelectCategoryTab}
            onOpenAuth={() => openAuthModal('CUSTOMER')}
            onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
            onOpenTracking={() => handleOpenTracking()}
            onOpenCart={openCart}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenZap={() => setIsFlashDealsOpen(true)}
            onOpenPhone={() => setIsPhoneSupportOpen(true)}
            onOpenCommunity={() => setIsCommunityOpen(true)}
            onOpenBlog={handleOpenBlog}
            onOpenAboutUs={() => setIsAboutUsOpen(true)}
            onKnowMoreClick={handleKnowMore}
            activeSlideIndex={activeHeroIndex}
            onSlideChange={setActiveHeroIndex}
            onNavigateTab={(tab) => {
              setCurrentView(tab as AppView);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
          <HealingConcernsSection onSelectConcern={handleSelectConcern} />
          <EverythingAmrutamOffersSection onSelectCategory={handleSelectOffersCategory} />
          <PressAndSpotlightSection
            onSelectCategory={handleSelectOffersCategory}
            onSelectSpotlightProduct={handleSelectSpotlightProduct}
          />
          <RediscoveringSelfSection onSelectBlog={handleSelectBlog} />
        </>
      )}

      {/* 2. TELEMEDICINE: DOCTOR DIRECTORY & CLINICAL BOOKING */}
      {currentView === 'doctors' && (
        <DoctorDirectoryPage
          onBackToHome={handleBackToHome}
          onBookingSuccess={() => {
            setCurrentView('patient-dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* 3. TELEMEDICINE: PATIENT DASHBOARD & CONSULTATIONS */}
      {currentView === 'patient-dashboard' && (
        <Dashboard
          onBackToHome={handleBackToHome}
          onNavigateToDoctors={() => {
            setCurrentView('doctors');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* 4. TELEMEDICINE: DOCTOR CLINICAL PORTAL */}
      {currentView === 'doctor-dashboard' && (
        <DoctorDashboard onBackToHome={handleBackToHome} />
      )}

      {/* 5. TELEMEDICINE: TRUST & COMPLIANCE */}
      {currentView === 'compliance' && (
        <div style={{ minHeight: '80vh', background: '#0B192C', padding: '40px 24px' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto 30px auto' }}>
            <button
              onClick={handleBackToHome}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#FFF',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <ArrowLeft size={16} /> Back to Amrutam Home
            </button>
          </div>
          <TrustCompliance />
        </div>
      )}

      {/* 6. BLOG DETAILS */}
      {currentView === 'blog-details' && (
        <BlogDetailsPage
          blogId={selectedBlogId}
          onBackToHome={handleBackToHome}
          onSelectBlog={handleSelectBlog}
        />
      )}

      {/* 7. SPOTLIGHT PRODUCT DETAILS */}
      {currentView === 'spotlight-product' && (
        <SpotlightProductDetailsPage
          spotlightId={selectedSpotlightId}
          onBackToHome={handleBackToHome}
        />
      )}

      {/* 8. CATEGORY PRODUCTS */}
      {currentView === 'category-products' && (
        <CategoryProductsPage
          categoryId={selectedCategory}
          onBackToHome={handleBackToHome}
          onOpenProductDetails={handleOpenProductDetails}
          onOpenCart={openCart}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenPhone={() => setIsPhoneSupportOpen(true)}
        />
      )}

      {/* 9. PRODUCT DETAILS */}
      {currentView === 'product-details' && (
        <ProductDetailsPage
          slide={selectedSlide}
          onBackToHome={handleBackToHome}
        />
      )}

      {/* Amrutam Footer at the last */}
      <Footer />

      {/* Floating Need Help + Scroll-to-Top Widget */}
      <FloatingSupportWidget />

      {/* Global Modals & Drawers */}
      <CartDrawer onOpenTracking={handleOpenTracking} />
      <AuthModal
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onOpenTracking={handleOpenTracking}
        onNavigateToDoctorDashboard={() => {
          setCurrentView('doctor-dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToPatientDashboard={() => {
          setCurrentView('patient-dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />
      <OrderTrackingModal
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
        initialOrderRef={trackedOrderRef}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={searchItems}
        onSelectProduct={(slideId, categoryId) => {
          if (slideId !== undefined) {
            handleOpenProductDetails(slideId);
          } else if (categoryId) {
            handleSelectCategoryTab(categoryId);
          }
        }}
      />
      <FlashDealsModal
        isOpen={isFlashDealsOpen}
        onClose={() => setIsFlashDealsOpen(false)}
        onShopCategory={handleSelectCategoryTab}
      />
      <CommunityModal
        isOpen={isCommunityOpen}
        onClose={() => setIsCommunityOpen(false)}
      />
      <AboutUsModal
        isOpen={isAboutUsOpen}
        onClose={() => setIsAboutUsOpen(false)}
        onExploreProducts={() => handleSelectCategoryTab('shop-all')}
      />
      <PhoneSupportModal
        isOpen={isPhoneSupportOpen}
        onClose={() => setIsPhoneSupportOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
