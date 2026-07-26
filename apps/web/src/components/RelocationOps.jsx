import React, { useState, useEffect } from 'react';
import { useRoomiaStore } from '../store/useRoomiaStore';
import { translations } from '../config/i18n';
import { getCityCurrency } from '../config/constants';

export function RelocationOps({ currentCity }) {
  const { language } = useRoomiaStore();
  const t = translations[language] || translations.es;
  const currency = getCityCurrency(currentCity);

  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Verificar contrato de arrendamiento con IA en RoomIA', category: 'Trámites Iniciales', completed: true },
    { id: 2, text: 'Registro de servicios de luz, agua e internet a nombre propio', category: 'Trámites Iniciales', completed: false },
    { id: 3, text: 'Registro en el centro de salud o clínica local más cercana', category: 'Salud & Servicios', completed: false },
    { id: 4, text: 'Identificar supermercados y mercados de abastecimiento en el barrio', category: 'Asentamiento Barrio', completed: true },
    { id: 5, text: 'Configurar mapa de transporte público y rutas de desplazamiento', category: 'Asentamiento Barrio', completed: false }
  ]);

  const [calc, setCalc] = useState({
    rent: currency.defaultRent,
    deposit: currency.defaultDeposit,
    utilities: currency.defaultUtilities,
    furniture: currency.defaultFurniture
  });

  useEffect(() => {
    const freshCurrency = getCityCurrency(currentCity);
    setCalc({
      rent: freshCurrency.defaultRent,
      deposit: freshCurrency.defaultDeposit,
      utilities: freshCurrency.defaultUtilities,
      furniture: freshCurrency.defaultFurniture
    });
  }, [currentCity]);

  const toggleCheck = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const totalCalculated = Number(calc.rent) + Number(calc.deposit) + Number(calc.utilities) + Number(calc.furniture);
  const completedCount = checklist.filter(c => c.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <section className="tab-panel active">
      {/* 3D Hero Widget Banner */}
      <div className="hero-3d-banner">
        <div className="hero-3d-text">
          <h3>{t.relocationTitle} 📦</h3>
          <p>{t.relocationSub} <span className="city-highlight">{currentCity} ({currency.code})</span>.</p>
        </div>
        <img 
          src="/assets/roomia_relocation_3d.jpg" 
          alt="Relocation 3D Illustration" 
          className="hero-3d-img" 
        />
      </div>

      <div className="relocation-grid">
        <div className="relocation-card">
          <div className="card-title-bar">
            <h3><i className="fa-solid fa-list-check text-coral"></i> {t.checklistTitle}</h3>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span className="progress-text">{progressPercent}%</span>
          </div>

          <div className="checklist-groups">
            {['Trámites Iniciales', 'Salud & Servicios', 'Asentamiento Barrio'].map(cat => (
              <div key={cat} className="check-category">
                <h4>{cat}</h4>
                {checklist.filter(i => i.category === cat).map(item => (
                  <label key={item.id} className="check-item">
                    <input 
                      type="checkbox" 
                      checked={item.completed} 
                      onChange={() => toggleCheck(item.id)} 
                    />
                    <span style={{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? 'var(--text-muted)' : 'var(--text-main)' }}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="relocation-card">
          <div className="card-title-bar">
            <h3><i className="fa-solid fa-calculator text-indigo"></i> Presupuesto Estimado ({currency.code})</h3>
          </div>
          <p className="sidebar-desc">Estimación automática de costos en <span className="city-highlight">{currentCity}</span> ({currency.name}).</p>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label>{t.rentLabel} ({currency.code})</label>
                <input 
                  type="number" 
                  value={calc.rent} 
                  onChange={(e) => setCalc({ ...calc, rent: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>{t.depositLabel} ({currency.code})</label>
                <input 
                  type="number" 
                  value={calc.deposit} 
                  onChange={(e) => setCalc({ ...calc, deposit: e.target.value })} 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t.utilitiesLabel} ({currency.code})</label>
                <input 
                  type="number" 
                  value={calc.utilities} 
                  onChange={(e) => setCalc({ ...calc, utilities: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>{t.furnitureLabel} ({currency.code})</label>
                <input 
                  type="number" 
                  value={calc.furniture} 
                  onChange={(e) => setCalc({ ...calc, furniture: e.target.value })} 
                />
              </div>
            </div>

            <div className="calc-total-box">
              <span>{t.totalMonth1}</span>
              <strong>{currency.symbol}{totalCalculated.toLocaleString('es-ES')} {currency.code}</strong>
            </div>
          </form>

          <div className="emergency-directory">
            <h4><i className="fa-solid fa-phone-flip text-rose-500"></i> Directorio de Emergencia ({currentCity})</h4>
            <div className="emergency-pills">
              <div className="pill-item"><i className="fa-solid fa-shield-cat"></i> Policía Nacional / Emergencias: 911 / 123</div>
              <div className="pill-item"><i className="fa-solid fa-truck-medical"></i> Ambulancia Médica: 125</div>
              <div className="pill-item"><i className="fa-solid fa-fire-extinguisher"></i> Bomberos: 119</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
