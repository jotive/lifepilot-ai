import React, { useState } from 'react';
import { useRoomiaStore } from '../store/useRoomiaStore';
import { useAuthStore } from '../store/useAuthStore';
import { translations } from '../config/i18n';
import { getCityCurrency, formatMoney } from '../config/constants';
import { exportExpensesToCSV } from '../utils/export.util';

export function HouseholdOps({ expenses = [], chores = [], mode, onAddExpense, onToggleChore }) {
  const { language, currentCity, currencyOverride, addTask, removeTask, removeExpense, updateTaskStatus, updateTaskAssignee, randomizeTasks } = useRoomiaStore();
  const { user } = useAuthStore();

  const userName = user?.isLoggedIn && user?.name ? user.name : 'Tú';
  const partnerName = mode === 'couple' ? 'Mi Roomie / Pareja' : 'Compañero';

  const t = translations[language] || translations.es;
  const defaultCurrency = getCityCurrency(currentCity);
  const activeCurrencyCode = currencyOverride || defaultCurrency.code;
  const currencySymbol = defaultCurrency.symbol;

  const [activeSubTab, setActiveSubTab] = useState('kanban');
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // Task creation form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(userName);
  const [newTaskFreq, setNewTaskFreq] = useState('Semanal');

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;
    onAddExpense({
      desc: newDesc,
      amount: parseFloat(newAmount),
      paidBy: userName,
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

  // Drag and Drop handlers
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', String(taskId));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const id = draggedTaskId || Number(e.dataTransfer.getData('text/plain'));
    if (id) {
      updateTaskStatus(id, targetStatus);
      setDraggedTaskId(null);
    }
  };

  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeChores = Array.isArray(chores) ? chores : [];

  const totalExpenseSum = safeExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const userTotal = safeExpenses.filter(e => e.paidBy === userName || e.paidBy === 'Tú').reduce((sum, item) => sum + (item.amount || 0), 0);
  const partnerTotal = safeExpenses.filter(e => e.paidBy !== userName && e.paidBy !== 'Tú').reduce((sum, item) => sum + (item.amount || 0), 0);
  const splitBalance = (userTotal - partnerTotal) / 2;

  // Filter tasks into columns
  const todoTasks = safeChores.filter(c => (c.status || (c.completed ? 'done' : 'todo')) === 'todo');
  const inProgressTasks = safeChores.filter(c => c.status === 'in_progress');
  const doneTasks = safeChores.filter(c => (c.status || (c.completed ? 'done' : 'todo')) === 'done');

  return (
    <section className="tab-panel active">
      {/* 3D Hero Widget Banner with Lazy Loading */}
      <div className="hero-3d-banner">
        <div className="hero-3d-text">
          <h3>Finanzas Compartidas & Tareas del Hogar 💳</h3>
          <p>Gestiona cuentas claras en <span className="city-highlight">{currentCity} ({activeCurrencyCode})</span>, divide compras 50/50 y asigna tareas de convivencia.</p>
        </div>
        <img 
          src="/assets/roomia_finances_3d.jpg" 
          alt="Finances 3D Illustration" 
          className="hero-3d-img" 
          loading="lazy"
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

      {/* VIEW 1: ORGANIZADOR DE TAREAS (DRAG & DROP) */}
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
                  <option value={userName}>👤 {userName} (Tú)</option>
                  <option value={partnerName}>👤 {partnerName}</option>
                  <option value="Ambos Equitativo">👥 Ambos Equitativo</option>
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

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            💡 <em>Tip: Puedes arrastrar y soltar cualquier tarjeta entre las columnas para actualizar su estado.</em>
          </p>

          {/* 3 Columns: Pendiente, En Progreso, Completado */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Column 1: PENDIENTES */}
            <div 
              className="vault-card" 
              style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', minHeight: '380px' }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'todo')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #cbd5e1', paddingBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  📌 Por Hacer ({todoTasks.length})
                </h4>
                <span className="event-badge" style={{ background: '#e2e8f0', color: 'var(--text-muted)' }}>Arrastra aquí</span>
              </div>

              {todoTasks.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Sin tareas pendientes. ¡Crea una nueva tarea arriba!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {todoTasks.map((task) => (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="expense-item" 
                      style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', flexDirection: 'column', alignItems: 'stretch', gap: '0.6rem', cursor: 'grab', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{task.title}</strong>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <span className="event-badge" style={{ background: 'rgba(255, 107, 74, 0.12)', color: 'var(--primary)', fontSize: '0.75rem' }}>
                            {task.freq || 'Semanal'}
                          </span>
                          <button onClick={() => removeTask(task.id)} title="Eliminar Tarea" aria-label="Eliminar Tarea" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem', padding: '0 4px' }}>&times;</button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem', borderTop: '1px dashed #f1f5f9' }}>
                        <select 
                          value={task.assignee} 
                          onChange={(e) => updateTaskAssignee(task.id, e.target.value)}
                          aria-label="Cambiar Responsable"
                          style={{ padding: '2px 6px', fontSize: '0.78rem', width: 'auto', borderRadius: '8px' }}
                        >
                          <option value={userName}>👤 {userName} (Tú)</option>
                          <option value={partnerName}>👤 {partnerName}</option>
                          <option value="Ambos Equitativo">👥 Ambos Equitativo</option>
                        </select>

                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => updateTaskStatus(task.id, 'in_progress')}
                          aria-label="Iniciar Tarea"
                          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        >
                          Iniciar ⏳
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: EN PROGRESO */}
            <div 
              className="vault-card" 
              style={{ background: '#fffcf5', border: '2px dashed #fde68a', minHeight: '380px' }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'in_progress')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #f59e0b', paddingBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-amber)', margin: 0 }}>
                  ⏳ Haciendo ({inProgressTasks.length})
                </h4>
                <span className="event-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>Arrastra aquí</span>
              </div>

              {inProgressTasks.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Ninguna tarea en progreso actualmente.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {inProgressTasks.map((task) => (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="expense-item" 
                      style={{ background: '#ffffff', border: '1px solid #fef3c7', borderRadius: '16px', flexDirection: 'column', alignItems: 'stretch', gap: '0.6rem', cursor: 'grab', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{task.title}</strong>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <span className="event-badge" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-amber)', fontSize: '0.75rem' }}>
                            {task.freq || 'Semanal'}
                          </span>
                          <button onClick={() => removeTask(task.id)} title="Eliminar Tarea" aria-label="Eliminar Tarea" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem', padding: '0 4px' }}>&times;</button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem', borderTop: '1px dashed #f1f5f9' }}>
                        <select 
                          value={task.assignee} 
                          onChange={(e) => updateTaskAssignee(task.id, e.target.value)}
                          aria-label="Cambiar Responsable"
                          style={{ padding: '2px 6px', fontSize: '0.78rem', width: 'auto', borderRadius: '8px' }}
                        >
                          <option value={userName}>👤 {userName} (Tú)</option>
                          <option value={partnerName}>👤 {partnerName}</option>
                          <option value="Ambos Equitativo">👥 Ambos Equitativo</option>
                        </select>

                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => updateTaskStatus(task.id, 'todo')} aria-label="Regresar a Por Hacer" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                            ← Por Hacer
                          </button>
                          <button className="btn btn-primary btn-sm" onClick={() => updateTaskStatus(task.id, 'done')} aria-label="Completar Tarea" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                            Completar ✅
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 3: COMPLETADAS */}
            <div 
              className="vault-card" 
              style={{ background: '#f0fdf4', border: '2px dashed #bbf7d0', minHeight: '380px' }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'done')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #10b981', paddingBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-emerald)', margin: 0 }}>
                  ✅ Listo ({doneTasks.length})
                </h4>
                <span className="event-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>Arrastra aquí</span>
              </div>

              {doneTasks.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Aún no hay tareas completadas.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {doneTasks.map((task) => (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="expense-item" 
                      style={{ background: '#ffffff', border: '1px solid #dcfce7', borderRadius: '16px', flexDirection: 'column', alignItems: 'stretch', gap: '0.6rem', cursor: 'grab', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{task.title}</strong>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <span className="event-badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', fontSize: '0.75rem' }}>
                            Listo
                          </span>
                          <button onClick={() => removeTask(task.id)} title="Eliminar Tarea" aria-label="Eliminar Tarea" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem', padding: '0 4px' }}>&times;</button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem', borderTop: '1px dashed #f1f5f9' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Responsable: <strong>{task.assignee}</strong></span>
                        <button className="btn btn-secondary btn-sm" onClick={() => updateTaskStatus(task.id, 'in_progress')} aria-label="Reabrir Tarea" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                          Reabrir ⏳
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                placeholder={`${currencySymbol} ${activeCurrencyCode}`} 
                style={{ width: '150px' }}
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                <i className="fa-solid fa-plus"></i> {t.addExpenseBtn}
              </button>
            </form>

            {safeExpenses.length === 0 ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1', margin: '1rem 0' }}>
                <i className="fa-solid fa-receipt text-3xl text-coral" style={{ marginBottom: '0.75rem', display: 'block' }}></i>
                <h4 style={{ fontWeight: 800, margin: 0 }}>Aún no hay gastos registrados</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Agrega tu primer gasto del hogar arriba (ej: Supermercado o Internet) para ver la división 50/50 en tiempo real.
                </p>
              </div>
            ) : (
              <ul className="expense-list">
                {safeExpenses.map((exp, idx) => (
                  <li key={idx} className="expense-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <i className="fa-solid fa-receipt text-indigo"></i>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.92rem' }}>{exp.desc}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pagado por {exp.paidBy || userName} • {exp.date || 'Hoy'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>
                        {currencySymbol}{formatMoney(exp.amount, activeCurrencyCode)} {activeCurrencyCode}
                      </strong>
                      <button 
                        onClick={() => removeExpense(idx)} 
                        title="Eliminar Gasto"
                        aria-label="Eliminar Gasto"
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem', padding: '0 4px' }}
                      >
                        &times;
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="settlement-summary-box">
              <i className="fa-solid fa-scale-balanced text-xl"></i>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {t.totalExpenseLabel}: <strong>{currencySymbol}{formatMoney(totalExpenseSum, activeCurrencyCode)} {activeCurrencyCode}</strong>
                </div>
                <div>
                  {splitBalance > 0 
                    ? `Tu pareja/roomie te debe ${currencySymbol}${formatMoney(splitBalance, activeCurrencyCode)} ${activeCurrencyCode}` 
                    : splitBalance < 0 
                    ? `Debes a tu pareja/roomie ${currencySymbol}${formatMoney(Math.abs(splitBalance), activeCurrencyCode)} ${activeCurrencyCode}` 
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
