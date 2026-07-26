import React from 'react';

export function NotFoundPage() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '500px', background: '#ffffff', padding: '3rem 2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1, marginBottom: '0.5rem' }}>
          404
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          Página no encontrada
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.75rem' }}>
          La ruta que intentas visitar no existe o fue movida. Regresa al Radar Urbano o navega usando el menú lateral.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <a href="#/explorer" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <i className="fa-solid fa-compass"></i> Ir al Explorer
          </a>
          <a href="#/" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            <i className="fa-solid fa-house"></i> Ir a la Landing Page
          </a>
        </div>
      </div>
    </div>
  );
}
