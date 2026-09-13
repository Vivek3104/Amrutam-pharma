import React, { useState } from 'react';
import { Users, X, MessageSquare, Heart, Sparkles, CheckCircle2, Send, Share2 } from 'lucide-react';

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityModal: React.FC<CommunityModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'discussions' | 'ask-vaidya' | 'stories'>('discussions');
  const [question, setQuestion] = useState('');
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<number, number>>({
    1: 42,
    2: 89,
    3: 124,
  });

  if (!isOpen) return null;

  const handleLike = (id: number) => {
    setLikedPosts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setQuestionSubmitted(true);
    setQuestion('');
    setTimeout(() => setQuestionSubmitted(false), 4000);
  };

  const discussions = [
    {
      id: 1,
      author: 'Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      tag: 'Hair Care Rituals',
      time: '2 hours ago',
      title: 'How Kuntal Care Hair Spa changed my postpartum hair texture completely',
      content: 'I was suffering from severe postpartum hair shedding. Following Dr. Gupta’s Dinacharya guide with Kuntal Hair Spa and warm Kayakey scalp massage has restored my hair density within 6 weeks!',
      replies: 18,
    },
    {
      id: 2,
      author: 'Dr. Vikramaditya (Ayurvedic Practitioner)',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80',
      tag: 'Vedic Dinacharya',
      time: '5 hours ago',
      title: 'Managing Pitta Agni during seasonal shift: 3 golden rules from Charaka Samhita',
      content: 'Avoid overly sour or pungent spices in mid-day meals. Drink warm water infused with coriander seeds and take half a spoon of Triphala with warm honey at bed time.',
      replies: 34,
    },
    {
      id: 3,
      author: 'Pooja Nair',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      tag: 'Menstrual Wellness',
      time: 'Yesterday',
      title: 'Regulated a 3-month irregular cycle with Nari Sondarya Malt & lifestyle fixes',
      content: 'I used to take pain killers every month for dysmenorrhea. Drinking warm water with Nari Sondarya Malt twice daily and doing gentle Baddha Konasana worked wonders.',
      replies: 47,
    },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(20, 32, 22, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#FAF5EE',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          border: '1px solid #E2D7C9',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '88vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1C402B 0%, #2A5A3D 100%)',
            padding: '24px 28px',
            color: '#FFFFFF',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#FFF',
              padding: '2px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              <Users size={13} /> AMRUTAM AYURVEDIC CIRCLE
            </span>
            <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>45,200+ Members</span>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.65rem',
            fontWeight: 700,
            margin: '4px 0 4px 0',
          }}>
            Community & Vaidya Exchange
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', opacity: 0.85 }}>
            Real experiences, authentic Vedic wisdom, and personalized guidance from Ayurvedic doctors.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#F3EAE0',
            borderBottom: '1px solid #E2D7C9',
            padding: '0 24px',
          }}
        >
          {[
            { id: 'discussions', label: 'Discussions & Stories' },
            { id: 'ask-vaidya', label: 'Ask a Vaidya (Doctor)' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                background: 'none',
                border: 'none',
                padding: '14px 18px',
                fontSize: '0.9rem',
                fontWeight: activeTab === t.id ? 700 : 500,
                color: activeTab === t.id ? '#204A33' : '#6A7E73',
                borderBottom: activeTab === t.id ? '2px solid #204A33' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'all 0.2s ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'discussions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {discussions.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E6DCD1',
                    borderRadius: '16px',
                    padding: '16px 18px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={item.avatar}
                        alt={item.author}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E3727' }}>
                          {item.author}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#88988D' }}>
                          {item.time}
                        </div>
                      </div>
                    </div>

                    <span style={{
                      backgroundColor: '#EFF6F1',
                      color: '#265438',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}>
                      {item.tag}
                    </span>
                  </div>

                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.98rem', fontWeight: 700, color: '#1F3426' }}>
                    {item.title}
                  </h4>
                  <p style={{ margin: '0 0 14px 0', fontSize: '0.86rem', color: '#4B5E53', lineHeight: 1.5 }}>
                    {item.content}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid #F0E8DF',
                  }}>
                    <button
                      onClick={() => handleLike(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#3A643B',
                      }}
                    >
                      <Heart size={16} fill="#3A643B" color="#3A643B" />
                      <span>{likedPosts[item.id] || 0} Helpful</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.82rem', color: '#6A7D72' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MessageSquare size={15} /> {item.replies} Replies
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        <Share2 size={15} /> Share
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ask-vaidya' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{
                backgroundColor: '#EBF3ED',
                border: '1px solid #C4DCCB',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}>
                <Sparkles size={20} color="#2D603F" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.86rem', color: '#274A34', lineHeight: 1.5 }}>
                  <strong>Have a health concern or Dosha question?</strong> Our panel of certified Ayurvedic Vaidyas review community queries daily and respond with holistic advice and classical formulation recommendations.
                </div>
              </div>

              {questionSubmitted && (
                <div style={{
                  backgroundColor: '#DCFCE7',
                  border: '1px solid #86EFAC',
                  color: '#15803D',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                }}>
                  <CheckCircle2 size={18} />
                  Your question has been posted to our Ayurvedic Vaidyas! You will receive notification within 2-4 hours.
                </div>
              )}

              <form onSubmit={handleAskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '0.86rem', fontWeight: 600, color: '#314739' }}>
                  Your Health or Formulation Query:
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Can Nari Sondarya Malt be taken with warm milk during breakfast? What diet helps Pitta acne?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid #D5C8B8',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.9rem',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    resize: 'vertical',
                  }}
                />

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#2D603F',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 20px',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    alignSelf: 'flex-start',
                  }}
                >
                  <Send size={16} />
                  <span>Submit Question to Vaidya Panel</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
