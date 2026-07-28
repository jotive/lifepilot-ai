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

    // Construct full Context Harness System Prompt
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
3. No inventes comandos técnicos. Si preguntan por cocina, sugiere recetas con su alacena. Si preguntan por finanzas, muestra su balance real. Si preguntan por mudanza o contratos, orienta el uso del Analizador de Contratos IA.`;

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

    // Dynamic Context Harness Reasoning Engine (Fallback)
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
    const msgLower = lastUserMessage.toLowerCase();
    const user = context.user?.name || 'Expat';
    const city = context.city || 'tu ciudad';
    const currency = context.currency || 'USD';
    const ingredients = context.ingredients || [];
    const expenses = context.expenses || [];

    if (msgLower.includes('ingrediente') || msgLower.includes('alacena') || msgLower.includes('refrigerador') || msgLower.includes('tengo')) {
      if (ingredients.length === 0) {
        return `🛒 Hola ${user}, actualmente tu alacena en ${city} está vacía (0 alimentos registrados).\n\nPuedes ingresar a la pestaña 'Mi Refrigerador' para agregar ingredientes o tomarle una foto a tu refrigerador con la cámara.`;
      }
      return `🛒 Hola ${user}, en tu alacena de ${city} tienes registrados ${ingredients.length} ingrediente(s):\n\n${ingredients.map(i => `• ${i}`).join('\n')}\n\n💡 ¿Quieres que te sugiera una receta combinando estos ingredientes?`;
    }

    if (msgLower.includes('cocin') || msgLower.includes('receta') || msgLower.includes('comid') || msgLower.includes('hambre') || msgLower.includes('menu')) {
      const ingList = ingredients.length > 0 ? ingredients.join(', ') : 'Arroz, Pollo y Vegetales';
      return `🍳 Basado en tu alacena actual (${ingList}), te sugiero:\n\n💡 **Salteado Anti-Desperdicio Express**\n⏱️ Tiempo: 18 min | 🏷️ Económico\n\n📋 **Instrucciones:**\n1. Picar los ingredientes disponibles en cubos pequeños.\n2. Dorar en sartén con aceite y sal al gusto por 8 minutos.\n3. Servir en bowl acompañado de pan o ensalada fresca.\n\n¿Deseas guardar la lista de compras de ingredientes faltantes?`;
    }

    if (msgLower.includes('gasto') || msgLower.includes('dinero') || msgLower.includes('cuenta') || msgLower.includes('50/50') || msgLower.includes('presupuesto')) {
      const half = stats.totalExpenses / 2;
      return `💰 **Resumen de Finanzas Compartidas para ${user}:**\n• Gastos acumulados: ${expenses.length} registros.\n• Monto total: $${stats.totalExpenses.toLocaleString()} ${currency}.\n• Cuota 50/50 por persona: $${half.toLocaleString()} ${currency}.\n\nRevisa la pestaña 'Finanzas & Gastos' para ver el desglose o exportar el reporte en CSV.`;
    }

    if (msgLower.includes('mudanza') || msgLower.includes('renta') || msgLower.includes('contrato') || msgLower.includes('depósito')) {
      return `📦 **Copiloto de Mudanza & Contratos en ${city}:**\n• Llevas ${stats.completedTasks} tareas completadas.\n• Te sugiero probar el **Analizador Legal de Contratos** en la sección de Mudanza para verificar cláusulas de garantía y reajustes.`;
    }

    if (msgLower.includes('evento') || msgLower.includes('ciudad') || msgLower.includes('planes') || msgLower.includes('salir')) {
      return `📍 **Exploración Urbana en ${city}:**\nPuedes ver la cartelera actualizada de la ciudad en la sección 'Explorar Ciudad' y pedirle a la IA que cree tu itinerario para el fin de semana.`;
    }

    return `🤖 Hola ${user}, soy tu Copiloto RoomIA en ${city}.\n\nPuedo asistirte en tiempo real utilizando el contexto de tu hogar:\n- 🍳 Sugerir recetas con tus ${ingredients.length} ingredientes registrados.\n- 💰 Calcular el balance de tus $${stats.totalExpenses.toLocaleString()} ${currency} en gastos.\n- 📦 Controlar tu checklist de mudanza y analizar contratos de alquiler.`;
  }
}
