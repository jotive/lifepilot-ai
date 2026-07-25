import React, { useState } from 'react';
import { ContractAnalyzerModal } from './ContractAnalyzerModal';

export function DocVault({ documents, currentCity, onAddDoc }) {
  const [medName, setMedName] = useState('Alex R. González');
  const [medBlood, setMedBlood] = useState('O+ Positive');
  const [medAllergies, setMedAllergies] = useState('Penicilina, Polvos');
  const [medContact, setMedContact] = useState('Sam M. (Roomie / Cel: 555-0192)');
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onAddDoc({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleExportMedicalCard = () => {
    const content = `
=== TARJETA DE EMERGENCIA PERSONAL (ROOMIA AI) ===
Nombre: ${medName}
Ciudad Actual: ${currentCity}
Tipo de Sangre: ${medBlood}
Alergias / Condiciones: ${medAllergies}
Contacto de Emergencia: ${medContact}
Generado en: ${new Date().toLocaleString()}
===================================================
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tarjeta_Emergencia_RoomIA_${medName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="tab-panel active">
      <div className="panel-hero">
        <div className="hero-text">
          <h2><i className="fa-solid fa-vault"></i> Bóveda de Documentos & Ficha de Salud</h2>
          <p>Guarda tus contratos, identificaciones y recibos en el navegador de forma segura (Offline & Encriptado Local).</p>
        </div>
        <button className="btn btn-gradient" onClick={() => setIsContractModalOpen(true)}>
          <i className="fa-solid fa-file-contract"></i> Analizar Contrato con IA
        </button>
      </div>

      <div className="vault-grid">
        <div className="vault-card">
          <div className="card-title-bar">
            <h3><i className="fa-solid fa-file-shield"></i> Bóveda de Documentos de Mudanza</h3>
          </div>

          <label className="upload-dropzone">
            <i className="fa-solid fa-cloud-arrow-up text-3xl"></i>
            <p>Arrastra tus contratos (PDF/Imagen) o haz clic para subir</p>
            <input type="file" onChange={handleFileUpload} hidden accept=".pdf,.png,.jpg,.jpeg" />
          </label>

          <div className="doc-list-wrap">
            <h4>Documentos Guardados en RoomIA</h4>
            <div className="doc-list">
              {documents.map((d, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }}>
                  <div>
                    <i className="fa-solid fa-file-pdf" style={{ color: 'var(--accent-rose)', marginRight: '0.5rem' }}></i>
                    <strong>{d.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.size} • Guardado el {d.date}</div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}><i className="fa-solid fa-lock"></i> Encriptado RoomIA</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="vault-card">
          <div className="card-title-bar">
            <h3><i className="fa-solid fa-id-card-clip"></i> Tarjeta de Emergencia Personal</h3>
            <button className="btn btn-secondary btn-sm" onClick={handleExportMedicalCard}>
              <i className="fa-solid fa-download"></i> Exportar Ficha
            </button>
          </div>

          <form className="medical-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Nombre Completo</label>
              <input type="text" value={medName} onChange={(e) => setMedName(e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Sangre</label>
                <input type="text" value={medBlood} onChange={(e) => setMedBlood(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Alergias / Condiciones</label>
                <input type="text" value={medAllergies} onChange={(e) => setMedAllergies(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Contacto de Emergencia en la Ciudad</label>
              <input type="text" value={medContact} onChange={(e) => setMedContact(e.target.value)} />
            </div>
          </form>
        </div>
      </div>

      <ContractAnalyzerModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
      />
    </section>
  );
}
