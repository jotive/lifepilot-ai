import React, { useState } from 'react';
import { RealtimeService } from '../services/realtime.service';
import { useRoomiaStore } from '../store/useRoomiaStore';
import { translations } from '../config/i18n';

export function Header({ currentCity, mode, onCityClick, onModeChange, onOpenSettings }) {
  const [pairInfo, setPairInfo] = useState(null);
  const { language, setLanguage } = useRoomiaStore();
  const t = translations[language] || translations.es;

  const handlePairClick = () => {
    const info = RealtimeService.createPairingCode();
    setPairInfo(info);
  };

  return (
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

      <div className="header-controls">
        <button className="city-selector-btn" onClick={onCityClick} title="Cambiar Ciudad">
          <i className="fa-solid fa-location-dot"></i>
          <span>{currentCity}</span>
          <i className="fa-solid fa-chevron-down text-xs"></i>
        </button>

        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem', cursor: 'pointer' }}
        >
          <option value="es">🇲🇽 ES</option>
          <option value="en">🇺🇸 EN</option>
          <option value="pt">🇧🇷 PT</option>
        </select>

        <div className="mode-toggle-group">
          <button 
            className={`mode-btn ${mode === 'solo' ? 'active' : ''}`}
            onClick={() => onModeChange('solo')}
            title="Modo Individual / Expat"
          >
            <i className="fa-solid fa-user"></i>
            <span>Solo Expat</span>
          </button>
          <button 
            className={`mode-btn ${mode === 'couple' ? 'active' : ''}`}
            onClick={() => onModeChange('couple')}
            title="Modo Pareja / Roomies"
          >
            <i className="fa-solid fa-user-group"></i>
            <span>Roomies / Pareja</span>
          </button>
        </div>

        {mode === 'couple' && (
          <button className="btn btn-secondary btn-sm" onClick={handlePairClick} title="Vincular Dispositivo" aria-label="Vincular Roomie">
            <i className="fa-solid fa-qrcode"></i> <span className="pair-label">Vincular Roomie</span>
          </button>
        )}

        <button className="icon-btn" onClick={onOpenSettings} title="Configurar Preferencias">
          <i className="fa-solid fa-gear"></i>
        </button>
      </div>

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
    </header>
  );
}
