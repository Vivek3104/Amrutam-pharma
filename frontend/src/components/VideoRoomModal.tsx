import React, { useState } from 'react';
import type { Consultation } from '../types';
import { X, Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, MessageSquare, Shield, Send } from 'lucide-react';

interface VideoRoomModalProps {
  consultation: Consultation | null;
  onClose: () => void;
}

export const VideoRoomModal: React.FC<VideoRoomModalProps> = ({ consultation, onClose }) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'System', text: 'End-to-End Encrypted Telemedicine Session Started.' },
    { sender: 'Dr. Vaidya Ananya Sharma', text: 'Namaste! Welcome to your Amrutam consultation. How are you feeling today?' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  if (!consultation) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages((prev) => [...prev, { sender: 'You', text: newMessage }]);
    setNewMessage('');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: '10px' }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1100px',
          width: '95vw',
          height: '88vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          overflow: 'hidden',
          background: '#04100C',
        }}
      >
        {/* Header Bar */}
        <div style={{
          padding: '14px 20px',
          background: '#081D16',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--accent-mint)',
              boxShadow: '0 0 10px var(--accent-mint)',
            }} />
            <span style={{ color: '#FFF', fontWeight: 600, fontSize: '0.95rem' }}>
              {consultation.doctorName || 'Dr. Vaidya Ananya Sharma'}
            </span>
            <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
              <Shield size={12} /> HIPAA / AES-256 Encrypted
            </span>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#AAA', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Video Main Body Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', overflow: 'hidden' }}>
          {/* Main Video Screen */}
          <div style={{
            position: 'relative',
            background: '#020B08',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}>
            {/* Simulated Doctor Video Stream */}
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
              background: 'radial-gradient(circle at center, #0F382C 0%, #03140E 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src="https://images.unsplash.com/photo-1594824813566-88855ce78347?auto=format&fit=crop&q=80&w=600"
                alt="Doctor Stream"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.9,
                }}
              />

              {/* Patient Self Video Window */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                width: '160px',
                height: '110px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border: '2px solid var(--accent-gold)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.8)',
                background: '#071913',
              }}>
                {isVideoOn ? (
                  <div style={{ width: '100%', height: '100%', background: '#113328', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '0.75rem' }}>
                    Self View (HD)
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                    Cam Off
                  </div>
                )}
              </div>
            </div>

            {/* Video Controls Bar */}
            <div style={{
              position: 'absolute',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(7, 25, 19, 0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-full)',
              padding: '10px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isMicOn ? 'rgba(255,255,255,0.1)' : '#EF4444',
                  color: '#FFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isVideoOn ? 'rgba(255,255,255,0.1)' : '#EF4444',
                  color: '#FFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isVideoOn ? <VideoIcon size={20} /> : <VideoOff size={20} />}
              </button>

              <button
                onClick={onClose}
                style={{
                  width: '52px',
                  height: '44px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: '#DC2626',
                  color: '#FFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
                title="End Consultation"
              >
                <PhoneOff size={20} />
              </button>
            </div>
          </div>

          {/* Right Chat Drawer */}
          <div style={{
            background: '#061712',
            borderLeft: '1px solid var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ padding: '14px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--accent-gold)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={16} /> Consultation Chat
            </div>

            <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{
                  alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.sender === 'You' ? 'var(--primary-light)' : 'rgba(255,255,255,0.06)',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: '2px' }}>{msg.sender}</div>
                  <div style={{ color: '#FFF' }}>{msg.text}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} style={{ padding: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="input-field"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)' }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
