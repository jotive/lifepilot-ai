import React, { useState } from 'react';
import { RealtimeService } from '../services/realtime.service';
import { useRoomiaStore } from '../store/useRoomiaStore';
import { useAuthStore } from '../store/useAuthStore';
import { translations } from '../config/i18n';
import { getCityCurrency } from '../config/constants';

export function Header({ mode, onModeChange, onOpenSettings }) {
  const [pairInfo, setPairInfo] = useState(null);
  const { currentCity, currencyOverride, language, setLanguage } = useRoomiaStore();
  const { user, setIsAuthModalOpen } = useAuthStore();
  const t = translations[language] || translations.es;
  const defaultCurrency = getCityCurrency(currentCity);
  const activeCurrencyCode = currencyOverride || defaultCurrency.code;

  const handlePairClick = () => {
    const info = RealtimeService.createPairingCode();
    setPairInfo(info);
  };

  return (
    <div className="top-header-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
      {/* Standalone Top Mini Utility Bar (Clean & Minimal) */}
      <div className="top-utility-bar">
        <div className="utility-left-info">
          <span className="utility-city-badge">
            <i className="fa-solid fa-location-dot"></i> {currentCity} ({activeCurrencyCode})
          </span>
        </div>

        <div className="utility-right-controls">
          {/* User Account & Preference Badge */}
          <button 
            className="utility-btn utility-user-btn" 
            onClick={() => setIsAuthModalOpen(true)}
            title="Mi Perfil, Ciudad y Preferencias"
            style={{ background: user.isLoggedIn ? '#fff5f2' : '#ffffff', borderColor: user.isLoggedIn ? '#ffe2d9' : '#cbd5e1', color: user.isLoggedIn ? 'var(--primary)' : 'var(--text-main)', fontWeight: 700 }}
          >
            <i className="fa-solid fa-circle-user"></i>
            <span>{user.isLoggedIn ? user.name : 'Crear Cuenta / Login'}</span>
          </button>

          {/* Selector de Idioma */}
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            title="Idioma de la interfaz"
            className="utility-select lang-select"
          >
            <option value="es">🇲🇽 ES</option>
            <option value="en">🇺🇸 EN</option>
            <option value="pt">🇧🇷 PT</option>
          </select>

          {mode === 'couple' && (
            <button className="utility-btn utility-pair-btn" onClick={handlePairClick} title="Vincular Dispositivo" aria-label="Vincular Roomie">
              <i className="fa-solid fa-qrcode"></i> <span>Vincular</span>
            </button>
          )}

          <button className="utility-icon-btn" onClick={onOpenSettings} title="Ajustes de Ciudad y Preferencias" aria-label="Ajustes">
            <i className="fa-solid fa-gear"></i>
          </button>
        </div>
      </div>

      {/* Main Header Brand Bar */}
      <header className="main-header">
        <div className="header-brand">
          <div className="logo-icon">
            <i className="fa-solid fa-house-user"></i>
          </div>
          <div className="logo-text">
            <h1>Room<span className="logo-highlight">IA</span> <span className="badge-ai">PRO</span></h1>
            <p className="tagline">{t.tagline}</p>
          </div>
        </div>
      </header>

      {pairInfo && (
        <div className="modal-overlay active" style={{ zIndex: 9999 }}>
          <div className="modal-card">
            <div className="modal-header">
              <h3><i className="fa-solid fa-qrcode"></i> Vincular Dispositivos RoomIA</h3>
              <button className="close-btn" onClick={() => setPairInfo(null)}>&times;</button>
            </div>
            <div className="modal-body text-center">
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Comparte este código o enlace con tu pareja o roomie para sincronizar la alacena y gastos en vivo:</p>
              <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '4px', color: 'var(--accent-cyan)', background: 'var(--bg-dark)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                {pairInfo.pairCode}
              </div>
              <input type="text" readOnly value={pairInfo.pairLink} style={{ textAlign: 'center' }} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary full-width" onClick={() => {
                navigator.clipboard.writeText(pairInfo.pairLink);
                alert('Enlace de vinculación copiado al portapapeles.');
                setPairInfo(null);
              }}>
                <i className="fa-solid fa-copy"></i> Copiar Enlace de Vinculación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
