import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

export function LandingPage({ onStartDemo }) {
  const { setIsAuthModalOpen } = useAuthStore();

  return (
    <div className="landing-container" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '1rem 0' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #fff5f2 0%, #ffffff 50%, #f0fdf4 100%)',
        border: '1px solid #ffe2d9',
        borderRadius: '32px',
        padding: '3rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem',
        boxShadow: '0 12px 36px rgba(255, 107, 74, 0.08)'
      }}>
        <div style={{ flex: '1 1 420px' }}>
          <span className="badge-ai" style={{ marginBottom: '1rem', fontSize: '0.8rem', padding: '4px 12px' }}>
            🚀 Hackatón de IA 2026 — Código Facilito & AWS
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1.25', marginBottom: '1rem' }}>
            Tu Roomie Inteligente & Copiloto para Conquistar Cualquier Ciudad
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.75rem' }}>
            Asiéntate en una nueva ciudad sin fricción. Divide gastos 50/50 en tu moneda local (**COP, MXN, EUR**), escanea tu refrigerador con IA y protege tus contratos con cifrado web.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={onStartDemo} style={{ padding: '0.9rem 1.75rem', fontSize: '1rem' }}>
              <i className="fa-solid fa-rocket"></i> Entrar a la App / Demo
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => setIsAuthModalOpen(true)} style={{ padding: '0.9rem 1.75rem', fontSize: '1rem' }}>
              <i className="fa-solid fa-user-plus"></i> Crear Cuenta Gratis
            </button>
          </div>
        </div>

        <div style={{ flex: '1 1 360px', textAlign: 'center' }}>
          <img 
            src="/assets/roomia_hero_3d.jpg" 
            alt="RoomIA Hero 3D" 
            style={{ maxWidth: '100%', borderRadius: '24px', boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}
            loading="lazy"
          />
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Todo lo que necesitas para tu hogar y vida urbana
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Diseñado para nómadas digitales, expats y parejas que comparten casa.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {/* Feature 1 */}
          <div className="vault-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255, 107, 74, 0.12)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1rem' }}>
              <i className="fa-solid fa-compass"></i>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>Radar Urbano Live</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Búsqueda en vivo de eventos culturales, gastronomía y networking con la API de Tavily y planificador por IA.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="vault-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1rem' }}>
              <i className="fa-solid fa-wallet"></i>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>Finanzas & Kanban 50/50</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Cuentas claras en tu moneda local sin centavos innecesarios. Arrastra tareas del hogar y exporta reportes CSV.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="vault-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1rem' }}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>Bóveda Segura & Ficha PNG</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Cifrado SHA-256 en navegador, analizador de contratos de alquiler y exportación de Ficha Médica en imagen para WhatsApp.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="vault-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1rem' }}>
              <i className="fa-solid fa-utensils"></i>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>Recetas Anti-Desperdicio</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Escanea tus ingredientes con la cámara o dictado por voz para recibir menús inteligentes adaptados a tu refrigerador.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        borderRadius: '28px',
        padding: '3rem 2rem',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          ¿Listo para transformar tu experiencia de convivencia y ciudad?
        </h2>
        <p style={{ color: '#c7d2fe', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
          Sin instalaciones ni configuraciones complejas. Todo funciona directamente en tu navegador con privacidad total.
        </p>
        <button className="btn btn-gradient btn-lg" onClick={onStartDemo}>
          🚀 Iniciar RoomIA Ahora
        </button>
      </section>
    </div>
  );
}
