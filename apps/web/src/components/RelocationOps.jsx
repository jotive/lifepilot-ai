import React, { useState, useEffect } from 'react';
import { useRoomiaStore } from '../store/useRoomiaStore';
import { translations } from '../config/i18n';
import { getCityCurrency, formatMoney } from '../config/constants';
import { exportRelocationChecklist } from '../utils/export.util';
import { StorageUtil } from '../utils/storage.util';
import { ContractAnalyzerModal } from './ContractAnalyzerModal';

const DEFAULT_CHECKLIST = [
  { id: '1', text: 'Verificar contrato de arrendamiento con IA en RoomIA', category: 'Trámites Iniciales', completed: true },
  { id: '2', text: 'Registro de servicios de luz, agua e internet a nombre propio', category: 'Trámites Iniciales', completed: false },
  { id: '3', text: 'Registro en el centro de salud o clínica local más cercana', category: 'Salud & Servicios', completed: false },
  { id: '4', text: 'Identificar supermercados y mercados de abastecimiento en el barrio', category: 'Asentamiento Barrio', completed: true },
  { id: '5', text: 'Configurar mapa de transporte público y rutas de desplazamiento', category: 'Asentamiento Barrio', completed: false }
];

export function RelocationOps({ currentCity }) {
  const { language, currencyOverride } = useRoomiaStore();
  const t = translations[language] || translations.es;
  const defaultCurrency = getCityCurrency(currentCity);
  const activeCurrencyCode = currencyOverride || defaultCurrency.code;

  // Load persistent checklist from storage
  const [checklist, setChecklist] = useState(() => 
    StorageUtil.get('roomia_relocation_checklist', DEFAULT_CHECKLIST)
  );

  // Load persistent budget calculation from storage
  const [calc, setCalc] = useState(() => 
    StorageUtil.get('roomia_relocation_calc', {
      rent: defaultCurrency.defaultRent,
      deposit: defaultCurrency.defaultDeposit,
      utilities: defaultCurrency.defaultUtilities,
      furniture: defaultCurrency.defaultFurniture
    })
  );

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Trámites Iniciales');
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  // Synchronize defaults when city changes if no custom edits exist
  useEffect(() => {
    const freshCurrency = getCityCurrency(currentCity);
    const storedCalc = StorageUtil.get('roomia_relocation_calc', null);
    if (!storedCalc) {
      const initialCalc = {
        rent: freshCurrency.defaultRent,
        deposit: freshCurrency.defaultDeposit,
        utilities: freshCurrency.defaultUtilities,
        furniture: freshCurrency.defaultFurniture
      };
      setCalc(initialCalc);
      StorageUtil.set('roomia_relocation_calc', initialCalc);
    }
  }, [currentCity]);

  const toggleCheck = (id) => {
    const updated = checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
    setChecklist(updated);
    StorageUtil.set('roomia_relocation_checklist', updated);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      category: newTaskCategory,
      completed: false
    };
    const updated = [...checklist, newTask];
    setChecklist(updated);
    StorageUtil.set('roomia_relocation_checklist', updated);
    setNewTaskText('');
  };

  const handleRemoveTask = (id) => {
    const updated = checklist.filter(item => item.id !== id);
    setChecklist(updated);
    StorageUtil.set('roomia_relocation_checklist', updated);
  };

  const handleCalcChange = (field, value) => {
    const updated = { ...calc, [field]: value };
    setCalc(updated);
    StorageUtil.set('roomia_relocation_calc', updated);
  };

  const handleExportRelocation = () => {
    exportRelocationChecklist(checklist, calc, currentCity, activeCurrencyCode);
  };

  const totalCalculated = (Number(calc.rent) || 0) + (Number(calc.deposit) || 0) + (Number(calc.utilities) || 0) + (Number(calc.furniture) || 0);
  const completedCount = checklist.filter(c => c.completed).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  const categories = Array.from(new Set(checklist.map(i => i.category || 'Trámites Iniciales')));

  return (
    <section className="tab-panel active">
      {/* 3D Hero Widget Banner */}
      <div className="hero-3d-banner">
        <div className="hero-3d-text">
          <h3>{t.relocationTitle} 📦</h3>
          <p>{t.relocationSub} <span className="city-highlight">{currentCity} ({activeCurrencyCode})</span>.</p>
        </div>
        <img 
          src="/assets/roomia_relocation_3d.jpg" 
          alt="Relocation 3D Illustration" 
          className="hero-3d-img" 
        />
      </div>

      <div className="relocation-grid">
        {/* CHECKLIST CARD */}
        <div className="relocation-card">
          <div className="card-title-bar" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3><i className="fa-solid fa-list-check text-coral"></i> {t.checklistTitle}</h3>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="btn btn-secondary btn-sm" onClick={handleExportRelocation} title="Exportar Guía y Presupuesto de Mudanza">
                <i className="fa-solid fa-download"></i> Exportar Guía
              </button>
              <div className="progress-bar-wrap" style={{ width: '80px' }}>
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <span className="progress-text">{progressPercent}%</span>
            </div>
          </div>

          {/* FORMULARIO PARA AGREGAR NUEVAS TAREAS */}
          <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0 1.25rem 0', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="+ Agregar nueva tarea a la checklist..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              style={{ flex: 1, minWidth: '200px', fontSize: '0.85rem', padding: '0.65rem 0.9rem' }}
            />
            <select
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              style={{ width: 'auto', fontSize: '0.82rem', padding: '0.65rem 0.8rem' }}
            >
              <option value="Trámites Iniciales">Trámites Iniciales</option>
              <option value="Salud & Servicios">Salud & Servicios</option>
              <option value="Asentamiento Barrio">Asentamiento Barrio</option>
            </select>
            <button type="submit" className="btn btn-primary btn-sm">
              <i className="fa-solid fa-plus"></i> Agregar
            </button>
          </form>

          <div className="checklist-groups">
            {categories.map(cat => (
              <div key={cat} className="check-category">
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>{cat}</h4>
                {checklist.filter(i => i.category === cat).map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0' }}>
                    <label className="check-item" style={{ flex: 1, cursor: 'pointer', margin: 0 }}>
                      <input 
                        type="checkbox" 
                        checked={item.completed} 
                        onChange={() => toggleCheck(item.id)} 
                      />
                      <span style={{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? 'var(--text-muted)' : 'var(--text-main)', fontSize: '0.88rem' }}>
                        {item.text}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(item.id)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.2rem 0.4rem', fontSize: '0.85rem' }}
                      title="Eliminar tarea"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* PRESUPUESTO ESTIMADO CARD */}
        <div className="relocation-card">
          <div className="card-title-bar">
            <h3><i className="fa-solid fa-calculator text-indigo"></i> Presupuesto Estimado ({activeCurrencyCode})</h3>
          </div>
          <p className="sidebar-desc" style={{ marginBottom: '1.25rem' }}>
            Ingresa y edita tus costos estimados de asentamiento en <span className="city-highlight">{currentCity}</span>:
          </p>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label>{t.rentLabel} ({activeCurrencyCode})</label>
                <input 
                  type="number" 
                  value={calc.rent} 
                  onChange={(e) => handleCalcChange('rent', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>{t.depositLabel} ({activeCurrencyCode})</label>
                <input 
                  type="number" 
                  value={calc.deposit} 
                  onChange={(e) => handleCalcChange('deposit', e.target.value)} 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t.utilitiesLabel} ({activeCurrencyCode})</label>
                <input 
                  type="number" 
                  value={calc.utilities} 
                  onChange={(e) => handleCalcChange('utilities', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>{t.furnitureLabel} ({activeCurrencyCode})</label>
                <input 
                  type="number" 
                  value={calc.furniture} 
                  onChange={(e) => handleCalcChange('furniture', e.target.value)} 
                />
              </div>
            </div>

            <div className="calc-total-box" style={{ margin: '1rem 0' }}>
              <span>{t.totalMonth1}</span>
              <strong>{formatMoney(totalCalculated, activeCurrencyCode)} {activeCurrencyCode}</strong>
            </div>
          </form>

          {/* BOTÓN PARA ANALIZAR CONTRATO DE ARRENDAMIENTO CON IA */}
          <div style={{ margin: '1.25rem 0', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <button 
              type="button" 
              className="btn btn-gradient full-width"
              onClick={() => setIsContractModalOpen(true)}
            >
              <i className="fa-solid fa-file-contract"></i> Analizar Contrato de Arrendamiento con IA
            </button>
          </div>

          <div className="emergency-directory">
            <h4><i className="fa-solid fa-phone-flip text-rose-500"></i> Directorio de Emergencia Local ({currentCity})</h4>
            <div className="emergency-pills">
              {(defaultCurrency.emergencies || []).map((em, idx) => (
                <div key={idx} className="pill-item">
                  <i className="fa-solid fa-shield-halved text-rose-500"></i> {em.name}: <strong>{em.number}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTRACT ANALYZER MODAL */}
      <ContractAnalyzerModal 
        isOpen={isContractModalOpen} 
        onClose={() => setIsContractModalOpen(false)} 
      />
    </section>
  );
}

