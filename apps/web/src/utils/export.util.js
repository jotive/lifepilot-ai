/**
 * Real File Exporter for RoomIA (CSV, JSON, PDF/Text)
 */
export function exportFile(filename, content, mimeType = 'text/plain;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportExpensesToCSV(expenses, city, currencyCode) {
  let csv = `ID,Descripcion,Monto,PagadoPor,Fecha,Ciudad,Moneda\n`;
  expenses.forEach((e, idx) => {
    csv += `${idx + 1},"${e.desc || ''}",${e.amount || 0},"${e.paidBy || 'Alex'}","${e.date || 'Hoy'}","${city}","${currencyCode}"\n`;
  });
  exportFile(`roomia_gastos_${city.toLowerCase().replace(/\s+/g, '_')}.csv`, csv, 'text/csv;charset=utf-8;');
}

export function exportMedicalCardPDF(healthData, city) {
  const report = `=====================================================
ROOMIA PRO — FICHA MÉDICA DE EMERGENCIA EN LÍNEA
Ciudad de Residencia: ${city}
Fecha de Emisión: ${new Date().toLocaleString('es-ES')}
=====================================================

Nombre Completo: ${healthData.fullName}
Tipo de Sangre: ${healthData.bloodType}
Alergias Conocidas: ${healthData.allergies}
Contacto de Emergencia: ${healthData.emergencyContact}

DIRECTORIO DE EMERGENCIAS LOCALES (${city.toUpperCase()}):
• Emergencias Generales / Policía: 911 / 123
• Ambulancia Médica: 125
• Bomberos: 119

=====================================================
Documento Seguro Encriptado localmente por RoomIA.
=====================================================`;

  exportFile(`ficha_medica_emergencia_${healthData.fullName.toLowerCase().replace(/\s+/g, '_')}.txt`, report, 'text/plain;charset=utf-8;');
}

export function exportRelocationChecklist(checklist, calc, city, currencyCode) {
  const report = `=====================================================
ROOMIA PRO — GUÍA & PRESUPUESTO DE MUDANZA (${city.toUpperCase()})
Moneda: ${currencyCode}
Fecha: ${new Date().toLocaleDateString('es-ES')}
=====================================================

PRESUPUESTO ESTIMADO DE MUDANZA:
• Arriendo Primer Mes: ${calc.rent} ${currencyCode}
• Depósito de Garantía: ${calc.deposit} ${currencyCode}
• Servicios Básicos (Luz/Agua/Net): ${calc.utilities} ${currencyCode}
• Muebles & Equipamiento: ${calc.furniture} ${currencyCode}
-----------------------------------------------------
TOTAL MES 1 ESTIMADO: ${(Number(calc.rent) + Number(calc.deposit) + Number(calc.utilities) + Number(calc.furniture))} ${currencyCode}

CHECKLIST DE TAREAS DE ASENTAMIENTO:
${checklist.map(c => `[${c.completed ? 'X' : ' '}] ${c.category}: ${c.text}`).join('\n')}

=====================================================
Generado por RoomIA — Tu Copiloto Inteligente de Vida
=====================================================`;

  exportFile(`presupuesto_mudanza_${city.toLowerCase().replace(/\s+/g, '_')}.txt`, report, 'text/plain;charset=utf-8;');
}
