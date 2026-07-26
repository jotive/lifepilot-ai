import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

export function AuthModal() {
  const { user, isAuthModalOpen, setIsAuthModalOpen, login, register, logout, updateProfile } = useAuthStore();
  const { addToast } = useToastStore();

  const [mode, setMode] = useState('login'); // 'login', 'register', 'profile'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email || !password) return;
      login(email, password);
      addToast('Sesión iniciada con éxito', 'success');
    } else if (mode === 'register') {
      if (!email || !password) return;
      register(name, email, password);
      addToast('¡Cuenta creada correctamente! Bienvenido a RoomIA', 'success');
    }
  };

  const handleLogout = () => {
    logout();
    addToast('Sesión cerrada', 'info');
  };

  return (
    <div className="modal-overlay active" onClick={() => setIsAuthModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h3>
            <i className="fa-solid fa-user-circle text-coral"></i>{' '}
            {user.isLoggedIn ? 'Mi Perfil de Usuario' : mode === 'login' ? 'Iniciar Sesión en RoomIA' : 'Crear Cuenta Nueva'}
          </h3>
          <button className="close-btn" onClick={() => setIsAuthModalOpen(false)}>&times;</button>
        </div>

        {user.isLoggedIn ? (
          <div style={{ padding: '1rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{user.name}</h4>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{user.email}</span>
                <div style={{ marginTop: '0.25rem' }}>
                  <span className="event-badge" style={{ background: 'rgba(255, 107, 74, 0.12)', color: 'var(--primary)' }}>{user.role}</span>
                </div>
              </div>
            </div>

            <button className="btn btn-secondary full-width" onClick={handleLogout} style={{ color: '#ef4444', borderColor: '#fca5a5' }}>
              <i className="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label>Nombre Completo</label>
                <input 
                  type="text" 
                  placeholder="Ej: Alex Morgan" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                placeholder="tu@correo.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>

            <button type="submit" className="btn btn-primary full-width" style={{ marginTop: '1rem' }}>
              <i className={mode === 'login' ? 'fa-solid fa-right-to-bracket' : 'fa-solid fa-user-plus'}></i>{' '}
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem' }}>
              {mode === 'login' ? (
                <span>¿No tienes cuenta? <button type="button" onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Regístrate gratis</button></span>
              ) : (
                <span>¿Ya tienes cuenta? <button type="button" onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Inicia sesión</button></span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
