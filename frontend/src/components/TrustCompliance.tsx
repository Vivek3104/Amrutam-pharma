import React from 'react';
import { ShieldCheck, Lock, FileCheck2, Cpu } from 'lucide-react';

export const TrustCompliance: React.FC = () => {
  return (
    <section style={{
      background: 'rgba(11, 25, 44, 0.6)',
      borderTop: '1px solid var(--border-card)',
      borderBottom: '1px solid var(--border-card)',
      padding: '60px 0',
    }}>
      <div className="container-responsive">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-teal" style={{ marginBottom: '8px' }}>
            <ShieldCheck size={12} /> Institutional Quality Standards
          </span>
          <h2 style={{ fontSize: '2rem', color: '#FFF', marginBottom: '8px' }}>
            Built on Rigorous Pharmaceutical & Technical Standards
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
            Amrutam Pharmaceuticals adheres to international GMP cleanroom manufacturing guidelines and enterprise microservice fault-tolerance.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <FileCheck2 size={28} color="var(--teal-glow)" />
              <h4 style={{ fontSize: '1.1rem', color: '#FFF' }}>AYUSH & Pharmacopoeia Compliant</h4>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              All 100+ herbal preparations strictly follow authentic classical texts (Sharangdhara Samhita, Charaka Samhita) with certified active bio-marker testing.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <Cpu size={28} color="var(--emerald-botanical)" />
              <h4 style={{ fontSize: '1.1rem', color: '#FFF' }}>Idempotent Saga Microservices</h4>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Our booking and pharmacy checkout pipelines utilize Redlock distributed locking to completely prevent slot collision or double-payment errors.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <Lock size={28} color="var(--amber-gold)" />
              <h4 style={{ fontSize: '1.1rem', color: '#FFF' }}>HIPAA & AES-256 Encrypted</h4>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Patient health records, video consultation feeds, and digital e-prescriptions are protected under strict military-grade cryptographic encryption.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
