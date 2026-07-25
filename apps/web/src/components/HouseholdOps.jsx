import React, { useState } from 'react';

export function HouseholdOps({ mode, expenses, tasks, onAddExpense, onRandomizeTasks }) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('Roomie 1');
  const [split, setSplit] = useState('50-50');

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (desc.trim() && !isNaN(parsedAmount) && parsedAmount > 0) {
      onAddExpense({ id: Date.now(), desc: desc.trim(), amount: parsedAmount, payer, split });
      setDesc('');
      setAmount('');
    }
  };

  const calculateSettlement = () => {
    if (mode === 'solo') {
      const total = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      return `Gasto Personal Total del Mes: $${total.toFixed(2)} USD`;
    }

    let p1Paid = 0;
    let p2Paid = 0;

    expenses.forEach(item => {
      const amt = parseFloat(item.amount);
      if (item.payer === 'Roomie 1') p1Paid += amt;
      else p2Paid += amt;
    });

    const diff = (p1Paid - p2Paid) / 2;

    if (Math.abs(diff) < 0.01) {
      return 'Cuentas al día (Sin deudas pendientes)';
    } else if (diff > 0) {
      return `Roomie 2 (Sam) le debe $${diff.toFixed(2)} USD a Roomie 1 (Alex)`;
    } else {
      return `Roomie 1 (Alex) le debe $${Math.abs(diff).toFixed(2)} USD a Roomie 2 (Sam)`;
    }
  };

  return (
    <section className="tab-panel active">
      <div className="panel-hero">
        <div className="hero-text">
          <h2><i className="fa-solid fa-scale-balanced"></i> Finanzas & Convivencia en Pareja / Roomies</h2>
          <p>Calculadora transparente de gastos compartidos y asignador equitativo de tareas del hogar.</p>
        </div>
      </div>

      <div className="expenses-layout">
        <div className="expense-card">
          <div className="card-title-bar">
            <h3><i className="fa-solid fa-receipt"></i> Registro & División de Gastos</h3>
          </div>

          <form className="expense-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Descripción del Gasto</label>
                <input 
                  type="text" 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Ej: Compra de supermercado, Pago de luz..." 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Monto ($)</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00" 
                  step="0.01" 
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Pagado por</label>
                <select value={payer} onChange={(e) => setPayer(e.target.value)}>
                  <option value="Roomie 1">Roomie 1 (Alex)</option>
                  <option value="Roomie 2">Roomie 2 (Sam)</option>
                </select>
              </div>
              <div className="form-group">
                <label>División</label>
                <select value={split} onChange={(e) => setSplit(e.target.value)}>
                  <option value="50-50">50% / 50% Equitativo</option>
                  <option value="proportional">Proporcional por Ingreso</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary full-width">
              <i className="fa-solid fa-plus-circle"></i> Agregar Gasto Compartido
            </button>
          </form>

          <div className="expense-list-wrap">
            <h4>Historial Reciente</h4>
            <ul className="expense-list">
              {expenses.map(exp => (
                <li key={exp.id} className="expense-item">
                  <div>
                    <strong>{exp.desc}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pagado por: {exp.payer} ({exp.split})</div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>${parseFloat(exp.amount).toFixed(2)}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="settlement-summary-box">
            <i className="fa-solid fa-hand-holding-dollar"></i>
            <div className="summary-info">
              <span>Estado de Cuentas:</span>
              <strong>{calculateSettlement()}</strong>
            </div>
          </div>
        </div>

        <div className="expense-card">
          <div className="card-title-bar">
            <h3><i className="fa-solid fa-rotate-left"></i> TaskWheel: Sorteo de Tareas del Hogar</h3>
            <button className="btn btn-secondary btn-sm" onClick={onRandomizeTasks}>
              <i className="fa-solid fa-dice"></i> Sortear Tareas
            </button>
          </div>
          <p className="card-subtitle">Organizador semanal de RoomIA para evitar desacuerdos de limpieza y cocina:</p>

          <div className="tasks-list">
            {tasks.map((t, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }}>
                <span><i className="fa-solid fa-check-double text-xs" style={{ color: 'var(--accent-cyan)' }}></i> {t.name}</span>
                <span className="badge-mode-indicator">{t.assigned}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
