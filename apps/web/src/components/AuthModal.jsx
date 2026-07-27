import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useRoomiaStore } from '../store/useRoomiaStore';
import { useToastStore } from '../store/useToastStore';
import { SUPPORTED_CITIES, getCityCurrency } from '../config/constants';

export function AuthModal() {
  const { user, isAuthModalOpen, setIsAuthModalOpen, login, register, logout, requestPasswordReset, confirmPasswordReset } = useAuthStore();
  const { currentCity, setCurrentCity, setCurrencyOverride, mode: appMode, setMode: setAppMode, clearUserDataForNewAccount } = useRoomiaStore();
  const { addToast } = useToastStore();

  const [formMode, setFormMode] = useState('login'); // 'login', 'register', or 'recover'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Recovery states
  const [recoverySent, setRecoverySent] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmittingRecovery, setIsSubmittingRecovery] = useState(false);
  const [recoveryDone, setRecoveryDone] = useState(false);

  // Account preference states
  const [selectedCity, setSelectedCity] = useState(currentCity || 'Ciudad de México');
  const [userMode, setUserMode] = useState(appMode || 'couple');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formMode === 'login') {
      if (!email || !password) return;
      login(email, password);
      addToast('Sesión iniciada con éxito', 'success');
    } else if (formMode === 'register') {
      if (!email || !password) return;
      register(name, email, password);
      clearUserDataForNewAccount(); // Clear sample data for fresh account
      setCurrentCity(selectedCity);
      const defaultCurr = getCityCurrency(selectedCity);
      setCurrencyOverride(defaultCurr.code);
      setAppMode(userMode);
      addToast(`¡Cuenta creada para ${name}! Configurado en ${selectedCity} (${userMode === 'couple' ? 'Roomies / Pareja' : 'Solo Expat'})`, 'success');
    }
  };

  const handleRequestRecovery = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Ingresa un correo electrónico válido', 'error');
      return;
    }
    setIsSubmittingRecovery(true);
    const res = await requestPasswordReset(email);
    setIsSubmittingRecovery(false);
    setRecoverySent(true);
    if (res?.resetToken) {
      setRecoveryToken(res.resetToken);
    }
    addToast('Enlace de recuperación generado', 'info');
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      addToast('La nueva contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    setIsSubmittingRecovery(true);
    await confirmPasswordReset(email, newPassword, recoveryToken);
    setIsSubmittingRecovery(false);
    setRecoveryDone(true);
    addToast('¡Contraseña restablecida! Ya puedes iniciar sesión', 'success');
  };

  const handleLogout = () => {
    logout();
    addToast('Sesión cerrada', 'info');
  };

  const resetRecoveryStates = () => {
    setRecoverySent(false);
    setRecoveryToken('');
    setNewPassword('');
    setRecoveryDone(false);
  };

  return (
    <div className="modal-overlay active" onClick={() => setIsAuthModalOpen(false)} style={{ zIndex: 99999 }}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '760px', 
          padding: 0, 
          overflow: 'hidden', 
          borderRadius: '28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
        }}
      >
        {/* Left Side Decorative Brand Panel */}
        <div style={{
          background: 'linear-gradient(135deg, #fff5f2 0%, #ffe8e0 100%)',
          padding: '2.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid #ffe2d9'
        }}>
          <div>
            <div className="logo-brand-wrap" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div className="logo-icon" style={{ width: '38px', height: '38px', fontSize: '1.1rem' }}>
                <i className="fa-solid fa-house-user"></i>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Room<span className="logo-highlight">IA</span> <span className="badge-ai" style={{ fontSize: '0.65rem' }}>PRO</span>
              </h2>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1.3', marginBottom: '0.75rem' }}>
              Tu Copiloto Inteligente de Convivencia & Ciudad
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Crea tu cuenta para guardar tus configuraciones de ciudad, finanzas 50/50 y bóveda de documentos de forma segura.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <img 
              src="/assets/roomia_hero_3d.jpg" 
              alt="RoomIA Brand Illustration" 
              style={{ width: '100%', maxWidth: '240px', borderRadius: '18px', boxShadow: '0 10px 25px rgba(255, 107, 74, 0.2)' }}
            />
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div style={{ padding: '2rem 2.25rem', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
              {user.isLoggedIn 
                ? 'Mi Perfil' 
                : formMode === 'login' 
                  ? 'Iniciar Sesión' 
                  : formMode === 'register' 
                    ? 'Crear Cuenta' 
                    : 'Recuperar Contraseña'}
            </h3>
            <button className="close-btn" onClick={() => setIsAuthModalOpen(false)} aria-label="Cerrar modal">&times;</button>
          </div>

          {user.isLoggedIn ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.4rem', fontWeight: 800 }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>{user.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</span>
                  <div style={{ marginTop: '0.25rem', display: 'flex', gap: '0.4rem' }}>
                    <span className="event-badge" style={{ background: 'rgba(255, 107, 74, 0.12)', color: 'var(--primary)' }}>
                      📍 {currentCity}
                    </span>
                    <span className="event-badge" style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--indigo)' }}>
                      {appMode === 'couple' ? '👥 Pareja' : '👤 Solo'}
                    </span>
                  </div>
                </div>
              </div>

              <button className="btn btn-secondary full-width" onClick={handleLogout} style={{ color: '#ef4444', borderColor: '#fca5a5' }}>
                <i className="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
              </button>
            </div>
          ) : (
            <div>
              {/* Form Mode Toggle Tabs */}
              <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '9999px', marginBottom: '1.25rem' }}>
                <button 
                  type="button" 
                  onClick={() => { setFormMode('login'); resetRecoveryStates(); }} 
                  style={{ flex: 1, border: 'none', background: formMode === 'login' ? '#ffffff' : 'transparent', color: formMode === 'login' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 800, fontSize: '0.83rem', padding: '0.45rem', borderRadius: '9999px', cursor: 'pointer', boxShadow: formMode === 'login' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s ease' }}
                >
                  Iniciar Sesión
                </button>
                <button 
                  type="button" 
                  onClick={() => { setFormMode('register'); resetRecoveryStates(); }} 
                  style={{ flex: 1, border: 'none', background: formMode === 'register' ? '#ffffff' : 'transparent', color: formMode === 'register' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 800, fontSize: '0.83rem', padding: '0.45rem', borderRadius: '9999px', cursor: 'pointer', boxShadow: formMode === 'register' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s ease' }}
                >
                  Crear Cuenta
                </button>
                <button 
                  type="button" 
                  onClick={() => { setFormMode('recover'); resetRecoveryStates(); }} 
                  style={{ flex: 1, border: 'none', background: formMode === 'recover' ? '#ffffff' : 'transparent', color: formMode === 'recover' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 800, fontSize: '0.83rem', padding: '0.45rem', borderRadius: '9999px', cursor: 'pointer', boxShadow: formMode === 'recover' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s ease' }}
                >
                  🔑 Recuperar
                </button>
              </div>

              {formMode === 'recover' ? (
                <div>
                  {!recoverySent ? (
                    <form onSubmit={handleRequestRecovery}>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.4' }}>
                        Ingresa el correo electrónico registrado con tu cuenta de RoomIA para recibir un enlace e instrucciones de recuperación.
                      </p>
                      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Correo Electrónico</label>
                        <input 
                          type="email" 
                          placeholder="tu@correo.com" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          required
                          style={{ padding: '0.65rem 0.9rem', fontSize: '0.85rem' }}
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={isSubmittingRecovery} 
                        className="btn btn-primary full-width" 
                        style={{ padding: '0.75rem', fontSize: '0.9rem' }}
                      >
                        <i className="fa-solid fa-paper-plane"></i> {isSubmittingRecovery ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                      </button>
                    </form>
                  ) : !recoveryDone ? (
                    <form onSubmit={handleConfirmReset}>
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.85rem', borderRadius: '14px', marginBottom: '1rem' }}>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#166534', lineHeight: '1.4' }}>
                          📩 <strong>¡Enlace de recuperación generado!</strong> Se envió una solicitud para <strong>{email}</strong>.
                        </p>
                      </div>

                      <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Código / Token de Seguridad</label>
                        <input 
                          type="text" 
                          value={recoveryToken} 
                          onChange={(e) => setRecoveryToken(e.target.value)} 
                          required
                          style={{ padding: '0.65rem 0.9rem', fontSize: '0.85rem', fontFamily: 'monospace' }}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Nueva Contraseña</label>
                        <input 
                          type="password" 
                          placeholder="Mínimo 6 caracteres" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)} 
                          required
                          style={{ padding: '0.65rem 0.9rem', fontSize: '0.85rem' }}
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmittingRecovery} 
                        className="btn btn-primary full-width" 
                        style={{ padding: '0.75rem', fontSize: '0.9rem', marginBottom: '0.6rem' }}
                      >
                        <i className="fa-solid fa-key"></i> {isSubmittingRecovery ? 'Restableciendo...' : 'Establecer Nueva Contraseña'}
                      </button>
                    </form>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 1rem auto' }}>
                        <i className="fa-solid fa-circle-check"></i>
                      </div>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 800 }}>¡Contraseña Restablecida!</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        Tu contraseña se ha actualizado correctamente. Ya puedes iniciar sesión con tus nuevas credenciales.
                      </p>
                      <button 
                        type="button" 
                        className="btn btn-primary full-width" 
                        onClick={() => { setFormMode('login'); resetRecoveryStates(); }}
                        style={{ padding: '0.75rem', fontSize: '0.9rem' }}
                      >
                        <i className="fa-solid fa-right-to-bracket"></i> Iniciar Sesión Ahora
                      </button>
                    </div>
                  )}

                  {!recoveryDone && (
                    <div style={{ textAlign: 'center', marginTop: '0.85rem' }}>
                      <button 
                        type="button" 
                        onClick={() => { setFormMode('login'); resetRecoveryStates(); }}
                        style={{ border: 'none', background: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        ← Volver a Iniciar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {formMode === 'register' && (
                    <>
                      <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Nombre Completo</label>
                        <input 
                          type="text" 
                          placeholder="Ej: Alex Morgan" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          required
                          style={{ padding: '0.65rem 0.9rem', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.85rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Ciudad</label>
                          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} style={{ padding: '0.65rem 0.6rem', fontSize: '0.82rem' }}>
                            {SUPPORTED_CITIES.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Convivencia</label>
                          <select value={userMode} onChange={(e) => setUserMode(e.target.value)} style={{ padding: '0.65rem 0.6rem', fontSize: '0.82rem' }}>
                            <option value="couple">👥 Roomies/Pareja</option>
                            <option value="solo">👤 Solo Expat</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Correo Electrónico</label>
                    <input 
                      type="email" 
                      placeholder="tu@correo.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required
                      style={{ padding: '0.65rem 0.9rem', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: formMode === 'login' ? '0.35rem' : '1.25rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Contraseña</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                        style={{ padding: '0.65rem 2.6rem 0.65rem 0.9rem', fontSize: '0.85rem', width: '100%' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                        aria-label="Ver contraseña"
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          padding: 0
                        }}
                      >
                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  {formMode === 'login' && (
                    <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                      <button 
                        type="button" 
                        onClick={() => { setFormMode('recover'); resetRecoveryStates(); }}
                        style={{ border: 'none', background: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, padding: 0 }}
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary full-width" style={{ padding: '0.75rem', fontSize: '0.9rem' }}>
                    <i className={formMode === 'login' ? 'fa-solid fa-right-to-bracket' : 'fa-solid fa-user-plus'}></i>{' '}
                    {formMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
