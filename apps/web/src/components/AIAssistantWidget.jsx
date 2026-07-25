import React, { useState } from 'react';
import { useRoomiaStore } from '../store/useRoomiaStore';

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy tu Copiloto RoomIA. ¿En qué te puedo ayudar hoy con tu mudanza, alacena, gastos o planes en la ciudad?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { currentCity, mode, ingredients, expenses } = useRoomiaStore();

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let botResponse = `Entendido. Como tu roomie en ${currentCity}, te sugiero revisar las opciones de tu panel de control.`;

      const msgLower = userMsg.toLowerCase();
      if (msgLower.includes('receta') || msgLower.includes('cocinar') || msgLower.includes('comer')) {
        botResponse = `Revisando tu refrigerador con ${ingredients.length} ingredientes (${ingredients.slice(0, 3).join(', ')})... ¡Te recomiendo preparar un salteado rápido o saltear tus proteínas!`;
      } else if (msgLower.includes('gasto') || msgLower.includes('dinero') || msgLower.includes('deuda')) {
        const totalExp = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);
        botResponse = `Tienen ${expenses.length} gastos registrados por un total de $${totalExp.toFixed(2)} USD. ¿Quieres que sortee las tareas de limpieza hoy?`;
      } else if (msgLower.includes('mudanza') || msgLower.includes('renta') || msgLower.includes('contrato')) {
        botResponse = `Recuerda guardar la copia cifrada de tu contrato en la Bóveda de RoomIA y usar nuestro Agente de Análisis de Cláusulas antes de firmar en ${currentCity}.`;
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 999 }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1.4rem',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-glow)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <i className="fa-solid fa-robot text-lg"></i>
          <span>RoomIA Copilot</span>
        </button>
      ) : (
        <div
          style={{
            width: '350px',
            height: '460px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '1rem', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
              <i className="fa-solid fa-robot text-indigo-400"></i>
              <span>RoomIA Copilot AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
          </div>

          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: m.sender === 'user' ? 'var(--primary)' : 'var(--bg-dark)',
                  border: m.sender === 'user' ? 'none' : '1px solid var(--border-light)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <i className="fa-solid fa-spinner fa-spin"></i> RoomIA pensando...
              </div>
            )}
          </div>

          <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pregunta a tu Roomie AI..."
              style={{ flex: 1, padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
            />
            <button className="btn btn-primary btn-sm" onClick={handleSend}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
