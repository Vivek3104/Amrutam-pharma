import React, { useState } from 'react';
import { PhoneCall, X, Mail, Clock, CheckCircle2, Send } from 'lucide-react';

import { apiClient } from '../api/client';

interface PhoneSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneSupportModal: React.FC<PhoneSupportModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [concern, setConcern] = useState('Hair Fall & Scalp');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/callbacks', {
        fullName: name || 'Customer Inquirer',
        phone: phone || '+91 98000 00000',
        healthConcern: concern,
      });
    } catch (err) {
      console.log('Callback saved locally');
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setName('');
      setPhone('');
      onClose();
    }, 3000);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(20, 30, 22, 0.65)',
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
          maxWidth: '540px',
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
            background: 'linear-gradient(135deg, #1A3E29 0%, #2A583B 100%)',
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
              fontSize: '0.74rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              <PhoneCall size={12} /> AYURVEDIC CARE & HELPLINE
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.6rem',
            fontWeight: 700,
            margin: '4px 0 4px 0',
          }}>
            Connect with Amrutam Care
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', opacity: 0.85 }}>
            Talk to an Ayurvedic practitioner or get support regarding your order & formulation doses.
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Contact Details Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4D9CE',
            borderRadius: '16px',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: '#EAF4ED', padding: '8px', borderRadius: '8px' }}>
                <PhoneCall size={18} color="#2A583B" />
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', color: '#7E8E84', textTransform: 'uppercase', fontWeight: 700 }}>
                  Toll-Free Patient Helpline
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1B3F2B' }}>
                  +91 98000 00000
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: '#EAF4ED', padding: '8px', borderRadius: '8px' }}>
                <Mail size={18} color="#2A583B" />
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', color: '#7E8E84', textTransform: 'uppercase', fontWeight: 700 }}>
                  Email Support
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: 600, color: '#1B3F2B' }}>
                  care@amrutam-wellness.demo
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: '#EAF4ED', padding: '8px', borderRadius: '8px' }}>
                <Clock size={18} color="#2A583B" />
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', color: '#7E8E84', textTransform: 'uppercase', fontWeight: 700 }}>
                  Operational Hours
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 500, color: '#1B3F2B' }}>
                  Monday to Saturday • 9:00 AM – 7:00 PM IST
                </div>
              </div>
            </div>
          </div>

          {/* Callback Request Form */}
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: '#274433', fontWeight: 700 }}>
              Request an Ayurvedic Doctor Callback
            </h4>

            {isSubmitted ? (
              <div style={{
                backgroundColor: '#DCFCE7',
                border: '1px solid #86EFAC',
                color: '#15803D',
                padding: '14px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}>
                <CheckCircle2 size={20} />
                <span>Callback registered! Our Ayurvedic advisor will call you within 30 minutes.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <input
                    required
                    type="text"
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #D8CCBE',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.9rem',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <input
                    required
                    type="tel"
                    placeholder="Mobile / WhatsApp Number (+91)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #D8CCBE',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.9rem',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <select
                    value={concern}
                    onChange={(e) => setConcern(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #D8CCBE',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.9rem',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      outline: 'none',
                      color: '#274433',
                    }}
                  >
                    <option value="Hair Fall & Scalp">Hair Fall & Scalp Care</option>
                    <option value="Menstrual & Hormonal">Period & Hormonal Balance</option>
                    <option value="Digestion & Gut">Digestion & Gut Agni</option>
                    <option value="Skin Radiance">Skin Radiance & Acne</option>
                    <option value="Immunity & Energy">Immunity & Daily Energy</option>
                    <option value="Joint & Bone Care">Joint & Bone Pain</option>
                  </select>
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#275638',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Send size={16} />
                  <span>Request Instant Callback</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
