import test from 'node:test';
import assert from 'node:assert';
import { SUPPORTED_CITIES, APP_NAME } from '../src/config/constants.js';
import { ContractAnalyzerService } from '../src/services/contract.service.js';

test('APP_NAME should be defined as RoomIA', () => {
  assert.strictEqual(APP_NAME, 'RoomIA');
});

test('SUPPORTED_CITIES should include Ciudad de México and Madrid', () => {
  assert.ok(SUPPORTED_CITIES.includes('Ciudad de México'));
  assert.ok(SUPPORTED_CITIES.includes('Madrid'));
});

test('ContractAnalyzerService should detect non-refundable deposit risk', async () => {
  const sampleContract = 'El depósito de garantía será no reembolsable en caso de cancelación anticipada.';
  const result = await ContractAnalyzerService.analyzeContractText(sampleContract);

  assert.strictEqual(result.riskLevel, 'HIGH');
  assert.strictEqual(result.score, 45);
  assert.ok(result.findings.some(f => f.type === 'DANGER'));
});

test('ContractAnalyzerService should return HIGH risk for privacy violations', async () => {
  const sampleContract = 'El propietario podrá realizar una inspección en cualquier momento sin previo aviso.';
  const result = await ContractAnalyzerService.analyzeContractText(sampleContract);

  assert.strictEqual(result.riskLevel, 'HIGH');
  assert.ok(result.findings.some(f => f.title.includes('Privacidad')));
});

test('ContractAnalyzerService should return SUCCESS for fair contract', async () => {
  const sampleContract = 'Contrato de arrendamiento estándar con depósito en garantía devuelto al finalizar el contrato.';
  const result = await ContractAnalyzerService.analyzeContractText(sampleContract);

  assert.strictEqual(result.riskLevel, 'LOW');
  assert.strictEqual(result.score, 95);
});
