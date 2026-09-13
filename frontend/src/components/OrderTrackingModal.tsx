import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Truck,
  CheckCircle2,
  Package,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  PhoneCall,
} from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderRef?: string;
}

export interface TrackedOrder {
  id: string;
  orderRef: string;
  customerPhone: string;
  phone?: string;
  customerName?: string;
  items: Array<{
    productId?: string;
    id?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
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

const STEPS = [
  {
    key: 'CONFIRMED',
    title: 'Order Confirmed',
    desc: 'Order verified & sent to Ayurvedic pharmacy',
    icon: CheckCircle2,
  },
  {
    key: 'PREPARING',
    title: 'Preparing Formulation',
    desc: 'Classical herbs blended & quality inspected',
    icon: Package,
  },
  {
    key: 'DISPATCHED',
    title: 'Dispatched & In Transit',
    desc: 'Sealed with tamper-proof packaging & shipped',
    icon: Truck,
  },
  {
    key: 'DELIVERED',
    title: 'Delivered',
    desc: 'Safely arrived at customer doorstep',
    icon: ShieldCheck,
  },
];

const getStepIndex = (status: string): number => {
  switch (status) {
    case 'CONFIRMED':
      return 0;
    case 'PREPARING':
      return 1;
    case 'DISPATCHED':
      return 2;
    case 'DELIVERED':
      return 3;
    default:
      return 0;
  }
};

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderRef,
}) => {
  const { user } = useAuth();
  const [searchInput, setSearchInput] = useState(initialOrderRef || '');
  const [ordersList, setOrdersList] = useState<TrackedOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<TrackedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch orders for customer
  const fetchCustomerOrders = async (refOrPhone?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const queryParam = refOrPhone?.trim() || searchInput.trim() || user?.phone || '';
      
      let res;
      if (queryParam.toUpperCase().startsWith('AMR-') || queryParam.startsWith('ord-')) {
        // Specific order query
        res = await apiClient.get(`/orders/${queryParam}`);
        if (res.data?.data) {
          const singleOrder = res.data.data;
          setOrdersList([singleOrder]);
          setSelectedOrder(singleOrder);
          setIsLoading(false);
          return;
        }
      }

      // Query by phone or get my orders
      const phoneClean = (queryParam || user?.phone || '').replace(/\D/g, '').slice(-10);
      res = await apiClient.get('/orders/my', {
        params: phoneClean ? { phone: phoneClean } : {},
      });

      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setOrdersList(res.data.data);
        // If initialOrderRef provided, select that one; else default to first
        if (initialOrderRef) {
          const found = res.data.data.find(
            (o: TrackedOrder) =>
              o.orderRef?.toLowerCase() === initialOrderRef.toLowerCase() ||
              o.id?.toLowerCase() === initialOrderRef.toLowerCase()
          );
          setSelectedOrder(found || res.data.data[0]);
        } else {
          setSelectedOrder(res.data.data[0]);
        }
      } else {
        // Try fallback to all orders for demo if phone query returned empty
        const allRes = await apiClient.get('/orders');
        if (allRes.data?.data && allRes.data.data.length > 0) {
          setOrdersList(allRes.data.data);
          setSelectedOrder(allRes.data.data[0]);
        } else {
          setErrorMsg('No orders found matching your search. Please check your order reference or mobile number.');
        }
      }
    } catch (err: any) {
      console.error('Tracking fetch error:', err);
      setErrorMsg('Unable to retrieve tracking details right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Poll / refresh single selected order
  const refreshCurrentOrder = async () => {
    if (!selectedOrder) return;
    setIsRefreshing(true);
    try {
      const res = await apiClient.get(`/orders/${selectedOrder.id || selectedOrder.orderRef}`);
      if (res.data?.data) {
        const updated = res.data.data;
        setSelectedOrder(updated);
        setOrdersList((prev) =>
          prev.map((o) => (o.id === updated.id ? updated : o))
        );
      }
    } catch (e) {
      console.log('Polling refresh completed');
    } finally {
      setIsRefreshing(false);
    }
  };

  // On open or initialOrderRef change
  useEffect(() => {
    if (isOpen) {
      if (initialOrderRef) {
        setSearchInput(initialOrderRef);
        fetchCustomerOrders(initialOrderRef);
      } else {
        fetchCustomerOrders();
      }
    }
  }, [isOpen, initialOrderRef]);

  // Auto poll every 4 seconds when open to immediately show Admin updates
  useEffect(() => {
    let timer: any;
    if (isOpen && selectedOrder) {
      timer = setInterval(() => {
        refreshCurrentOrder();
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isOpen, selectedOrder?.id, selectedOrder?.status]);

  if (!isOpen) return null;

  const currentStepIdx = selectedOrder ? getStepIndex(selectedOrder.status) : 0;
  const progressPercent = Math.round(((currentStepIdx) / (STEPS.length - 1)) * 100);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(16, 28, 19, 0.72)',
        backdropFilter: 'blur(7px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: '#FAF5EE',
          borderRadius: '24px',
          boxShadow: '0 25px 65px rgba(0,0,0,0.3)',
          border: '1px solid #DFD5C6',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: '#273C2E',
          position: 'relative',
        }}
      >
        {/* Header with Forest Green Luxury Header */}
        <div
          style={{
            backgroundColor: '#1A3E29',
            padding: '22px 28px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <Truck size={22} color="#FDE68A" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.25rem',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                  }}
                >
                  Live Ayurvedic Order Tracking
                </h3>
                <span
                  style={{
                    backgroundColor: '#DEF7EC',
                    color: '#03543F',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#03543F' }} />
                  Live Sync
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', opacity: 0.85 }}>
                Real-time updates directly synchronized with Amrutam Pharmacy dispatch
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {selectedOrder && (
              <button
                onClick={refreshCurrentOrder}
                disabled={isRefreshing}
                title="Refresh Status Now"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '7px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <RefreshCw size={13} className={isRefreshing ? 'spin' : ''} />
                <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Search / Lookup Bar */}
        <div
          style={{
            padding: '14px 28px',
            backgroundColor: '#F3EDE2',
            borderBottom: '1px solid #E5DBD0',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1.5px solid #D8CCBE',
              padding: '0 12px',
            }}
          >
            <Search size={16} color="#5B6F62" />
            <input
              type="text"
              placeholder="Search by Order ID (AMR-...) or Mobile Number"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchCustomerOrders(searchInput)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                padding: '10px 10px',
                fontSize: '0.88rem',
                backgroundColor: 'transparent',
                color: '#1A3E29',
                fontWeight: 600,
              }}
            />
          </div>

          <button
            onClick={() => fetchCustomerOrders(searchInput)}
            disabled={isLoading}
            style={{
              backgroundColor: '#3A643B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {isLoading ? 'Searching...' : 'Track'}
          </button>
        </div>

        {/* Order Selector Pills (if multiple orders exist) */}
        {ordersList.length > 1 && (
          <div
            style={{
              padding: '10px 28px',
              backgroundColor: '#FAF5EE',
              borderBottom: '1px solid #E5DBD0',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
            }}
          >
            {ordersList.map((ord) => {
              const isSelected = selectedOrder?.id === ord.id;
              return (
                <button
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  style={{
                    border: 'none',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#1A3E29' : '#EAE1D5',
                    color: isSelected ? '#FFFFFF' : '#475C4F',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>#{ord.orderRef || ord.id.slice(-6).toUpperCase()}</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      opacity: 0.85,
                      textTransform: 'capitalize',
                    }}
                  >
                    ({ord.status.toLowerCase()})
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {isLoading && ordersList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <RefreshCw size={32} className="spin" color="#3A643B" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: '0.9rem', color: '#5B6F62' }}>Loading order fulfillment status...</p>
            </div>
          ) : errorMsg ? (
            <div
              style={{
                backgroundColor: '#FFF8EB',
                border: '1px dashed #D99B26',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                color: '#925C05',
              }}
            >
              <Package size={36} style={{ margin: '0 auto 10px' }} />
              <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: '#78350F' }}>Order Not Found</h4>
              <p style={{ margin: 0, fontSize: '0.84rem' }}>{errorMsg}</p>
            </div>
          ) : selectedOrder ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* Order Quick Details Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '18px 20px',
                  border: '1px solid #E5DBD0',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1A3E29' }}>
                      Order #{selectedOrder.orderRef || selectedOrder.id.slice(-8).toUpperCase()}
                    </span>
                    <span
                      style={{
                        backgroundColor:
                          selectedOrder.status === 'DELIVERED'
                            ? '#DEF7EC'
                            : selectedOrder.status === 'DISPATCHED'
                            ? '#E1EFFE'
                            : selectedOrder.status === 'PREPARING'
                            ? '#FEF3C7'
                            : '#EFF7F1',
                        color:
                          selectedOrder.status === 'DELIVERED'
                            ? '#03543F'
                            : selectedOrder.status === 'DISPATCHED'
                            ? '#1E429F'
                            : selectedOrder.status === 'PREPARING'
                            ? '#92400E'
                            : '#15803D',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                      }}
                    >
                      {selectedOrder.status === 'CONFIRMED' && '✓ Confirmed by Admin'}
                      {selectedOrder.status === 'PREPARING' && '⚙ In Preparation'}
                      {selectedOrder.status === 'DISPATCHED' && '🚚 In Transit'}
                      {selectedOrder.status === 'DELIVERED' && '✓ Delivered'}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.78rem', color: '#708377', display: 'block', marginTop: '4px' }}>
                    Placed: {new Date(selectedOrder.createdAt).toLocaleString()}
                    {selectedOrder.updatedAt && (
                      <span style={{ marginLeft: '8px', color: '#15803D', fontWeight: 600 }}>
                        • Last updated: {new Date(selectedOrder.updatedAt).toLocaleTimeString()}
                      </span>
                    )}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A3E29' }}>
                    ₹{selectedOrder.totalAmount}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#708377' }}>
                    Payment: {selectedOrder.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Progress Bar & Stepper */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '24px 20px',
                  border: '1px solid #E5DBD0',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 700, color: '#1E3F2B' }}>
                    Fulfillment Journey
                  </h4>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#15803D' }}>
                    {progressPercent}% Completed
                  </span>
                </div>

                {/* Progress bar background line */}
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#EAE2D5',
                    borderRadius: '4px',
                    marginBottom: '28px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${progressPercent}%`,
                      backgroundColor: '#3A643B',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>

                {/* 4 Steps Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {STEPS.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div
                        key={step.key}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '16px',
                          opacity: isDone ? 1 : 0.45,
                        }}
                      >
                        {/* Step Circle Indicator */}
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: isCurrent
                              ? '#1A3E29'
                              : isDone
                              ? '#DEF7EC'
                              : '#F0E8DC',
                            border: `2px solid ${isCurrent ? '#FCD34D' : isDone ? '#03543F' : '#D8CCBE'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isCurrent ? '#FDE68A' : isDone ? '#03543F' : '#88988D',
                            flexShrink: 0,
                            position: 'relative',
                          }}
                        >
                          <StepIcon size={18} />
                          {isCurrent && (
                            <span
                              style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                border: '2px solid #3A643B',
                                animation: 'pulse 1.8s infinite',
                              }}
                            />
                          )}
                        </div>

                        {/* Step Description */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '0.92rem', color: isDone ? '#1A3E29' : '#6A7D72' }}>
                              {step.title}
                            </strong>
                            {isCurrent && (
                              <span
                                style={{
                                  backgroundColor: '#FEF3C7',
                                  color: '#92400E',
                                  padding: '1px 7px',
                                  borderRadius: '8px',
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                }}
                              >
                                Current Status
                              </span>
                            )}
                          </div>
                          <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#6A7D72' }}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Address & Items Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid #E5DBD0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <MapPin size={16} color="#3A643B" />
                    <strong style={{ fontSize: '0.86rem', color: '#1E3F2B' }}>
                      Delivery Recipient & Destination
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#5B6F62', lineHeight: '1.4' }}>
                    <strong>{selectedOrder.customerName || 'Customer'}</strong> ({selectedOrder.phone || selectedOrder.customerPhone})
                    <br />
                    {selectedOrder.deliveryAddress || selectedOrder.address || 'Standard Delivery Address'}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #F0E8DC', paddingTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <ShoppingBag size={16} color="#3A643B" />
                    <strong style={{ fontSize: '0.86rem', color: '#1E3F2B' }}>
                      Formulations in this Package
                    </strong>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedOrder.items?.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: '#FAF5EE',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          fontSize: '0.82rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#1A3E29', fontWeight: 700 }}>{item.name}</span>
                          <span style={{ color: '#708377' }}>× {item.quantity}</span>
                        </div>
                        <span style={{ fontWeight: 700, color: '#1A3E29' }}>
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Support Contact Pill */}
              <div
                style={{
                  backgroundColor: '#EFF7F1',
                  border: '1px solid #C4DCCB',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E5834' }}>
                  <PhoneCall size={16} />
                  <span>Have questions regarding your dispatch? Our Ayurvedic care team is here.</span>
                </div>
                <span style={{ fontWeight: 800, color: '#15803D' }}>
                  +91 98000 00000
                </span>
              </div>

            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
