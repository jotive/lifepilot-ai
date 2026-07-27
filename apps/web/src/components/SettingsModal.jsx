import React, { useState } from 'react';
import { SUPPORTED_CITIES } from '../config/constants';
import { useRoomiaStore } from '../store/useRoomiaStore';

export function SettingsModal({ isOpen, currentCity, apiKey, onClose, onSave }) {
  const [cityInput, setCityInput] = useState(currentCity || 'Ciudad de México');
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const { clearAllAppData } = useRoomiaStore();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(cityInput, keyInput);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('¿Seguro que deseas restablecer todos los datos guardados de la aplicación? Se borrarán las compras y tareas guardadas en este navegador.')) {
      clearAllAppData();
      window.location.reload();
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3><i className="fa-solid fa-gear text-coral"></i> Ajustes de Aplicación & Tavily AI</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Ciudad Actual para la Guía & Eventos</label>
            <select 
              value={cityInput} 
              onChange={(e) => setCityInput(e.target.value)}
            >
              {SUPPORTED_CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Tavily AI Search API Key (Búsqueda en Vivo)</span>
              <span className="badge-ai" style={{ fontSize: '0.65rem' }}>Opcional</span>
            </label>
            <input 
              type="password" 
              placeholder="tvly-xxxxxxxxxxxxxxxx" 
              value={keyInput} 
              onChange={(e) => setKeyInput(e.target.value)} 
              style={{ padding: '0.65rem 0.9rem', fontSize: '0.85rem' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
              Si ingresas tu clave de Tavily, la app consultará eventos reales en la web y los guardará en el <strong>Caché Diario de Base de Datos</strong> (1 sola consulta al día por ciudad).
            </span>
          </div>

          <div style={{ margin: '1.25rem 0', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Gestión & Control de Datos del Usuario
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Los datos se guardan de forma privada en tu navegador local (`localStorage`). Puedes reiniciar o borrar los datos cuando lo desees:
            </p>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm full-width" 
              onClick={handleReset}
              style={{ color: '#ef4444', borderColor: '#fca5a5' }}
            >
              <i className="fa-solid fa-trash-can"></i> Restablecer Datos de Fábrica
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary full-width" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary full-width">
              <i className="fa-solid fa-check"></i> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
