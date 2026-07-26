import React, { useState, useEffect } from 'react';
import { StorageUtil } from '../utils/storage.util';

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const hasSeenOnboarding = StorageUtil.get('roomia_onboarding_seen', false);
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleFinish = () => {
    StorageUtil.set('roomia_onboarding_seen', true);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" style={{ zIndex: 10000 }}>
      <div className="modal-card" style={{ maxWidth: '540px', padding: '2rem', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span className="event-badge" style={{ background: 'rgba(255, 107, 74, 0.12)', color: 'var(--primary)', fontWeight: 800 }}>
            Paso {step} de 3 — Tour RoomIA PRO
          </span>
          <button onClick={handleFinish} className="close-btn" aria-label="Saltar tour">&times;</button>
        </div>

        {step === 1 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌇</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              ¡Bienvenido a RoomIA PRO!
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              Tu copiloto inteligente para asentarte en cualquier ciudad, gestionar el hogar y compartir gastos sin fricción ni desorden.
            </p>
          </div>
        )}

        {step === 2 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📋💳</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Finanzas 50/50 & Organizador de Tareas
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              Lleva cuentas claras en tu moneda local (**COP, MXN, EUR, etc.**), exporta tus reportes en CSV y arrastra tareas en el tablero interactivo.
            </p>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🛡️🥗</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Bóveda Segura & Recetas Anti-Desperdicio
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              Guarda tus contratos cifrados, exporta tu **Ficha Médica de Emergencia en PNG o WhatsApp** y escanea tu refrigerador con IA.
            </p>
          </div>
        )}

        {/* Progress indicators & navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2, 3].map(i => (
              <span key={i} style={{ width: i === step ? '24px' : '8px', height: '8px', borderRadius: '9999px', background: i === step ? 'var(--primary)' : '#cbd5e1', transition: 'all 0.3s ease' }}></span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {step > 1 && (
              <button className="btn btn-secondary btn-sm" onClick={() => setStep(step - 1)}>
                Anterior
              </button>
            )}
            {step < 3 ? (
              <button className="btn btn-primary btn-sm" onClick={() => setStep(step + 1)}>
                Siguiente <i className="fa-solid fa-arrow-right"></i>
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={handleFinish}>
                🚀 Comienza a Usar RoomIA
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
