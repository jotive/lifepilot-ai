import React, { useState } from 'react';
import { useRoomiaStore } from '../store/useRoomiaStore';
import { translations } from '../config/i18n';

export function HouseholdOps({ expenses, chores, mode, onAddExpense, onToggleChore }) {
  const { language } = useRoomiaStore();
  const t = translations[language] || translations.es;

  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');

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

  const totalExpenseSum = expenses.reduce((sum, item) => sum + item.amount, 0);
  const alexTotal = expenses.filter(e => e.paidBy === 'Alex').reduce((sum, item) => sum + item.amount, 0);
  const partnerTotal = expenses.filter(e => e.paidBy !== 'Alex').reduce((sum, item) => sum + item.amount, 0);
  const splitBalance = (alexTotal - partnerTotal) / 2;

  return (
    <section className="tab-panel active">
      {/* 3D Hero Widget Banner */}
      <div className="hero-3d-banner">
        <div className="hero-3d-text">
          <h3>{t.financesTitle} 💳</h3>
          <p>{t.financesSub} ({mode === 'couple' ? 'Modo Pareja / Roomies Activo' : 'Modo Individual'}).</p>
        </div>
        <img 
          src="/assets/roomia_finances_3d.jpg" 
          alt="Finances 3D Illustration" 
          className="hero-3d-img" 
        />
      </div>

      <div className="expenses-layout">
        <div className="expense-card">
          <div className="card-title-bar">
            <h3><i className="fa-solid fa-file-invoice-dollar text-coral"></i> {t.splitTitle}</h3>
            <span className="badge-mode-indicator">{mode === 'couple' ? '50/50 Equitativo' : 'Individual'}</span>
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
              placeholder="$ USD" 
              style={{ width: '110px' }}
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <i className="fa-solid fa-plus"></i> {t.addExpenseBtn}
            </button>
          </form>

          <ul className="expense-list">
            {expenses.map((exp, idx) => (
              <li key={idx} className="expense-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <i className="fa-solid fa-receipt text-indigo"></i>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.92rem' }}>{exp.desc}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pagado por {exp.paidBy} • {exp.date}</span>
                  </div>
                </div>
                <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>${exp.amount.toFixed(2)} USD</strong>
              </li>
            ))}
          </ul>

          <div className="settlement-summary-box">
            <i className="fa-solid fa-scale-balanced text-xl"></i>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.totalExpenseLabel}: <strong>${totalExpenseSum.toFixed(2)} USD</strong></div>
              <div>
                {splitBalance > 0 
                  ? `Tu pareja/roomie te debe $${splitBalance.toFixed(2)} USD` 
                  : splitBalance < 0 
                  ? `Debes a tu pareja/roomie $${Math.abs(splitBalance).toFixed(2)} USD` 
                  : 'Cuentas cuadradas al día (0.00 USD pendiente)'}
              </div>
            </div>
          </div>
        </div>

        <div className="expense-card">
          <div className="card-title-bar">
            <h3><i className="fa-solid fa-broom text-amber-500"></i> {t.choresTitle}</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {chores.map((chore) => (
              <div key={chore.id} className="expense-item" style={{ cursor: 'pointer' }} onClick={() => onToggleChore(chore.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input 
                    type="checkbox" 
                    checked={chore.completed} 
                    onChange={() => {}} 
                    style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                  />
                  <div>
                    <strong style={{ display: 'block', textDecoration: chore.completed ? 'line-through' : 'none', color: chore.completed ? 'var(--text-muted)' : 'var(--text-main)' }}>
                      {chore.title}
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Asignado a: <strong>{chore.assignee}</strong> • Frecuencia: {chore.freq}</span>
                  </div>
                </div>
                <span className="event-badge" style={{ background: chore.completed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)', color: chore.completed ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                  {chore.completed ? 'Completado' : 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
