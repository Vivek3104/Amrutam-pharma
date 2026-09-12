import React, { useState } from 'react';
import type { PharmaProduct } from '../types';
import { MOCK_PRODUCTS } from '../api/client';
import { useCart } from '../context/CartContext';
import { Star, ShoppingBag, ShieldCheck, Check, Search, IndianRupee, Sparkles, X, ArrowRight, Plus } from 'lucide-react';

export const PharmacyCatalog: React.FC = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<PharmaProduct | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Formulations' },
    { id: 'AYURVEDIC_MALT', label: 'Ayurvedic Malts' },
    { id: 'HERBAL_OIL', label: 'Clinical Oils & Serums' },
    { id: 'DIGESTIVE_CARE', label: 'Digestive & Immunity' },
    { id: 'SKIN_HAIR', label: 'Skin & Hair Restoratives' },
  ];

  const filteredProducts = MOCK_PRODUCTS.filter((prod) => {
    const matchesCategory = selectedCategory === 'ALL' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.keyIngredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleAddToCartClick = (product: PharmaProduct) => {
    addToCart(product, 1);
    setToastMessage(`Added "${product.name}" to your Cart!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderConfirmed(true);
  };

  return (
    <section className="container-responsive" style={{ padding: '40px 24px 60px 24px' }}>
      {/* Notification Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          background: 'var(--bg-navy-surface)',
          border: '1px solid var(--teal-primary)',
          color: '#FFF',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-glow)',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <Check size={18} color="var(--teal-glow)" />
          {toastMessage}
        </div>
      )}

      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span className="badge badge-teal" style={{ marginBottom: '10px' }}>
          <Sparkles size={12} /> Amrutam Pharmaceutical Formulations
        </span>
        <h2 style={{ fontSize: '2.2rem', color: '#FFF', marginBottom: '10px' }}>
          Classical Ayurvedic Medicines & Herbal Supplements
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', fontSize: '0.98rem' }}>
          100% GMP-certified formulations prepared using traditional decoctions (Kashayam) and pure herbs.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="glass-panel" style={{ padding: '16px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={20} color="var(--teal-primary)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
            <input
              type="text"
              placeholder="Search formulations by name, ingredient (e.g. Shatavari, Bhringraj), or health condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '48px', fontSize: '0.95rem' }}
            />
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`btn ${isSelected ? 'btn-teal' : 'btn-outline'}`}
                  style={{ fontSize: '0.82rem', padding: '6px 16px', borderRadius: 'var(--radius-full)' }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: '24px',
      }}>
        {filteredProducts.map((product) => (
          <div key={product.id} className="glass-panel glass-panel-hover" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Top GMP Badge */}
            <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 2 }}>
              <span className="badge badge-emerald">
                <ShieldCheck size={12} /> GMP Certified
              </span>
            </div>

            <div>
              {/* Product Image */}
              <div style={{
                width: '100%',
                height: '180px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                marginBottom: '16px',
                background: '#07111E',
                position: 'relative',
              }}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Rating & Form */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--teal-glow)', fontWeight: 600 }}>
                  {product.dosageForm}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--amber-gold)', fontSize: '0.85rem', fontWeight: 700 }}>
                  <Star size={14} fill="var(--amber-gold)" /> {product.rating} ({product.reviewsCount})
                </span>
              </div>

              {/* Name & Description */}
              <h3 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '6px' }}>
                {product.name}
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                marginBottom: '14px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.5em',
              }}>
                {product.description}
              </p>

              {/* Key Ingredients */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                {product.keyIngredients.map((ing, i) => (
                  <span key={i} style={{
                    fontSize: '0.7rem',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: 'var(--text-secondary)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Price & Action */}
            <div style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center' }}>
                    <IndianRupee size={16} color="var(--teal-glow)" /> {product.price}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                    ₹{product.originalPrice}
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--emerald-botanical)', fontWeight: 600 }}>In Stock • Direct Dispatch</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={() => handleAddToCartClick(product)}
                  className="btn btn-outline"
                  style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                >
                  <Plus size={14} /> Add to Cart
                </button>

                <button
                  onClick={() => {
                    setSelectedProductForOrder(product);
                    setOrderConfirmed(false);
                  }}
                  className="btn btn-teal"
                  style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                >
                  <ShoppingBag size={14} /> Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Buy Now Order Modal */}
      {selectedProductForOrder && (
        <div className="modal-overlay" onClick={() => setSelectedProductForOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <button
              onClick={() => setSelectedProductForOrder(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#AAA', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            {orderConfirmed ? (
              <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                <Check size={64} color="var(--emerald-botanical)" style={{ marginBottom: '16px' }} />
                <h2 style={{ fontSize: '1.6rem', color: '#FFF', marginBottom: '8px' }}>Order Placed Successfully!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
                  Your order for <strong style={{ color: 'var(--teal-glow)' }}>{selectedProductForOrder.name}</strong> (Qty: {orderQuantity}) has been processed. Track shipping in your portal.
                </p>
                <button onClick={() => setSelectedProductForOrder(null)} className="btn btn-teal" style={{ width: '100%' }}>
                  Done
                </button>
              </div>
            ) : (
              <div>
                <span className="badge badge-teal" style={{ marginBottom: '8px' }}>Amrutam Express Dispatch</span>
                <h2 style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: '4px' }}>
                  {selectedProductForOrder.name}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--teal-glow)', marginBottom: '20px' }}>
                  {selectedProductForOrder.dosageForm} — ₹{selectedProductForOrder.price}
                </p>

                <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Quantity</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                        className="btn btn-outline"
                        style={{ padding: '6px 14px' }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>{orderQuantity}</span>
                      <button
                        type="button"
                        onClick={() => setOrderQuantity(orderQuantity + 1)}
                        className="btn btn-outline"
                        style={{ padding: '6px 14px' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Shipping Address</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Enter full delivery address with pincode..."
                      className="input-field"
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Total Payable</span>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF' }}>
                        ₹{selectedProductForOrder.price * orderQuantity}
                      </div>
                    </div>

                    <button type="submit" className="btn btn-emerald" style={{ padding: '10px 24px' }}>
                      Confirm Order <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
