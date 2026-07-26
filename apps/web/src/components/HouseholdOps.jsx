import React, { useState } from 'react';
import { useRoomiaStore } from '../store/useRoomiaStore';
import { translations } from '../config/i18n';
import { getCityCurrency } from '../config/constants';
import { exportExpensesToCSV } from '../utils/export.util';

export function HouseholdOps({ expenses = [], chores = [], mode, onAddExpense, onToggleChore }) {
  const { language, currentCity, currencyOverride, addTask, updateTaskStatus, updateTaskAssignee, randomizeTasks } = useRoomiaStore();
  const t = translations[language] || translations.es;
  const defaultCurrency = getCityCurrency(currentCity);
  const activeCurrencyCode = currencyOverride || defaultCurrency.code;

  const [activeSubTab, setActiveSubTab] = useState('kanban'); // 'finances' or 'kanban'
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');

  // Task creation form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(mode === 'couple' ? 'Alex' : 'Asignado a ti');
  const [newTaskFreq, setNewTaskFreq] = useState('Semanal');

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;
    onAddExpense({
      desc: newDesc,
      amount: parseFloat(newAmount),
      paidBy: 'Alex',
      date: new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
    });
    setNewDesc('');
    setNewAmount('');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    addTask({
      id: Date.now(),
      title: newTaskTitle,
      assignee: newTaskAssignee,
      freq: newTaskFreq,
      status: 'todo',
      completed: false
    });
    setNewTaskTitle('');
  };

  const handleExportExpenses = () => {
    exportExpensesToCSV(expenses, currentCity, activeCurrencyCode);
  };

  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeChores = Array.isArray(chores) ? chores : [];

  const totalExpenseSum = safeExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const alexTotal = safeExpenses.filter(e => e.paidBy === 'Alex').reduce((sum, item) => sum + (item.amount || 0), 0);
  const partnerTotal = safeExpenses.filter(e => e.paidBy !== 'Alex').reduce((sum, item) => sum + (item.amount || 0), 0);
  const splitBalance = (alexTotal - partnerTotal) / 2;

  // Filter tasks into columns
  const todoTasks = safeChores.filter(c => (c.status || (c.completed ? 'done' : 'todo')) === 'todo');
  const inProgressTasks = safeChores.filter(c => c.status === 'in_progress');
  const doneTasks = safeChores.filter(c => (c.status || (c.completed ? 'done' : 'todo')) === 'done');

  return (
    <section className="tab-panel active">
      {/* 3D Hero Widget Banner */}
      <div className="hero-3d-banner">
        <div className="hero-3d-text">
          <h3>Finanzas Compartidas & Tareas del Hogar 💳</h3>
          <p>Gestiona cuentas claras en <span className="city-highlight">{currentCity} ({activeCurrencyCode})</span>, divide compras 50/50 y asigna tareas de convivencia.</p>
        </div>
        <img 
          src="/assets/roomia_finances_3d.jpg" 
          alt="Finances 3D Illustration" 
          className="hero-3d-img" 
        />
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', background: '#f1f5f9', padding: '6px', borderRadius: '9999px', width: 'fit-content' }}>
        <button 
          className={`btn btn-sm ${activeSubTab === 'kanban' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('kanban')}
          style={{ borderRadius: '9999px', border: 'none' }}
        >
          <i className="fa-solid fa-list-check"></i> Organizador de Tareas ({safeChores.length})
        </button>
        <button 
          className={`btn btn-sm ${activeSubTab === 'finances' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('finances')}
          style={{ borderRadius: '9999px', border: 'none' }}
        >
          <i className="fa-solid fa-wallet"></i> Registro de Gastos ({safeExpenses.length})
        </button>
      </div>

      {/* VIEW 1: ORGANIZADOR DE TAREAS */}
      {activeSubTab === 'kanban' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Form & AI Action Bar */}
          <div className="expense-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                <i className="fa-solid fa-plus-circle text-coral"></i> Agregar Nueva Tarea al Hogar
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={randomizeTasks} title="Sortear responsables equitativamente">
                <i className="fa-solid fa-dice text-indigo"></i> 🎲 Sortear Responsables
              </button>
            </div>

            <form onSubmit={handleAddTask} className="form-row" style={{ alignItems: 'flex-end' }}>
              <div className="form-group" style={{ margin: 0, flex: 2 }}>
                <label>Descripción de la Tarea</label>
                <input 
                  type="text" 
                  placeholder="Ej: Limpiar Baño Principal, Sacar Basura..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Responsable</label>
                <select value={newTaskAssignee} onChange={(e) => setNewTaskAssignee(e.target.value)}>
                  <option value="Alex">👤 Alex</option>
                  <option value="Sam">👤 Sam (Roomie/Pareja)</option>
                  <option value="Ambos">👥 Ambos Equitativo</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Frecuencia</label>
                <select value={newTaskFreq} onChange={(e) => setNewTaskFreq(e.target.value)}>
                  <option value="Diario">Diario</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Quincenal">Quincenal</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-sm" style={{ height: '42px' }}>
                <i className="fa-solid fa-plus"></i> Crear Tarea
              </button>
            </form>
          </div>

          {/* 3 Columns: Pendiente, En Progreso, Completado */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Column 1: PENDIENTES */}
            <div className="vault-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', minHeight: '350px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #cbd5e1', paddingBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  📌 Pendientes ({todoTasks.length})
                </h4>
                <span className="event-badge" style={{ background: '#e2e8f0', color: 'var(--text-muted)' }}>Por Hacer</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {todoTasks.map((task) => (
                  <div key={task.id} className="expense-item" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', flexDirection: 'column', alignItems: 'stretch', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{task.title}</strong>
                      <span className="event-badge" style={{ background: 'rgba(255, 107, 74, 0.12)', color: 'var(--primary)', fontSize: '0.75rem' }}>
                        {task.freq || 'Semanal'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem', borderTop: '1px dashed #f1f5f9' }}>
                      <select 
                        value={task.assignee} 
                        onChange={(e) => updateTaskAssignee(task.id, e.target.value)}
                        style={{ padding: '2px 6px', fontSize: '0.78rem', width: 'auto', borderRadius: '8px' }}
                      >
                        <option value="Alex">👤 Alex</option>
                        <option value="Sam">👤 Sam</option>
                        <option value="Ambos">👥 Ambos</option>
                      </select>

                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => updateTaskStatus(task.id, 'in_progress')}
                        style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                      >
                        Iniciar ⏳
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: EN PROGRESO */}
            <div className="vault-card" style={{ background: '#fffcf5', border: '1px solid #fde68a', minHeight: '350px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #f59e0b', paddingBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-amber)', margin: 0 }}>
                  ⏳ En Progreso ({inProgressTasks.length})
                </h4>
                <span className="event-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>Haciendo</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {inProgressTasks.map((task) => (
                  <div key={task.id} className="expense-item" style={{ background: '#ffffff', border: '1px solid #fef3c7', borderRadius: '16px', flexDirection: 'column', alignItems: 'stretch', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{task.title}</strong>
                      <span className="event-badge" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-amber)', fontSize: '0.75rem' }}>
                        {task.freq || 'Semanal'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem', borderTop: '1px dashed #f1f5f9' }}>
                      <select 
                        value={task.assignee} 
                        onChange={(e) => updateTaskAssignee(task.id, e.target.value)}
                        style={{ padding: '2px 6px', fontSize: '0.78rem', width: 'auto', borderRadius: '8px' }}
                      >
                        <option value="Alex">👤 Alex</option>
                        <option value="Sam">👤 Sam</option>
                        <option value="Ambos">👥 Ambos</option>
                      </select>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => updateTaskStatus(task.id, 'todo')} style={{ padding: '2px 6px', fontSize: '0.75rem' }}>
                          ← 📌
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={() => updateTaskStatus(task.id, 'done')} style={{ padding: '2px 6px', fontSize: '0.75rem' }}>
                          Completar ✅
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: COMPLETADAS */}
            <div className="vault-card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', minHeight: '350px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #10b981', paddingBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-emerald)', margin: 0 }}>
                  ✅ Completadas ({doneTasks.length})
                </h4>
                <span className="event-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>Listo</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {doneTasks.map((task) => (
                  <div key={task.id} className="expense-item" style={{ background: '#ffffff', border: '1px solid #dcfce7', borderRadius: '16px', flexDirection: 'column', alignItems: 'stretch', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{task.title}</strong>
                      <span className="event-badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', fontSize: '0.75rem' }}>
                        Listo
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem', borderTop: '1px dashed #f1f5f9' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Responsable: <strong>{task.assignee}</strong></span>
                      <button className="btn btn-secondary btn-sm" onClick={() => updateTaskStatus(task.id, 'in_progress')} style={{ padding: '2px 6px', fontSize: '0.75rem' }}>
                        Reabrir ⏳
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: REGISTRO DE GASTOS */}
      {activeSubTab === 'finances' && (
        <div className="expenses-layout">
          <div className="expense-card">
            <div className="card-title-bar">
              <h3><i className="fa-solid fa-file-invoice-dollar text-coral"></i> Registro de Gastos del Hogar ({activeCurrencyCode})</h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button className="btn btn-secondary btn-sm" onClick={handleExportExpenses} title="Exportar reporte de gastos en CSV">
                  <i className="fa-solid fa-file-csv text-emerald-500"></i> Exportar CSV
                </button>
                <span className="badge-mode-indicator">{mode === 'couple' ? '50/50 Equitativo' : 'Individual'}</span>
              </div>
            </div>

            <form onSubmit={handleAddExpense} className="add-item-bar">
              <input 
                type="text" 
                placeholder={t.expenseDescPlaceholder}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
              <input 
                type="number" 
                placeholder={activeCurrencyCode} 
                style={{ width: '130px' }}
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                <i className="fa-solid fa-plus"></i> {t.addExpenseBtn}
              </button>
            </form>

            <ul className="expense-list">
              {safeExpenses.map((exp, idx) => (
                <li key={idx} className="expense-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <i className="fa-solid fa-receipt text-indigo"></i>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.92rem' }}>{exp.desc}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pagado por {exp.paidBy || 'Alex'} • {exp.date || 'Hoy'}</span>
                    </div>
                  </div>
                  <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>
                    {(exp.amount || 0).toLocaleString('es-ES')} {activeCurrencyCode}
                  </strong>
                </li>
              ))}
            </ul>

            <div className="settlement-summary-box">
              <i className="fa-solid fa-scale-balanced text-xl"></i>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {t.totalExpenseLabel}: <strong>{totalExpenseSum.toLocaleString('es-ES')} {activeCurrencyCode}</strong>
                </div>
                <div>
                  {splitBalance > 0 
                    ? `Tu pareja/roomie te debe ${splitBalance.toLocaleString('es-ES')} ${activeCurrencyCode}` 
                    : splitBalance < 0 
                    ? `Debes a tu pareja/roomie ${Math.abs(splitBalance).toLocaleString('es-ES')} ${activeCurrencyCode}` 
                    : `Cuentas cuadradas al día (0 ${activeCurrencyCode} pendiente)`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
