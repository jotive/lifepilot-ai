import React, { useState } from 'react';
import { SUPPORTED_CITIES } from '../config/constants';

export function SettingsModal({ isOpen, currentCity, onClose, onSave }) {
  const [cityInput, setCityInput] = useState(currentCity || 'Ciudad de México');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(cityInput, '');
    onClose();
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3><i className="fa-solid fa-location-dot text-coral"></i> Seleccionar Ciudad de Residencia</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
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

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary full-width" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary full-width">
              <i className="fa-solid fa-check"></i> Guardar Ciudad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
