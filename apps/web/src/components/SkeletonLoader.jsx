import React from 'react';

export function SkeletonLoader({ count = 3 }) {
  return (
    <div className="events-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.25rem', height: '160px', opacity: 0.6, animation: 'pulse 1.5s infinite ease-in-out' }}>
          <div style={{ width: '40%', height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '1rem' }}></div>
          <div style={{ width: '80%', height: '20px', background: 'rgba(255,255,255,0.15)', borderRadius: '4px', marginBottom: '0.75rem' }}></div>
          <div style={{ width: '100%', height: '14px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}></div>
        </div>
      ))}
    </div>
  );
}
