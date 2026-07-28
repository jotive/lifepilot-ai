import React, { useState } from 'react';
import { ContractAnalyzerModal } from './ContractAnalyzerModal';
import { useRoomiaStore } from '../store/useRoomiaStore';
import { useAuthStore } from '../store/useAuthStore';
import { translations } from '../config/i18n';
import { exportMedicalCardAsPNG, shareMedicalCardToWhatsApp } from '../utils/export.util';
import { encryptDocumentHash } from '../utils/crypto.util';

export function DocVault({ documents = [], currentCity, onAddDoc }) {
  const { language, removeDocument } = useRoomiaStore();
  const { user } = useAuthStore();
  const t = translations[language] || translations.es;

  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
  const [healthForm, setHealthForm] = useState({
    fullName: user?.name || 'Titular de la Cuenta',
    bloodType: 'O+',
    allergies: 'Ninguna conocida',
    emergencyContact: 'Contacto de Emergencia (+57 300 123 4567)'
  });

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
                onChange={(e) => setHealthForm({ ...healthForm, fullName: e.target.value })} 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{t.bloodLabel}</label>
                <input 
                  type="text" 
                  value={healthForm.bloodType} 
                  onChange={(e) => setHealthForm({ ...healthForm, bloodType: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{t.allergiesLabel}</label>
                <input 
                  type="text" 
                  value={healthForm.allergies} 
                  onChange={(e) => setHealthForm({ ...healthForm, allergies: e.target.value })} 
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{t.emergencyContactLabel}</label>
              <input 
                type="text" 
                value={healthForm.emergencyContact} 
                onChange={(e) => setHealthForm({ ...healthForm, emergencyContact: e.target.value })} 
              />
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
