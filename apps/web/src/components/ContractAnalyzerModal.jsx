import React, { useState } from 'react';

export function ContractAnalyzerModal({ isOpen, onClose }) {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setLoading(true);
  
    setTimeout(() => {
      const textLower = text.toLowerCase();
      const findings = [];
      let riskLevel = 'LOW';

      if (textLower.includes('no reembolsable') || textLower.includes('non-refundable') || textLower.includes('perderá el depósito')) {
        findings.push({
          type: 'DANGER',
          title: 'Depósito No Reembolsable Detectado',
          description: 'Cláusula potencialmente abusiva que pretende retener el depósito incondicionalmente.',
          recommendation: 'Solicitar aclaración por escrito de que el depósito se devuelve íntegro salvo daños comprobados.'
        });
        riskLevel = 'HIGH';
      }

      if (textLower.includes('incremento') || textLower.includes('aumento') || textLower.includes('reajuste')) {
        findings.push({
          type: 'WARNING',
          title: 'Cláusula de Reajuste de Renta',
          description: 'Se detectaron términos de ajuste periódico de precio de alquiler.',
          recommendation: 'Verificar que el aumento esté topeado al índice de inflación oficial.'
        });
        if (riskLevel !== 'HIGH') riskLevel = 'MEDIUM';
      }

      if (findings.length === 0) {
        findings.push({
          type: 'SUCCESS',
          title: 'Análisis Automático de Patrones Completo',
          description: 'No se detectaron términos o restricciones estándar de alerta inmediata.',
          recommendation: 'Revisar detenidamente las fechas de aviso de salida y condiciones de entrega del inmueble.'
        });
      }

      setAnalysis({
        riskLevel,
        score: riskLevel === 'HIGH' ? 45 : riskLevel === 'MEDIUM' ? 75 : 95,
        findings
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="modal-overlay active" style={{ zIndex: 9999 }}>
      <div className="modal-card" style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <h3><i className="fa-solid fa-file-contract"></i> Agente Analizador de Contratos de Arrendamiento</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {/* Prominent Legal Disclaimer Callout Box */}
          <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
            <i className="fa-solid fa-triangle-exclamation text-amber-500 text-lg" style={{ flexShrink: 0, marginTop: '2px' }}></i>
            <span style={{ fontSize: '0.8rem', color: '#9a3412', lineHeight: '1.4' }}>
              <strong>Aviso Legal Importante:</strong> Este análisis de IA es puramente orientativo y para detección de patrones comunes. No sustituye la asesoría legal profesional ni constituye dictamen jurídico.
            </span>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Pega el texto o fragmento de tu contrato de alquiler para que la IA de RoomIA detecte cláusulas abusivas, penalizaciones o riegos ocultos.
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Pega aquí las cláusulas de tu contrato de arrendamiento (Ej: Depósito de garantía, incrementos de renta, mantenimiento, rescisión anticipada)..."
            rows={5}
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              background: 'var(--bg-dark)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-main)',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              outline: 'none',
              resize: 'vertical',
              marginBottom: '1rem'
            }}
          />

          <button className="btn btn-gradient full-width" onClick={handleAnalyze} disabled={loading || !text.trim()}>
            {loading ? (
              <span><i className="fa-solid fa-spinner fa-spin"></i> Analizando Cláusulas...</span>
            ) : (
              <span><i className="fa-solid fa-magnifying-glass-chart"></i> Analizar Contrato con RoomIA</span>
            )}
          </button>

          {analysis && (
            <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Diagnóstico de Riesgo:</span>
                <span style={{
                  padding: '2px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  background: analysis.riskLevel === 'HIGH' ? 'rgba(244, 63, 94, 0.2)' : analysis.riskLevel === 'MEDIUM' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: analysis.riskLevel === 'HIGH' ? 'var(--accent-rose)' : analysis.riskLevel === 'MEDIUM' ? 'var(--accent-amber)' : 'var(--accent-emerald)'
                }}>
                  {analysis.riskLevel === 'HIGH' ? '🚨 RIESGO ALTO (45/100)' : analysis.riskLevel === 'MEDIUM' ? '⚠️ RIESGO MODERADO (75/100)' : '🟢 PATRÓN ESTÁNDAR (95/100)'}
                </span>
              </div>

              {analysis.findings.map((finding, idx) => (
                <div key={idx} style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', borderLeft: `4px solid ${finding.type === 'DANGER' ? 'var(--accent-rose)' : finding.type === 'WARNING' ? 'var(--accent-amber)' : 'var(--accent-emerald)'}` }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{finding.title}</div>
                  <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{finding.description}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    💡 Recomendación: {finding.recommendation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
