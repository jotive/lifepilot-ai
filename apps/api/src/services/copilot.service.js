import { envConfig } from '../config/env.config.js';

export class CopilotService {
  async chatWithAgent(messages, context = {}) {
    const apiKey = envConfig.openaiApiKey || envConfig.groqApiKey || envConfig.openrouterApiKey;

    const userProfile = context.user || { name: 'Expat' };
    const city = context.city || 'Ciudad de México';
    const currency = context.currency || 'USD';
    const mode = context.mode === 'couple' ? 'En pareja / Roomies' : 'Individual / Solo';
    const ingredients = Array.isArray(context.ingredients) ? context.ingredients : [];
    const expenses = Array.isArray(context.expenses) ? context.expenses : [];
    const tasks = Array.isArray(context.tasks) ? context.tasks : [];

    const totalExpenses = expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
    const completedTasks = tasks.filter(t => t.completed).length;

    // Construct full Context Harness System Prompt for LLM
    const systemPrompt = `Eres RoomIA Copilot, un Agente de Inteligencia Artificial avanzado para la gestión inteligente del hogar, finanzas 50/50, recetas anti-desperdicio y exploración de ciudades para expats y parejas.

CONTEXT HARNESS DE LA SESIÓN EN TIEMPO REAL:
- Usuario: ${userProfile.name} (${userProfile.role || 'Residente'})
- Ciudad Activa: ${city} (Moneda oficial: ${currency})
- Modo de Convivencia: ${mode}
- Alacena/Refrigerador (${ingredients.length} items): ${ingredients.length > 0 ? ingredients.join(', ') : 'Sin alimentos registrados aún'}
- Finanzas Compartidas (${expenses.length} registros): Total acumulado $${totalExpenses.toLocaleString()} ${currency} (División 50/50: $${(totalExpenses / 2).toLocaleString()} por persona)
- Mudanza & Trámites (${tasks.length} tareas): ${completedTasks} completadas (${tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}% de avance)

INSTRUCCIONES DE RESPUESTA DE TU AGENTE:
1. Responde de forma útil, natural, concisa y empática como el copiloto personal de ${userProfile.name}.
2. Utiliza la información del Context Harness para personalizar tus respuestas (aludiendo a su ciudad ${city}, sus finanzas $${totalExpenses}, su alacena o su mudanza cuando sea pertinente).
3. Responde a CUALQUIER consulta del usuario (incluyendo tecnología, consejos de vida o preguntas generales), manteniendo un tono amable y servicial.`;

    if (apiKey && apiKey.trim() !== '') {
      try {
        const responseText = await this.callLLM(apiKey, systemPrompt, messages);
        if (responseText) {
          return { message: responseText, source: 'llm-agent-harness' };
        }
      } catch (error) {
        console.warn('[CopilotAgent] LLM API call error, using context harness engine:', error.message);
      }
    }

    // Dynamic Context Harness Reasoning Engine
    return {
      message: this.executeContextHarnessReasoning(messages, context, { totalExpenses, completedTasks }),
      source: 'context-harness-engine'
    };
  }

  async callLLM(apiKey, systemPrompt, messages) {
    let endpoint = 'https://api.openai.com/v1/chat/completions';
    let headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` };
    let model = 'gpt-4o-mini';

    if (envConfig.groqApiKey && apiKey === envConfig.groqApiKey) {
      endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      model = 'llama-3.1-8b-instant';
    } else if (envConfig.openrouterApiKey && apiKey === envConfig.openrouterApiKey) {
      endpoint = 'https://openrouter.ai/api/v1/chat/completions';
      model = 'meta-llama/llama-3.1-8b-instruct:free';
    }

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }))
    ];

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 450
      })
    });

    if (!response.ok) {
      throw new Error(`LLM provider responded with ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content;
  }

  executeContextHarnessReasoning(messages, context, stats) {
    const lastUserMessage = messages.filter(m => m.sender === 'user').slice(-1)[0]?.text || '';
    const msgLower = lastUserMessage.toLowerCase().trim();
    const user = context.user?.name || 'Expat';
    const city = context.city || 'tu ciudad';
    const currency = context.currency || 'USD';
    const ingredients = context.ingredients || [];
    const expenses = context.expenses || [];

    // 1. Saludos simples
    if (/^(hola|buenas|hey|buenos dias|buenas tardes|buenas noches|saludos)$/i.test(msgLower)) {
      return `¡Hola ${user}! 👋 Soy tu Copiloto RoomIA en ${city}.\n\n¿En qué te puedo ayudar hoy con tu alacena, finanzas 50/50 o planes de mudanza?`;
    }

    // 2. Finanzas y Gastos (gastado, gasto, dinero, cuenta, presupuesto, pagado, cuanto)
    if (msgLower.includes('gast') || msgLower.includes('diner') || msgLower.includes('cuent') || msgLower.includes('50/50') || msgLower.includes('presupuest') || msgLower.includes('pag') || msgLower.includes('cuanto he') || msgLower.includes('saldo')) {
      const half = stats.totalExpenses / 2;
      return `💰 **Resumen Financiero para ${user} en ${city}:**\n• Gastos registrados: ${expenses.length} ítems.\n• Acumulado total: $${stats.totalExpenses.toLocaleString()} ${currency}.\n• Cuota 50/50 por persona: $${half.toLocaleString()} ${currency}.\n\n💡 Tip: En la sección 'Finanzas & Gastos' puedes ver el desglose o exportar el reporte en CSV.`;
    }

    // 3. Alacena y Alimentos (producto, ingrediente, alacena, refrigerador, tengo, comida, receta, cocina, hambre)
    if (msgLower.includes('product') || msgLower.includes('ingredien') || msgLower.includes('alacen') || msgLower.includes('refrig') || msgLower.includes('que tengo') || msgLower.includes('teng')) {
      if (ingredients.length === 0) {
        return `🛒 Hola ${user}, actualmente tu alacena en ${city} está vacía (0 alimentos registrados).\n\nPuedes ingresar a la pestaña 'Mi Refrigerador' para agregar ingredientes manualmente o tomarle una foto con la cámara.`;
      }
      return `🛒 Hola ${user}, en tu alacena de ${city} tienes ${ingredients.length} producto(s) registrado(s):\n\n${ingredients.map(i => `• ${i}`).join('\n')}\n\n💡 ¿Quieres que te sugiera una receta con estos ingredientes?`;
    }

    // 4. Recetas y Cocina
    if (msgLower.includes('cocin') || msgLower.includes('recet') || msgLower.includes('comid') || msgLower.includes('hambre') || msgLower.includes('menu') || msgLower.includes('cenar') || msgLower.includes('almorzar')) {
      const ingList = ingredients.length > 0 ? ingredients.join(', ') : 'Arroz, Pollo y Vegetales de estación';
      return `🍳 Basado en tu alacena actual (${ingList}), te sugiero:\n\n💡 **Bowl Anti-Desperdicio Express**\n⏱️ Tiempo: 18 min | 🏷️ Económico\n\n📋 **Instrucciones:**\n1. Picar los ingredientes disponibles en cubos medianos.\n2. Dorar en sartén con aceite y sal al gusto por 8 minutos.\n3. Servir en bowl acompañado de pan o ensalada fresca.`;
    }

    // 5. Mudanza, Renta y Contratos
    if (msgLower.includes('mudan') || msgLower.includes('rent') || msgLower.includes('alquil') || msgLower.includes('contrat') || msgLower.includes('deposit') || msgLower.includes('arriend')) {
      return `📦 **Copiloto de Mudanza & Arrendamiento en ${city}:**\n• Llevas ${stats.completedTasks} tareas de mudanza completadas.\n• Te sugiero probar nuestro **Analizador Legal de Contratos** en la sección de Mudanza para verificar cláusulas de garantía y reajustes.`;
    }

    // 6. Eventos y Ciudad
    if (msgLower.includes('event') || msgLower.includes('ciudad') || msgLower.includes('plan') || msgLower.includes('salir') || msgLower.includes('hacer')) {
      return `📍 **Exploración Urbana en ${city}:**\nPuedes ver la cartelera actualizada en la sección 'Explorar Ciudad' y pedirle a la IA que arme un itinerario guiado para el fin de semana.`;
    }

    // 7. Preguntas sobre Tecnología / Python / Programación
    if (msgLower.includes('python') || msgLower.includes('program') || msgLower.includes('codigo') || msgLower.includes('software') || msgLower.includes('tecnolog')) {
      return `🐍 **Python & Tecnología en RoomIA:**\nPython es un lenguaje de programación reconocido por su elegancia y versatilidad. En nuestro ecosistema de RoomIA, utilizamos IA y algoritmos avanzados para optimizar recetas anti-desperdicio, escanear recibos de gastos y analizar contratos de arrendamiento.\n\n¿Te gustaría saber cómo aplicar tecnología para simplificar las tareas de tu hogar en ${city}?`;
    }

    // 8. Cualquier otra consulta general
    return `🤖 Hola ${user}, procesé tu consulta: "${lastUserMessage}".\n\nComo tu copiloto inteligente en ${city}, puedo ayudarte con:\n- 🍳 **Alacena & Recetas:** Tienes ${ingredients.length} alimentos registrados.\n- 💰 **Finanzas 50/50:** Balance actual de $${stats.totalExpenses.toLocaleString()} ${currency}.\n- 📦 **Mudanza:** ${stats.completedTasks} tareas completadas y análisis de contratos.`;
  }
}
