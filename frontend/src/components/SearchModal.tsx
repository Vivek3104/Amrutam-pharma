import React, { useState, useMemo } from 'react';
import { Search, X, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export interface SearchItem {
  id: string;
  name: string;
  category: string;
  price: number;
  priceRange: string;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  slideId?: number;
  categoryId?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (slideId?: number, categoryId?: string) => void;
  products: SearchItem[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  products,
}) => {
  const [query, setQuery] = useState('');
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const quickTags = ['Nari Sondarya', 'Bhringraj', 'Kumkumadi', 'Chawanprash', 'Hair Spa', 'Ashwagandha', 'Triphala', 'Digestion'];

  const filtered = useMemo(() => {
    if (!query.trim()) return products.slice(0, 8);
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query, products]);

  if (!isOpen) return null;

  const handleAddToCart = (e: React.MouseEvent, p: SearchItem) => {
    e.stopPropagation();
    addToCart({
      id: p.id,
      name: p.name,
      category: 'AYURVEDIC_MALT',
      dosageForm: 'Classical Formulation',
      price: p.price,
      originalPrice: p.price * 1.25,
      rating: p.rating,
      reviewsCount: p.reviewCount,
      description: p.name,
      keyIngredients: ['Classical Herbs', 'Natural Nectar'],
      imageUrl: p.image,
      inStock: true,
      gmpCertified: true,
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 30, 20, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '60px 16px 20px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#FAF5EE',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          border: '1px solid #E3D9CD',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '82vh',
        }}
      >
        {/* Search Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E5DCD0',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Search size={22} color="#3A643B" />
          <input
            autoFocus
            type="text"
            placeholder="Search 40+ Ayurvedic formulations, herbs, or concerns..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '1.05rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: '#264B35',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: '#F0E8DD',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#4B5E53',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: '#F5ECE0',
            borderBottom: '1px solid #E7DDD0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#667C6E', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} color="#3A643B" /> Popular:
          </span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              style={{
                background: query.toLowerCase() === tag.toLowerCase() ? '#3A643B' : '#FFFFFF',
                color: query.toLowerCase() === tag.toLowerCase() ? '#FFFFFF' : '#3A643B',
                border: '1px solid #D5C8B8',
                borderRadius: '999px',
                padding: '4px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6C7E72', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            {query.trim() ? `Matching Formulations (${filtered.length})` : 'Recommended For You'}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: '#7E8B83' }}>
              <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>No formulation found for "{query}"</p>
              <p style={{ fontSize: '0.86rem' }}>Try searching for generic terms like "hair", "malt", "skin", "oil", or "digestion".</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectProduct?.(item.slideId, item.categoryId || 'shop-all');
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAE0D3',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.borderColor = '#3A643B';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(58,100,59,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#EAE0D3';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        backgroundColor: '#EBE2D8',
                      }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.94rem', fontWeight: 600, color: '#1F3B2B' }}>
                          {item.name}
                        </span>
                        {item.badge && (
                          <span style={{
                            backgroundColor: '#FF4D26',
                            color: '#FFF',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#6A7D72' }}>
                        <span>{item.category}</span>
                        <span>•</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#E59B12' }}>
                          <Star size={12} fill="#E59B12" />
                          <span style={{ fontWeight: 700 }}>{item.rating}</span>
                          <span style={{ color: '#8A9990' }}>({item.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#DC2626' }}>
                      ₹{item.price.toLocaleString()}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(e, item)}
                      style={{
                        backgroundColor: addedId === item.id ? '#15803D' : '#3A643B',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '7px 14px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {addedId === item.id ? 'Added ✓' : 'Add'}
                    </button>
                    <ArrowRight size={16} color="#7F9486" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
