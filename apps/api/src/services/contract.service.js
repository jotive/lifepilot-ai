import { LLMAdapterFactory } from '../adapters/llm/llmFactory.js';

export class ContractAnalyzerService {
  static async analyzeContractText(contractText) {
    const prompt = `
Analyze the following rental lease contract fragment and evaluate it for abusive clauses, unexpected fee increases, or tenant privacy violations.
Return a valid JSON object with keys:
- "riskLevel": "HIGH", "MEDIUM", or "LOW"
- "score": number between 0 and 100
- "findings": array of objects with keys "type" ("DANGER" | "WARNING" | "SUCCESS"), "title", "description", "recommendation"

Contract Fragment:
${contractText}
    `;

    const adapterResult = await LLMAdapterFactory.executeWithFallback(
      prompt, 
      'You are an expert real estate lawyer assistant. Return ONLY valid JSON.'
    );

    if (adapterResult && adapterResult.responseText) {
      try {
        const parsed = JSON.parse(adapterResult.responseText);
        return {
          riskLevel: parsed.riskLevel || 'LOW',
          score: parsed.score || 90,
          findings: parsed.findings || [],
          source: adapterResult.source,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.warn('[ContractAnalyzerService] Adapter response JSON parsing failed, using rule engine:', error.message);
      }
    }

    const textLower = contractText.toLowerCase();
    const findings = [];
    let riskLevel = 'LOW';

    if (textLower.includes('no reembolsable') || textLower.includes('non-refundable')) {
      findings.push({
        type: 'DANGER',
        title: 'Depósito No Reembolsable Detectado',
        description: 'Se identificó una cláusula que pretende retener el depósito de garantía de forma incondicional. En la mayoría de las legislaciones de arrendamiento esto es abusivo.',
        recommendation: 'Solicitar modificar la cláusula para que el depósito solo cubra daños verificados con inventario inicial.'
      });
      riskLevel = 'HIGH';
    }

    if (textLower.includes('incremento semestral') || textLower.includes('aumento de renta del 20%')) {
      findings.push({
        type: 'WARNING',
        title: 'Aumento de Renta Superior a la Inflación',
        description: 'Se detectó un incremento de alquiler por encima del índice de precios al consumidor (IPC).',
        recommendation: 'Negociar un tope de ajuste anual ligado estrictamente a la inflación oficial.'
      });
      if (riskLevel !== 'HIGH') riskLevel = 'MEDIUM';
    }

    if (textLower.includes('visitas sin previo aviso') || textLower.includes('inspección en cualquier momento')) {
      findings.push({
        type: 'DANGER',
        title: 'Violación de Privacidad del Inquilino',
        description: 'La cláusula permite al arrendador ingresar a la propiedad sin previo aviso de 24-48 horas.',
        recommendation: 'Exigir la notificación previa por escrito de al menos 48 horas para cualquier visita.'
      });
      riskLevel = 'HIGH';
    }

    if (findings.length === 0) {
      findings.push({
        type: 'SUCCESS',
        title: 'Contrato Estándar y Equitativo',
        description: 'No se detectaron cláusulas abusivas críticas en el texto analizado. Cumple con los estándares habituales de vivienda.',
        recommendation: 'Guardar copia cifrada en la bóveda de RoomIA para consulta futura.'
      });
    }

    return {
      riskLevel,
      score: riskLevel === 'HIGH' ? 45 : riskLevel === 'MEDIUM' ? 75 : 95,
      findings,
      source: 'local-rule-engine',
      timestamp: new Date().toISOString()
    };
  }
}
