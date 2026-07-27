import React, { useState, useRef, useEffect } from 'react';
import { useRoomiaStore } from '../store/useRoomiaStore';
import { useAuthStore } from '../store/useAuthStore';
import { ApiService } from '../services/api.service';

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: '¡Hola! 🤖 Soy tu Copiloto RoomIA PRO. ¿En qué te puedo ayudar hoy con tu alacena, gastos 50/50, mudanza o planes en la ciudad?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const { currentCity, mode, ingredients, expenses } = useRoomiaStore();
  const { user } = useAuthStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customText = null) => {
    const textToSend = (customText || input).trim();
    if (!textToSend) return;

    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    if (!customText) setInput('');
    setLoading(true);

    const msgLower = textToSend.toLowerCase();

    // 1. If asking about recipes or food
    if (msgLower.includes('cocin') || msgLower.includes('receta') || msgLower.includes('comid') || msgLower.includes('hambre') || msgLower.includes('ingredien')) {
      try {
        const res = await ApiService.generateRecipes([textToSend, ...ingredients], mode, 'es');
        if (res && res.recipes && res.recipes[0]) {
          const recipe = res.recipes[0];
          const stepsText = Array.isArray(recipe.steps) 
            ? recipe.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')
            : (recipe.description || 'Picar ingredientes y saltear a fuego medio por 15 minutos.');

          setMessages((prev) => [
            ...prev,
            { 
              sender: 'bot', 
              text: `💡 Sugerencia de Receta (${recipe.title}):\n⏱️ Tiempo: ${recipe.time || '20 min'} | 🏷️ ${recipe.badge || 'Anti-Desperdicio'}\n\n📋 Instrucciones:\n${stepsText}` 
            }
          ]);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Fallback receta local:', err);
      }
    }

    // 2. Intelligent responses for all other topics
    setTimeout(() => {
      let botResponse = '';

      if (msgLower.includes('gasto') || msgLower.includes('dinero') || msgLower.includes('cuenta') || msgLower.includes('50/50') || msgLower.includes('presupuesto') || msgLower.includes('pagar')) {
        const totalExp = (expenses || []).reduce((s, e) => s + parseFloat(e.amount || 0), 0);
        const halfExp = totalExp / 2;
        botResponse = `💰 Resumen de Finanzas Compartidas (50/50):\n• Gastos registrados: ${expenses.length}\n• Total acumulado: $${totalExp.toLocaleString()} en ${currentCity}.\n• División 50/50: $${halfExp.toLocaleString()} por persona.\n\n💡 Tip: Puedes exportar el reporte en formato CSV desde el módulo de Finanzas.`;
      } else if (msgLower.includes('mudanza') || msgLower.includes('renta') || msgLower.includes('contrato') || msgLower.includes('depósito')) {
        botResponse = `📦 Asistente de Mudanza & Arrendamiento en ${currentCity}:\n• Recuerda usar nuestro Analizador de Contratos con IA para detectar cláusulas abusivas o depósitos no reembolsables.\n• Revisa la checklist de mudanza en el panel lateral para controlar tus trámites de servicios y salud.`;
      } else if (msgLower.includes('evento') || msgLower.includes('ciudad') || msgLower.includes('planes') || msgLower.includes('salir')) {
        botResponse = `📍 Cartelera Urbano en ${currentCity}:\nPuedes consultar los eventos destacados en la sección "Explorar Ciudad" y generar un itinerario guiado por IA según tu tiempo disponible.`;
      } else {
        const ingList = ingredients.length > 0 ? ingredients.slice(0, 3).join(', ') : 'tus ingredientes registrados';
        botResponse = `🤖 Copiloto RoomIA (${currentCity}):\nHe procesado tu consulta sobre "${textToSend}".\n\nPuedo ayudarte con:\n1. 🍳 Sugerencias de cocina anti-desperdicio (alacena actual: ${ingredients.length} items).\n2. 💰 Balances de gastos 50/50 y presupuesto de vivienda.\n3. 📄 Análisis legal de contratos de alquiler y mudanza.`;
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
      setLoading(false);
    }, 450);
  };

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 99999 }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.85rem 1.4rem',
            background: 'linear-gradient(135deg, #ff6b4a, #ff9f43)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            boxShadow: '0 10px 25px rgba(255, 107, 74, 0.4)',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, boxShadow 0.2s ease'
          }}
        >
          <i className="fa-solid fa-robot" style={{ fontSize: '1.1rem' }}></i>
          <span>RoomIA Copilot</span>
        </button>
      ) : (
        <div
          style={{
            width: '360px',
            maxWidth: 'calc(100vw - 2rem)',
            height: '490px',
            maxHeight: 'calc(100vh - 4rem)',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ padding: '1rem 1.25rem', background: 'linear-gradient(135deg, #fff5f2 0%, #ffe8e0 100%)', borderBottom: '1px solid #ffe2d9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem' }}>
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>RoomIA Copilot AI</h4>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span> En línea ({currentCity})
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1 }}
              aria-label="Cerrar chat"
            >
              &times;
            </button>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '1rem 1.1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: '#f8fafc' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  padding: '0.75rem 1rem',
                  borderRadius: m.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  background: m.sender === 'user' ? 'linear-gradient(135deg, #ff6b4a, #ff9f43)' : '#ffffff',
                  border: m.sender === 'user' ? 'none' : '1px solid #cbd5e1',
                  color: m.sender === 'user' ? '#ffffff' : '#0f172a',
                  fontSize: '0.84rem',
                  lineHeight: '1.45',
                  fontWeight: m.sender === 'user' ? 600 : 500,
                  boxShadow: m.sender === 'user' ? '0 4px 12px rgba(255, 107, 74, 0.25)' : '0 2px 6px rgba(0,0,0,0.04)',
                  whiteSpace: 'pre-line'
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.6rem 0.9rem', borderRadius: '18px 18px 18px 2px', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="fa-solid fa-spinner fa-spin text-coral"></i> <span>RoomIA procesando...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips (Flex Wrap - Zero Horizontal Scrollbar) */}
          <div style={{ padding: '0.5rem 0.8rem', background: '#ffffff', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              onClick={() => handleSend('💡 ¿Qué cocino hoy?')}
              style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: 'var(--text-main)', fontSize: '0.72rem', padding: '0.3rem 0.55rem', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700 }}
            >
              💡 ¿Qué cocino hoy?
            </button>
            <button 
              type="button" 
              onClick={() => handleSend('💰 Resumen de gastos 50/50')}
              style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: 'var(--text-main)', fontSize: '0.72rem', padding: '0.3rem 0.55rem', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700 }}
            >
              💰 Gastos 50/50
            </button>
            <button 
              type="button" 
              onClick={() => handleSend('📋 Recomendaciones mudanza')}
              style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: 'var(--text-main)', fontSize: '0.72rem', padding: '0.3rem 0.55rem', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700 }}
            >
              📋 Mudanza
            </button>
          </div>

          {/* Input Footer */}
          <div style={{ padding: '0.75rem 1rem', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pregunta a tu Roomie AI..."
              style={{ flex: 1, padding: '0.6rem 0.9rem', fontSize: '0.85rem', borderRadius: '9999px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}
            />
            <button className="btn btn-primary btn-sm" onClick={() => handleSend()} style={{ borderRadius: '9999px', width: '38px', height: '38px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

