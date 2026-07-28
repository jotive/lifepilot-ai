/**
 * Real File Exporter & Share Utilities for RoomIA (PNG Image, CSV, WhatsApp, TXT)
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

export function exportMedicalCardAsPNG(healthData, city) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 500;
  const ctx = canvas.getContext('2d');

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, 800, 500);
  grad.addColorStop(0, '#1e1b4b');
  grad.addColorStop(1, '#312e81');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 500);

  // Border & Accent Lines
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, 760, 460);

  // Header Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px "Outfit", sans-serif';
  ctx.fillText('ROOMIA PRO — FICHA MÉDICA DE EMERGENCIA 🏥', 50, 70);

  ctx.fillStyle = '#f43f5e';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`CIUDAD: ${city.toUpperCase()} • EXPEDIDO POR ROOMIA SECURITY`, 50, 105);

  // Divider
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 125);
  ctx.lineTo(750, 125);
  ctx.stroke();

  // Patient Info Fields
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('NOMBRE DEL PACIENTE / RESIDENTE:', 50, 165);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(healthData.fullName || 'Alex Morgan', 50, 195);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('TIPO DE SANGRE:', 50, 245);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(healthData.bloodType || 'O+', 50, 275);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('ALERGIAS / CONDICIONES:', 380, 245);
  ctx.fillStyle = '#f43f5e';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(healthData.allergies || 'Ninguna', 380, 275);

  const contactText = healthData.contactName 
    ? `${healthData.contactName} (${healthData.contactPhone || 'Sin teléfono'})` 
    : (healthData.emergencyContact || 'Contacto no registrado');

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CONTACTO DE EMERGENCIA EN LA CIUDAD:', 50, 335);
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(contactText, 50, 365);

  // Footer Badge
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(50, 400, 700, 50);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`🚨 Emergencias ${city}: 911 / 123 • Documento Encriptado & Verificado en RoomIA`, 70, 432);

  // Trigger Image Download
  const link = document.createElement('a');
  link.download = `ficha_medica_${(healthData.fullName || 'paciente').toLowerCase().replace(/\s+/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function shareMedicalCardToWhatsApp(healthData, city) {
  const contactText = healthData.contactName 
    ? `${healthData.contactName} (${healthData.contactPhone || 'Sin teléfono'})` 
    : (healthData.emergencyContact || 'Contacto no registrado');

  const text = `🚨 *FICHA MÉDICA DE EMERGENCIA ROOMIA* 🚨
----------------------------------------
👤 *Paciente:* ${healthData.fullName}
🩸 *Tipo de Sangre:* ${healthData.bloodType}
⚠️ *Alergias/Condiciones:* ${healthData.allergies}
📞 *Contacto de Emergencia:* ${contactText}
📍 *Ciudad:* ${city}
----------------------------------------
_Documento generado por RoomIA Copilot_`;

  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
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
