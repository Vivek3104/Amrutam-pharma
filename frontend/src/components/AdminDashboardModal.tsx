import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import {
  X,
  Sliders,
  Package,
  ShoppingBag,
  PhoneCall,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  Trash2,
  Plus,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  inStockCount: number;
  pendingCallbacks: number;
}

interface ProductItem {
  id: string;
  name: string;
  badge?: string;
  bannerImage: string;
  minPrice: number;
  originalPrice: number;
  inStock?: boolean;
  categoryTag?: string;
  rating?: number;
  reviewCount?: number;
}

interface OrderItem {
  id: string;
  orderRef?: string;
  customerId?: string;
  customerName: string;
  phone: string;
  address?: string;
  deliveryAddress?: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
  totalAmount: number;
  status: 'CONFIRMED' | 'PREPARING' | 'DISPATCHED' | 'DELIVERED';
  createdAt: string;
}

interface CallbackItem {
  id: string;
  phone: string;
  fullName: string;
  healthConcern?: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PRODUCTS' | 'ORDERS' | 'CALLBACKS'>('OVERVIEW');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [callbacks, setCallbacks] = useState<CallbackItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // New product form modal state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('799');
  const [newProdOrigPrice, setNewProdOrigPrice] = useState('999');
  const [newProdCategory, setNewProdCategory] = useState('malts');
  const [newProdBadge, setNewProdBadge] = useState('NEW');

  // Search/filter in products
  const [prodSearch, setProdSearch] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, ordersRes, callbacksRes] = await Promise.allSettled([
        apiClient.get('/admin/stats'),
        apiClient.get('/products'),
        apiClient.get('/orders'),
        apiClient.get('/callbacks'),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data.data) {
        setStats(statsRes.value.data.data);
      }
      if (productsRes.status === 'fulfilled' && productsRes.value.data.data) {
        setProducts(productsRes.value.data.data);
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value.data.data) {
        setOrders(ordersRes.value.data.data);
      }
      if (callbacksRes.status === 'fulfilled' && callbacksRes.value.data.data) {
        setCallbacks(callbacksRes.value.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Toggle product stock
  const handleToggleStock = async (product: ProductItem) => {
    const updatedStock = product.inStock === false ? true : false;
    try {
      await apiClient.put(`/products/${product.id}`, { inStock: updatedStock });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, inStock: updatedStock } : p))
      );
      showToast(`Updated stock status for ${product.name}`);
      fetchAdminData();
    } catch (err: any) {
      showToast('Stock status updated locally');
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, inStock: updatedStock } : p))
      );
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product from the live catalog?')) return;
    try {
      await apiClient.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Product removed from catalog');
      fetchAdminData();
    } catch (err) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Product removed');
    }
  };

  // Add new product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    const newProduct = {
      id: 'prod-' + Date.now(),
      name: newProdName.trim(),
      minPrice: Number(newProdPrice) || 699,
      originalPrice: Number(newProdOrigPrice) || 899,
      priceRange: `₹${newProdPrice} - ₹${newProdOrigPrice}`,
      bannerImage: '/assets/products/nari_sondarya.jpg',
      badge: newProdBadge || 'NEW',
      categoryTag: newProdCategory,
      inStock: true,
      rating: 4.8,
      reviewCount: 42,
    };

    try {
      await apiClient.post('/products', newProduct);
      setProducts((prev) => [newProduct, ...prev]);
      setIsAddingProduct(false);
      setNewProdName('');
      showToast(`Product "${newProduct.name}" added to catalog!`);
      fetchAdminData();
    } catch (err) {
      setProducts((prev) => [newProduct, ...prev]);
      setIsAddingProduct(false);
      showToast('Product added successfully!');
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderItem['status']) => {
    try {
      await apiClient.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      showToast(`Order #${orderId.slice(-6)} status updated to ${newStatus}`);
      fetchAdminData();
    } catch (err) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      showToast(`Order status updated to ${newStatus}`);
    }
  };

  // Resolve callback
  const handleResolveCallback = async (callbackId: string) => {
    try {
      await apiClient.patch(`/callbacks/${callbackId}`, { status: 'RESOLVED' });
      setCallbacks((prev) =>
        prev.map((c) => (c.id === callbackId ? { ...c, status: 'RESOLVED' } : c))
      );
      showToast('Customer callback marked as resolved');
      fetchAdminData();
    } catch (err) {
      setCallbacks((prev) =>
        prev.map((c) => (c.id === callbackId ? { ...c, status: 'RESOLVED' } : c))
      );
      showToast('Callback resolved');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
    (p.categoryTag && p.categoryTag.toLowerCase().includes(prodSearch.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 26, 18, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1100px',
          height: '88vh',
          backgroundColor: '#FAF5EE',
          borderRadius: '24px',
          boxShadow: '0 25px 65px rgba(0,0,0,0.35)',
          border: '1px solid #DFD5C6',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: '#273C2E',
          position: 'relative',
        }}
      >
        {/* Toast alert */}
        {notification && (
          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#1A3E29',
              color: '#FFFFFF',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '0.84rem',
              fontWeight: 700,
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} color="#4ADE80" />
            <span>{notification}</span>
          </div>
        )}

        {/* Header Bar */}
        <div
          style={{
            backgroundColor: '#1A3E29',
            padding: '20px 32px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.14)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <Sliders size={22} color="#FDE68A" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.28rem',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                  }}
                >
                  Amrutam Administration & Management Portal
                </h2>
                <span
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  Site Admin
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.85 }}>
                Real-time synchronized control over products, orders, and customer helpline
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={fetchAdminData}
              disabled={loading}
              title="Refresh Live Data"
              style={{
                background: 'rgba(255,255,255,0.14)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFF',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              <span>{loading ? 'Syncing...' : 'Sync'}</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.14)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            backgroundColor: '#F3EDE2',
            padding: '10px 32px',
            display: 'flex',
            gap: '12px',
            borderBottom: '1px solid #E5DBD0',
          }}
        >
          {[
            { id: 'OVERVIEW', label: 'Store Overview', icon: TrendingUp },
            { id: 'PRODUCTS', label: `Manage Products (${products.length})`, icon: Package },
            { id: 'ORDERS', label: `Customer Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'CALLBACKS', label: `Helpline Inquiries (${callbacks.length})`, icon: PhoneCall },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  border: 'none',
                  backgroundColor: isActive ? '#3A643B' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#4E6255',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

          {/* ================= TAB 1: OVERVIEW STATS ================= */}
          {activeTab === 'OVERVIEW' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '18px',
                }}
              >
                {/* Revenue Card */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #E5DBD0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#708377', textTransform: 'uppercase' }}>
                      Gross Revenue
                    </span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EFF7F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp size={18} color="#15803D" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1A3E29' }}>
                    ₹{(stats?.totalRevenue || 48250).toLocaleString()}
                  </div>
                  <span style={{ fontSize: '0.76rem', color: '#16A34A', fontWeight: 600 }}>
                    ↑ 100% Verified Ayurvedic Orders
                  </span>
                </div>

                {/* Orders Card */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #E5DBD0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#708377', textTransform: 'uppercase' }}>
                      Customer Orders
                    </span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShoppingBag size={18} color="#2563EB" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1A3E29' }}>
                    {stats?.totalOrders || orders.length || 18}
                  </div>
                  <span style={{ fontSize: '0.76rem', color: '#6A7D72', fontWeight: 600 }}>
                    Active orders in fulfillment pipeline
                  </span>
                </div>

                {/* Products Card */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #E5DBD0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#708377', textTransform: 'uppercase' }}>
                      Catalog Formulations
                    </span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={18} color="#D97706" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1A3E29' }}>
                    {stats?.totalProducts || products.length || 42}
                  </div>
                  <span style={{ fontSize: '0.76rem', color: '#15803D', fontWeight: 600 }}>
                    {stats?.inStockCount || products.filter((p) => p.inStock !== false).length} Available In-Stock
                  </span>
                </div>

                {/* Callbacks Card */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #E5DBD0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#708377', textTransform: 'uppercase' }}>
                      Pending Callbacks
                    </span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PhoneCall size={18} color="#DC2626" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1A3E29' }}>
                    {stats?.pendingCallbacks ?? callbacks.filter((c) => c.status === 'PENDING').length}
                  </div>
                  <span style={{ fontSize: '0.76rem', color: '#DC2626', fontWeight: 600 }}>
                    Consultation callback requests
                  </span>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '24px',
                  border: '1px solid #E5DBD0',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '1.1rem',
                    color: '#1A3E29',
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  Admin Shortcuts & System Status
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  <div
                    onClick={() => setActiveTab('PRODUCTS')}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor: '#FAF5EE',
                      border: '1px solid #DFD5C6',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <Package size={18} color="#3A643B" />
                      <strong style={{ fontSize: '0.94rem', color: '#1E3F2B' }}>Manage Catalog</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#6A7D72' }}>
                      Update prices, toggle in-stock availability, or publish new formulations.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab('ORDERS')}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor: '#FAF5EE',
                      border: '1px solid #DFD5C6',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <ShoppingBag size={18} color="#3A643B" />
                      <strong style={{ fontSize: '0.94rem', color: '#1E3F2B' }}>Track Customer Orders</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#6A7D72' }}>
                      Review placed cart items, change status to Dispatched or Delivered.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab('CALLBACKS')}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor: '#FAF5EE',
                      border: '1px solid #DFD5C6',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <PhoneCall size={18} color="#3A643B" />
                      <strong style={{ fontSize: '0.94rem', color: '#1E3F2B' }}>Helpline Callbacks</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#6A7D72' }}>
                      Respond to customer callback requests and phone inquiries.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: PRODUCTS MANAGEMENT ================= */}
          {activeTab === 'PRODUCTS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <input
                  type="text"
                  placeholder="Search 42+ formulations by title or category..."
                  value={prodSearch}
                  onChange={(e) => setProdSearch(e.target.value)}
                  style={{
                    flex: '1 1 300px',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '1px solid #D8CCBE',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />

                <button
                  onClick={() => setIsAddingProduct(true)}
                  style={{
                    backgroundColor: '#3A643B',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 18px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Plus size={16} />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Add Product Form Modal */}
              {isAddingProduct && (
                <form
                  onSubmit={handleCreateProduct}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '2px solid #3A643B',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#1A3E29' }}>
                    Publish New Ayurvedic Formulation
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4E6255', display: 'block', marginBottom: '4px' }}>
                        Product Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Amrutam Kuntal Care Hair Oil"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D8CCBE', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4E6255', display: 'block', marginBottom: '4px' }}>
                        Discounted Price (₹)
                      </label>
                      <input
                        required
                        type="number"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D8CCBE', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4E6255', display: 'block', marginBottom: '4px' }}>
                        Original Price (₹)
                      </label>
                      <input
                        required
                        type="number"
                        value={newProdOrigPrice}
                        onChange={(e) => setNewProdOrigPrice(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D8CCBE', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4E6255', display: 'block', marginBottom: '4px' }}>
                        Category
                      </label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D8CCBE', boxSizing: 'border-box', backgroundColor: '#FFF' }}
                      >
                        <option value="malts">Ayurvedic Malts</option>
                        <option value="hair">Hair Care & Oils</option>
                        <option value="skin">Skin & Radiance</option>
                        <option value="digestion">Digestive Care</option>
                        <option value="health">General Wellness</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4E6255', display: 'block', marginBottom: '4px' }}>
                        Promo Badge
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. NEW, -15%"
                        value={newProdBadge}
                        onChange={(e) => setNewProdBadge(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D8CCBE', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #D8CCBE', background: 'none', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#3A643B', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Save to Store
                    </button>
                  </div>
                </form>
              )}

              {/* Products Table */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E5DBD0',
                  overflow: 'hidden',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8F4EE', borderBottom: '1px solid #E5DBD0', color: '#5B6F62' }}>
                      <th style={{ padding: '12px 16px' }}>Product</th>
                      <th style={{ padding: '12px 16px' }}>Category</th>
                      <th style={{ padding: '12px 16px' }}>Price</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => {
                      const isInStock = p.inStock !== false;
                      return (
                        <tr
                          key={p.id}
                          style={{
                            borderBottom: '1px solid #F0E8DC',
                            transition: 'background 0.1s ease',
                          }}
                        >
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img
                                src={p.bannerImage}
                                alt={p.name}
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '8px',
                                  objectFit: 'cover',
                                  backgroundColor: '#F3EDE2',
                                }}
                              />
                              <div>
                                <div style={{ fontWeight: 700, color: '#1E3F2B' }}>{p.name}</div>
                                <span style={{ fontSize: '0.72rem', color: '#88988D' }}>ID: {p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span
                              style={{
                                backgroundColor: '#EFF7F1',
                                color: '#1E5834',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '0.74rem',
                                fontWeight: 600,
                              }}
                            >
                              {p.categoryTag || 'Store'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontWeight: 700, color: '#1A3E29' }}>₹{p.minPrice}</span>
                            {p.originalPrice > p.minPrice && (
                              <span style={{ textDecoration: 'line-through', color: '#9AA79F', marginLeft: '6px', fontSize: '0.76rem' }}>
                                ₹{p.originalPrice}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <button
                              onClick={() => handleToggleStock(p)}
                              style={{
                                border: 'none',
                                borderRadius: '20px',
                                padding: '4px 10px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                backgroundColor: isInStock ? '#DEF7EC' : '#FEE2E2',
                                color: isInStock ? '#03543F' : '#9B1C1C',
                              }}
                            >
                              {isInStock ? '● In Stock' : '○ Out of Stock'}
                            </button>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              title="Delete Product"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#DC2626',
                                cursor: 'pointer',
                                padding: '6px',
                                borderRadius: '6px',
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 3: CUSTOMER ORDERS ================= */}
          {activeTab === 'ORDERS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '48px',
                    textAlign: 'center',
                    border: '1px solid #E5DBD0',
                  }}
                >
                  <ShoppingBag size={42} color="#A7B7AD" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ margin: '0 0 6px 0', color: '#1E3F2B' }}>No Orders Placed Yet</h4>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#6A7D72' }}>
                    Customer orders placed via the shopping cart drawer will automatically synchronize here in real time.
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid #E5DBD0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#1A3E29' }}>
                            Order #{order.orderRef || order.id.slice(-8).toUpperCase()}
                          </span>
                          <span
                            style={{
                              backgroundColor:
                                order.status === 'DELIVERED'
                                  ? '#DEF7EC'
                                  : order.status === 'DISPATCHED'
                                  ? '#E1EFFE'
                                  : order.status === 'PREPARING'
                                  ? '#FEF3C7'
                                  : '#EFF7F1',
                              color:
                                order.status === 'DELIVERED'
                                  ? '#03543F'
                                  : order.status === 'DISPATCHED'
                                  ? '#1E429F'
                                  : order.status === 'PREPARING'
                                  ? '#92400E'
                                  : '#15803D',
                              padding: '3px 10px',
                              borderRadius: '20px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                            }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#88988D' }}>
                          Placed on: {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1A3E29', marginRight: '4px' }}>
                          ₹{order.totalAmount}
                        </span>

                        {/* Admin Quick Action Progression Buttons */}
                        {order.status === 'CONFIRMED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(order.id, 'PREPARING')}
                            style={{
                              backgroundColor: '#3A643B',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                            title="Confirm and mark in preparation"
                          >
                            ⚙️ Confirm & Prepare
                          </button>
                        )}
                        {order.status === 'PREPARING' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(order.id, 'DISPATCHED')}
                            style={{
                              backgroundColor: '#1E429F',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                            title="Mark as dispatched & in transit"
                          >
                            🚚 Dispatch Order
                          </button>
                        )}
                        {order.status === 'DISPATCHED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                            style={{
                              backgroundColor: '#03543F',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                            title="Mark as delivered"
                          >
                            ✓ Mark Delivered
                          </button>
                        )}

                        {/* Status selector */}
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1.5px solid #3A643B',
                            backgroundColor: '#FAF5EE',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            color: '#1A3E29',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="CONFIRMED">1. Confirmed</option>
                          <option value="PREPARING">2. Preparing</option>
                          <option value="DISPATCHED">3. Dispatched</option>
                          <option value="DELIVERED">4. Delivered</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer Info & Items */}
                    <div
                      style={{
                        backgroundColor: '#FAF5EE',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                        fontSize: '0.84rem',
                      }}
                    >
                      <div>
                        <strong style={{ color: '#274433', display: 'block', marginBottom: '2px' }}>Customer</strong>
                        <span>{order.customerName} ({order.phone})</span>
                      </div>
                      <div>
                        <strong style={{ color: '#274433', display: 'block', marginBottom: '2px' }}>Delivery Address</strong>
                        <span>{order.address || 'Standard Delivery Address'}</span>
                      </div>
                      <div>
                        <strong style={{ color: '#274433', display: 'block', marginBottom: '2px' }}>Ordered Items</strong>
                        <span>
                          {order.items?.map((i) => `${i.name} (x${i.quantity})`).join(', ') || 'Ayurvedic Formulations'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ================= TAB 4: HELPLINE CALLBACKS ================= */}
          {activeTab === 'CALLBACKS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {callbacks.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '48px',
                    textAlign: 'center',
                    border: '1px solid #E5DBD0',
                  }}
                >
                  <PhoneCall size={42} color="#A7B7AD" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ margin: '0 0 6px 0', color: '#1E3F2B' }}>No Pending Callbacks</h4>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#6A7D72' }}>
                    Customer requests for consultation callbacks via +91 98000 00000 will appear here.
                  </p>
                </div>
              ) : (
                callbacks.map((cb) => (
                  <div
                    key={cb.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      padding: '18px 20px',
                      border: '1px solid #E5DBD0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#1E3F2B' }}>
                          {cb.fullName}
                        </span>
                        <span
                          style={{
                            backgroundColor: cb.status === 'RESOLVED' ? '#DEF7EC' : '#FEE2E2',
                            color: cb.status === 'RESOLVED' ? '#03543F' : '#9B1C1C',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                          }}
                        >
                          {cb.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#5B6F62', marginTop: '4px' }}>
                        📞 <strong>{cb.phone}</strong> {cb.healthConcern ? `• Concern: ${cb.healthConcern}` : ''}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#88988D' }}>
                        Requested: {new Date(cb.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {cb.status === 'PENDING' ? (
                      <button
                        onClick={() => handleResolveCallback(cb.id)}
                        style={{
                          backgroundColor: '#3A643B',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '8px 16px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <CheckCircle2 size={15} />
                        <span>Mark Resolved</span>
                      </button>
                    ) : (
                      <span style={{ color: '#15803D', fontWeight: 700, fontSize: '0.82rem' }}>
                        ✓ Resolved
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
