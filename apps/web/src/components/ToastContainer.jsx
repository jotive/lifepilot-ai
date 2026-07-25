import React from 'react';
import { useToastStore } from '../store/useToastStore';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1.25rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            color: '#fff',
            fontSize: '0.9rem',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <i className={toast.type === 'success' ? 'fa-solid fa-circle-check text-emerald-400' : 'fa-solid fa-circle-info text-cyan-400'}></i>
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '0.5rem' }}>&times;</button>
        </div>
      ))}
    </div>
  );
}
