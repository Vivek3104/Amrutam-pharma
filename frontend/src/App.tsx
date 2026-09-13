import React, { useState } from 'react';
import { Hero, type HeroSlide, HERO_SLIDES } from './components/Hero';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CategoryProductsPage, ALL_AMRUTAM_PRODUCTS } from './pages/CategoryProductsPage';
import { SpotlightProductDetailsPage } from './pages/SpotlightProductDetailsPage';
import { BlogDetailsPage } from './pages/BlogDetailsPage';
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

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'hero' | 'product-details' | 'category-products' | 'spotlight-product' | 'blog-details'>('hero');
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

      {currentView === 'blog-details' && (
        <BlogDetailsPage
          blogId={selectedBlogId}
          onBackToHome={handleBackToHome}
          onSelectBlog={handleSelectBlog}
        />
      )}

      {currentView === 'spotlight-product' && (
        <SpotlightProductDetailsPage
          spotlightId={selectedSpotlightId}
          onBackToHome={handleBackToHome}
        />
      )}

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
