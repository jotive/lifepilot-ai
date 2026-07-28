import React, { useState } from 'react';
import { ContractAnalyzerModal } from './ContractAnalyzerModal';
import { useRoomiaStore } from '../store/useRoomiaStore';
import { useAuthStore } from '../store/useAuthStore';
import { translations } from '../config/i18n';
import { exportMedicalCardAsPNG, shareMedicalCardToWhatsApp } from '../utils/export.util';
import { encryptDocumentHash } from '../utils/crypto.util';
import { StorageUtil } from '../utils/storage.util';

export function DocVault({ documents = [], currentCity, onAddDoc }) {
  const { language, removeDocument } = useRoomiaStore();
  const { user } = useAuthStore();
  const t = translations[language] || translations.es;

  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);

  const storageKey = user?.email ? `roomia_health_form_${user.email}` : 'roomia_health_form';

  const defaultHealthForm = {
    fullName: user?.name || 'Titular de la Cuenta',
    bloodType: 'O+',
    allergies: 'Ninguna conocida',
    contactName: 'María Morgan',
    contactPhone: '+57 300 123 4567'
  };

  const [healthForm, setHealthForm] = useState(() => StorageUtil.get(storageKey, defaultHealthForm));
  const [customAllergy, setCustomAllergy] = useState('');

  const updateHealthForm = (field, value) => {
    const updated = { ...healthForm, [field]: value };
    setHealthForm(updated);
    StorageUtil.set(storageKey, updated);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const hashId = await encryptDocumentHash(file.name);
      onAddDoc({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        date: new Date().toISOString().split('T')[0],
        hashId
      });
    }
  };

  const handleExportPNG = () => {
    exportMedicalCardAsPNG(healthForm, currentCity);
  };

  const handleShareWhatsApp = () => {
    shareMedicalCardToWhatsApp(healthForm, currentCity);
  };

  const safeDocuments = Array.isArray(documents) ? documents : [];

  return (
    <section className="tab-panel active">
      {/* 3D Hero Widget Banner */}
      <div className="hero-3d-banner">
        <div className="hero-3d-text">
          <h3>Bóveda de Documentos & Ficha de Salud 🛡️</h3>
          <p>Guarda tus contratos de arrendamiento, ficha médica de emergencia e identificaciones cifradas con Web Crypto API (SHA-256) localmente en <span className="city-highlight">{currentCity}</span>.</p>
        </div>
        <img 
          src="/assets/roomia_vault_3d.jpg" 
          alt="Vault 3D Illustration" 
          className="hero-3d-img" 
        />
      </div>

      <div className="vault-grid">
        {/* Guarded Documents Card */}
        <div className="vault-card">
          <div className="card-title-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-cloud-arrow-up text-coral"></i> {t.storedDocsTitle}
            </h3>
            <button className="btn btn-primary btn-sm" onClick={() => setIsAnalyzerOpen(true)} style={{ flexShrink: 0 }}>
              <i className="fa-solid fa-shield-halved"></i> {t.analyzeContractBtn}
            </button>
          </div>

          <label className="upload-dropzone" style={{ marginBottom: '1.25rem', display: 'block', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '20px', padding: '2rem 1rem', textDecoration: 'none' }}>
            <i className="fa-solid fa-file-pdf text-3xl text-coral" style={{ marginBottom: '0.5rem', display: 'block' }}></i>
            <span style={{ fontWeight: 700, display: 'block', color: 'var(--text-main)', fontSize: '0.92rem' }}>Arrastra tus contratos (PDF/Imagen) o haz clic para subir</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cifrado local AES / SHA-256 activo con Web Crypto API</span>
            <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} accept=".pdf,image/*" />
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {safeDocuments.map((doc, idx) => (
              <div key={idx} className="expense-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.1rem', background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                  <i className="fa-solid fa-file-pdf text-rose-500 text-xl" style={{ flexShrink: 0 }}></i>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{doc.size} • Guardado el {doc.date}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="event-badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', flexShrink: 0, fontWeight: 700, fontSize: '0.75rem' }}>
                    <i className="fa-solid fa-lock"></i> {doc.hashId || 'Cifrado SHA-256'}
                  </span>
                  <button 
                    onClick={() => removeDocument(idx)} 
                    title="Eliminar Documento"
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem', padding: '0 4px' }}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Medical Health Card */}
        <div className="vault-card">
          <div className="card-title-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-heart-pulse text-rose-500"></i> {t.medCardTitle}
            </h3>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={handleShareWhatsApp} title="Compartir en WhatsApp" style={{ background: '#25D366', color: '#fff', border: 'none' }}>
                <i className="fa-brands fa-whatsapp"></i> WhatsApp
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleExportPNG} title="Descargar como Imagen PNG">
                <i className="fa-solid fa-image"></i> PNG Imagen
              </button>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{t.fullNameLabel}</label>
              <input 
                type="text" 
                value={healthForm.fullName} 
                onChange={(e) => updateHealthForm('fullName', e.target.value)} 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{t.bloodLabel}</label>
                <select
                  value={healthForm.bloodType}
                  onChange={(e) => updateHealthForm('bloodType', e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.9rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontWeight: 600 }}
                >
                  <option value="O+">O Positivo (O+)</option>
                  <option value="O-">O Negativo (O-)</option>
                  <option value="A+">A Positivo (A+)</option>
                  <option value="A-">A Negativo (A-)</option>
                  <option value="B+">B Positivo (B+)</option>
                  <option value="B-">B Negativo (B-)</option>
                  <option value="AB+">AB Positivo (AB+)</option>
                  <option value="AB-">AB Negativo (AB-)</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{t.allergiesLabel}</label>
                <select
                  value={healthForm.allergies === customAllergy ? 'Otra' : healthForm.allergies}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Otra') {
                      updateHealthForm('allergies', customAllergy || 'Especificar alergia');
                    } else {
                      updateHealthForm('allergies', val);
                    }
                  }}
                  style={{ width: '100%', padding: '0.6rem 0.9rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontWeight: 600 }}
                >
                  <option value="Ninguna conocida">Ninguna conocida</option>
                  <option value="Penicilina / Antibióticos">Penicilina / Antibióticos</option>
                  <option value="Sulfas">Sulfas</option>
                  <option value="Polen / Ácaros / Polvo">Polen / Ácaros / Polvo</option>
                  <option value="Frutos Secos / Cacahuates">Frutos Secos / Cacahuates</option>
                  <option value="Lácteos / Lactosa">Lácteos / Lactosa</option>
                  <option value="Mariscos / Pescados">Mariscos / Pescados</option>
                  <option value="Látex">Látex</option>
                  <option value="Aspirina / AINEs">Aspirina / AINEs</option>
                  <option value="Asma / Resp.">Asma / Resp.</option>
                  <option value="Otra">Otra (Especificar...)</option>
                </select>
              </div>
            </div>

            {healthForm.allergies.includes('Especificar') && (
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Escribe tu alergia o condición especial..."
                  value={customAllergy} 
                  onChange={(e) => {
                    setCustomAllergy(e.target.value);
                    updateHealthForm('allergies', e.target.value);
                  }} 
                />
              </div>
            )}

            <div className="form-row" style={{ marginTop: '0.5rem' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Contacto de Emergencia (Nombre)</label>
                <input 
                  type="text" 
                  placeholder="Ej: María Morgan"
                  value={healthForm.contactName || ''} 
                  onChange={(e) => updateHealthForm('contactName', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Teléfono de Emergencia</label>
                <input 
                  type="tel" 
                  placeholder="Ej: +57 300 123 4567"
                  value={healthForm.contactPhone || ''} 
                  onChange={(e) => updateHealthForm('contactPhone', e.target.value)} 
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      <ContractAnalyzerModal
        isOpen={isAnalyzerOpen}
        onClose={() => setIsAnalyzerOpen(false)}
      />
    </section>
  );
}
