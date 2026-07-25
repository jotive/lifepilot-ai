import React from 'react';

export function Header({ currentCity, mode, onCityClick, onModeChange, onOpenSettings }) {
  return (
    <header className="main-header">
      <div className="header-brand">
        <div className="logo-icon">
          <i className="fa-solid fa-house-user"></i>
        </div>
        <div className="logo-text">
          <h1>Room<span className="logo-highlight">IA</span> <span className="badge-ai">PRO</span></h1>
          <p className="tagline">Tu Roomie Inteligente & Copiloto de Vida</p>
        </div>
      </div>

      <div className="header-controls">
        <button className="city-selector-btn" onClick={onCityClick} title="Cambiar Ciudad">
          <i class="fa-solid fa-location-dot"></i>
          <span>{currentCity}</span>
          <i class="fa-solid fa-chevron-down text-xs"></i>
        </button>

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

        <button className="icon-btn" onClick={onOpenSettings} title="Configurar Preferencias">
          <i className="fa-solid fa-gear"></i>
        </button>
      </div>
    </header>
  );
}
