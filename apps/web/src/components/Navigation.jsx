import React from 'react';

export function Navigation({ activeTab, onTabChange, mode }) {
  const tabs = [
    { id: 'city-events', icon: 'fa-compass', label: 'Explorar Ciudad & Eventos' },
    { id: 'relocation', icon: 'fa-city', label: 'Guía de Mudanza & Trámites' },
    { id: 'fridge-kitchen', icon: 'fa-utensils', label: 'Mi Refrigerador & Recetas' },
    { id: 'couple-expenses', icon: 'fa-wallet', label: mode === 'solo' ? 'Finanzas & Tareas Solitario' : 'Finanzas & Convivencia' },
    { id: 'documents', icon: 'fa-folder-closed', label: 'Bóveda de Documentos & Salud' }
  ];

  return (
    <nav className="main-nav">
      <div className="nav-track">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
