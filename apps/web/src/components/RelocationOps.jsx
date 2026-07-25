import React, { useState } from 'react';

export function RelocationOps({ currentCity }) {
  const [rent, setRent] = useState(650);
  const [deposit, setDeposit] = useState(650);
  const [utilities, setUtilities] = useState(120);
  const [furniture, setFurniture] = useState(300);

  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Firmar inventario y contrato de arrendamiento (guardar copia digital en RoomIA).', checked: true },
    { id: 'c2', label: 'Hacer cambio de titularidad / contratación de Internet de alta velocidad.', checked: true },
    { id: 'c3', label: 'Verificar medidores de electricidad y agua al ingresar.', checked: false },
    { id: 'c4', label: 'Obtener tarjeta oficial de transporte público (Metro/Bus local).', checked: false },
    { id: 'c5', label: 'Mapear las 2 rutas principales hacia el trabajo o universidad.', checked: false },
    { id: 'c6', label: 'Ubicar la farmacia de turno 24h y el centro médico más cercano.', checked: false },
    { id: 'c7', label: 'Registrar números de emergencia locales en RoomIA.', checked: false }
  ]);

  const toggleCheck = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const completedCount = checklist.filter(c => c.checked).length;
  const progressPct = Math.round((completedCount / checklist.length) * 100);
  const totalCost = rent + deposit + utilities + furniture;

  return (
    <section className="tab-panel active">
      <div className="panel-hero">
        <div className="hero-text">
          <h2><i className="fa-solid fa-building-flag"></i> Guía de Asentamiento & Trámites</h2>
          <p>Checklist inteligente y simulador de costos para mudarse e independizarse en <span className="city-highlight">{currentCity}</span>.</p>
        </div>
      </div>

      <div className="relocation-grid">
        <div className="relocation-card">
          <div className="card-title-bar">
            <h3><i className="fa-solid fa-list-check"></i> Checklist de Mudanza & Trámites</h3>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
            </div>
            <span className="progress-text">{progressPct}% Completado</span>
          </div>

          <div className="checklist-groups">
            <div className="check-category">
              <h4><i className="fa-solid fa-house-key"></i> Fase 1: Vivienda & Servicios Base</h4>
              {checklist.slice(0, 3).map(item => (
                <div key={item.id} className="check-item">
                  <input type="checkbox" id={item.id} checked={item.checked} onChange={() => toggleCheck(item.id)} />
                  <label htmlFor={item.id}>{item.label}</label>
                </div>
              ))}
            </div>

            <div className="check-category">
              <h4><i className="fa-solid fa-bus"></i> Fase 2: Transporte & Movilidad Local</h4>
              {checklist.slice(3, 5).map(item => (
                <div key={item.id} className="check-item">
                  <input type="checkbox" id={item.id} checked={item.checked} onChange={() => toggleCheck(item.id)} />
                  <label htmlFor={item.id}>{item.label}</label>
                </div>
              ))}
            </div>

            <div className="check-category">
              <h4><i className="fa-solid fa-shield-heart"></i> Fase 3: Salud & Conexiones Locales</h4>
              {checklist.slice(5).map(item => (
                <div key={item.id} className="check-item">
                  <input type="checkbox" id={item.id} checked={item.checked} onChange={() => toggleCheck(item.id)} />
                  <label htmlFor={item.id}>{item.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relocation-card">
          <div className="card-title-bar">
            <h3><i className="fa-solid fa-calculator"></i> Calculadora de Instalación Inicial</h3>
          </div>
          <p className="card-subtitle">Estimación de costos al mudar o independizarse en {currentCity}:</p>

          <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label>Renta mensual estimada ($)</label>
                <input type="number" value={rent} onChange={(e) => setRent(parseFloat(e.target.value) || 0)} min="0" />
              </div>
              <div className="form-group">
                <label>Depósito de garantía ($)</label>
                <input type="number" value={deposit} onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)} min="0" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Servicios iniciales ($)</label>
                <input type="number" value={utilities} onChange={(e) => setUtilities(parseFloat(e.target.value) || 0)} min="0" />
              </div>
              <div className="form-group">
                <label>Alacena & Amoblado inicial ($)</label>
                <input type="number" value={furniture} onChange={(e) => setFurniture(parseFloat(e.target.value) || 0)} min="0" />
              </div>
            </div>

            <div className="calc-total-box">
              <span>Inversión total para el mes 1:</span>
              <strong>${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong>
            </div>
          </form>

          <div className="emergency-directory">
            <h4><i className="fa-solid fa-phone-flip"></i> Teléfonos de Emergencia ({currentCity})</h4>
            <div className="emergency-pills">
              <div className="pill-item"><i className="fa-solid fa-truck-medical"></i> Emergencias: <strong>911</strong></div>
              <div className="pill-item"><i className="fa-solid fa-user-shield"></i> Locatel: <strong>55 5658 1111</strong></div>
              <div className="pill-item"><i className="fa-solid fa-fire-extinguisher"></i> Bomberos: <strong>55 5768 3700</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
