import React, { useState } from 'react';
import { ContractAnalyzerModal } from './ContractAnalyzerModal';
import { useRoomiaStore } from '../store/useRoomiaStore';
import { translations } from '../config/i18n';

export function DocVault({ documents, currentCity, onAddDoc }) {
  const { language } = useRoomiaStore();
  const t = translations[language] || translations.es;

  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
  const [healthForm, setHealthForm] = useState({
    fullName: 'Alex Morgan',
    bloodType: 'O+',
    allergies: 'Penicilina, Polvo',
    emergencyContact: 'María Morgan (+52 55 1234 5678)'
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onAddDoc({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <section className="tab-panel active">
      <div className="panel-hero">
        <div className="hero-text">
          <h2><i className="fa-solid fa-folder-closed"></i> {t.vaultTitle}</h2>
          <p>{t.vaultSub}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAnalyzerOpen(true)}>
          <i className="fa-solid fa-shield-halved"></i> {t.analyzeContractBtn}
        </button>
      </div>

      <div className="vault-grid">
        <div className="vault-card">
          <div className="card-title-bar">
            <h3><i className="fa-solid fa-cloud-arrow-up text-coral"></i> {t.storedDocsTitle}</h3>
          </div>

          <label className="upload-dropzone" style={{ marginBottom: '1.25rem' }}>
            <i className="fa-solid fa-file-pdf text-3xl text-coral" style={{ marginBottom: '0.5rem', display: 'block' }}></i>
            <span style={{ fontWeight: 700, display: 'block' }}>Arrastra tus contratos (PDF/Imagen) o haz clic para subir</span>
            <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} accept=".pdf,image/*" />
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {documents.map((doc, idx) => (
              <div key={idx} className="expense-item" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                  <i className="fa-solid fa-file-pdf text-rose-500 text-xl" style={{ flexShrink: 0 }}></i>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{doc.size} • Guardado el {doc.date}</span>
                  </div>
                </div>
                <span className="event-badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', flexShrink: 0, marginLeft: '0.5rem' }}>
                  <i className="fa-solid fa-lock"></i> Encriptado
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="vault-card">
          <div className="card-title-bar">
            <h3><i className="fa-solid fa-heart-pulse text-rose-500"></i> {t.medCardTitle}</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => alert('Ficha Médica Exportada como PDF seguro.')}>
              <i className="fa-solid fa-download"></i> {t.exportCardBtn}
            </button>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>{t.fullNameLabel}</label>
              <input 
                type="text" 
                value={healthForm.fullName} 
                onChange={(e) => setHealthForm({ ...healthForm, fullName: e.target.value })} 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t.bloodLabel}</label>
                <input 
                  type="text" 
                  value={healthForm.bloodType} 
                  onChange={(e) => setHealthForm({ ...healthForm, bloodType: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>{t.allergiesLabel}</label>
                <input 
                  type="text" 
                  value={healthForm.allergies} 
                  onChange={(e) => setHealthForm({ ...healthForm, allergies: e.target.value })} 
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t.emergencyContactLabel}</label>
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
