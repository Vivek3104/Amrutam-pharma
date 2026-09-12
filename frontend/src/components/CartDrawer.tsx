import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, Plus, Minus, IndianRupee, ShieldCheck, ArrowRight, CheckCircle2, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, closeCart, cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<'CART' | 'CHECKOUT' | 'SUCCESS'>('CART');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD'>('UPI');
  const [orderRef, setOrderRef] = useState('');

  if (!isCartOpen) return null;

  const shippingFee = cartTotal > 500 || cartTotal === 0 ? 0 : 49;
  const grandTotal = cartTotal + shippingFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = 'AMP-' + Math.floor(100000 + Math.random() * 900000);
    setOrderRef(generatedRef);
    setCheckoutStep('SUCCESS');
    clearCart();
  };

  const handleReset = () => {
    setCheckoutStep('CART');
    closeCart();
  };

  return (
    <div className="modal-overlay" onClick={closeCart} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100vh',
          borderRadius: 0,
          background: '#071526',
          borderLeft: '1px solid var(--border-card)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.8)',
          animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-navy-main)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="var(--teal-glow)" />
            <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>
              {checkoutStep === 'CART' && `Your Cart (${cartItems.length})`}
              {checkoutStep === 'CHECKOUT' && 'Express Shipping Checkout'}
              {checkoutStep === 'SUCCESS' && 'Order Confirmation'}
            </h3>
          </div>
          <button onClick={closeCart} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {checkoutStep === 'CART' && (
            <>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <ShoppingBag size={56} color="var(--teal-primary)" style={{ opacity: 0.4, marginBottom: '16px' }} />
                  <h4 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '8px' }}>Your Cart is Empty</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                    Explore certified Ayurvedic malts, clinical oils, and herbal remedies in our catalog.
                  </p>
                  <button onClick={closeCart} className="btn btn-teal">
                    Explore Pharmacy
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {cartItems.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '12px',
                        display: 'flex',
                        gap: '12px',
                      }}
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                      />

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <h5 style={{ fontSize: '0.92rem', color: '#FFF', fontWeight: 600 }}>{product.name}</h5>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                            title="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <p style={{ fontSize: '0.75rem', color: 'var(--teal-glow)', marginBottom: '8px' }}>
                          {product.dosageForm}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          {/* Quantity Controls */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '2px 6px' }}>
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: '2px 4px' }}
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ fontSize: '0.85rem', color: '#FFF', fontWeight: 700 }}>{quantity}</span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: '2px 4px' }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center' }}>
                            <IndianRupee size={14} color="var(--teal-glow)" /> {product.price * quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {checkoutStep === 'CHECKOUT' && (
            <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Delivery Pincode & Full Address
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="House/Flat No., Street, City, State, Pincode..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Select Payment Method
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'UPI', label: 'UPI / GPay / PhonePe (Instant Dispatch)' },
                    { id: 'CARD', label: 'Credit / Debit Card (NetBanking)' },
                    { id: 'COD', label: 'Cash on Delivery' },
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: paymentMethod === m.id ? 'var(--teal-light)' : 'rgba(0,0,0,0.2)',
                        border: paymentMethod === m.id ? '1px solid var(--teal-primary)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        color: '#FFF',
                        fontSize: '0.88rem',
                        fontWeight: paymentMethod === m.id ? 600 : 400,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{m.label}</span>
                      {paymentMethod === m.id && <CheckCircle2 size={18} color="var(--teal-glow)" />}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--emerald-botanical)', display: 'flex', gap: '8px' }}>
                <Truck size={18} />
                <span>Estimated Delivery: 2-3 Business Days via Amrutam Express Direct.</span>
              </div>
            </form>
          )}

          {checkoutStep === 'SUCCESS' && (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <CheckCircle2 size={64} color="var(--emerald-botanical)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.6rem', color: '#FFF', marginBottom: '8px' }}>Order Placed!</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Thank you for ordering with Amrutam Pharmaceuticals.
              </p>

              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: 'var(--radius-sm)', textAlign: 'left', marginBottom: '24px' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Order Reference Number</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--teal-glow)' }}>{orderRef}</p>
                <div style={{ marginTop: '10px', fontSize: '0.82rem', color: '#FFF' }}>
                  <span>Status: </span>
                  <span className="badge badge-emerald">CONFIRMED & DISPATCHING</span>
                </div>
              </div>

              <button onClick={handleReset} className="btn btn-teal" style={{ width: '100%' }}>
                Done
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer Summary & Actions */}
        {checkoutStep !== 'SUCCESS' && cartItems.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-navy-main)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span style={{ color: '#FFF' }}>₹{cartTotal}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Shipping Fee</span>
                <span style={{ color: shippingFee === 0 ? 'var(--emerald-botanical)' : '#FFF' }}>
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FFF', fontWeight: 800, fontSize: '1.15rem', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--teal-glow)' }}>₹{grandTotal}</span>
              </div>
            </div>

            {checkoutStep === 'CART' && (
              <button
                onClick={() => setCheckoutStep('CHECKOUT')}
                className="btn btn-teal"
                style={{ width: '100%', padding: '12px' }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            )}

            {checkoutStep === 'CHECKOUT' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('CART')}
                  className="btn btn-outline"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleCheckoutSubmit}
                  className="btn btn-emerald"
                >
                  <ShieldCheck size={18} /> Place Order
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
