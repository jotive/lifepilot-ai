import React, { useState } from 'react';

export function SettingsModal({ isOpen, currentCity, apiKey, onClose, onSave }) {
  const [city, setCity] = useState(currentCity);
  const [key, setKey] = useState(apiKey);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(city, key);
    onClose();
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-card">
        <div className="modal-header">
          <h3><i className="fa-solid fa-sliders"></i> Ajustes de RoomIA & Búsqueda</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="alert-info">
            <i className="fa-solid fa-shield-halved"></i>
            <span><strong>Seguridad Garantizada:</strong> Tus configuraciones se guardan únicamente en el <code>localStorage</code> de tu propio navegador.</span>
          </div>

          <div className="form-group">
            <label>Ciudad Actual de Relocalización</label>
            <input 
              type="text" 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ej: Ciudad de México, Buenos Aires, Bogotá, Madrid" 
            />
          </div>

          <div className="form-group">
            <label>API Key de Búsqueda en Vivo (Opcional)</label>
            <input 
              type="password" 
              value={key} 
              onChange={(e) => setKey(e.target.value)}
              placeholder="Ingresa tu clave de búsqueda en vivo" 
            />
            <small className="help-text">Si se deja vacío, RoomIA utilizará el motor de exploración en tiempo real por defecto.</small>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary full-width" onClick={handleSave}>
            <i className="fa-solid fa-check"></i> Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
}
