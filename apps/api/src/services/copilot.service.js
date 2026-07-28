import { envConfig } from '../config/env.config.js';

export class CopilotService {
  async chatWithAgent(messages, context = {}, customApiKey = '') {
    const userProfile = context.user || { name: 'Expat' };
    const city = context.city || 'Ciudad de México';
    const currency = context.currency || 'USD';
    const mode = context.mode === 'couple' ? 'En pareja / Roomies' : 'Individual / Solo';
    const ingredients = Array.isArray(context.ingredients) ? context.ingredients : [];
    const expenses = Array.isArray(context.expenses) ? context.expenses : [];
    const tasks = Array.isArray(context.tasks) ? context.tasks : [];

    const totalExpenses = expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
    const completedTasks = tasks.filter(t => t.completed).length;
    const tasksPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    // Strict Domain Agent Harness System Prompt for LLM
    const systemPrompt = `Eres RoomIA Copilot, un Agente de Inteligencia Artificial especializado EXCLUSIVAMENTE en la gestión inteligente del hogar, finanzas compartidas 50/50, alacena anti-desperdicio y relocalización en ${city}.

CONTEXT HARNESS DE LA SESIÓN (ESTADO VIVO EN TIEMPO REAL):
- Usuario activo: ${userProfile.name} (${userProfile.role || 'Residente'})
- Ciudad activa: ${city} (Moneda oficial: ${currency})
- Modo de convivencia: ${mode}
- Datos en tiempo real:
  • Alacena/Refrigerador (${ingredients.length} items): ${ingredients.length > 0 ? ingredients.join(', ') : 'Sin alimentos registrados'}
  • Finanzas Compartidas 50/50 (${expenses.length} ítems): Acumulado $${totalExpenses.toLocaleString()} ${currency} (Cuota por persona: $${(totalExpenses / 2).toLocaleString()} ${currency})
  • Mudanza & Trámites: ${completedTasks} de ${tasks.length} tareas completadas (${tasksPercent}% de avance)

REGLAS STRICTAS DEL HARNESS (LÍMITE DE DOMINIO DEL AGENTE):
1. Limítate EXCLUSIVAMENTE a responder sobre el hogar del usuario, sus finanzas 50/50, su alacena, recetas con sus ingredientes, mudanza y exploración de ${city}.
2. Si el usuario realiza una consulta fuera de este dominio (por ejemplo: programación, Python, política, historia general, deportes ajenos u otros temas no relacionados con el hogar o la ciudad), responde amablemente:
   "Como tu Copiloto RoomIA en ${city}, mi función está delimitada a la gestión de tu hogar, tus finanzas 50/50, tu alacena y tu mudanza. ¿En qué te puedo ayudar hoy sobre tu casa o tu estadía?"
3. NUNCA respondas preguntas fuera del dominio del hogar o la ciudad.
4. Responde de forma concisa, útil, empática y natural basada en la API de IA.`;

    const apiKey = customApiKey || envConfig.openaiApiKey || envConfig.groqApiKey || envConfig.openrouterApiKey || envConfig.geminiApiKey;

    // 1. Try real LLM Call if API Key is configured
    if (apiKey && apiKey.trim() !== '') {
      try {
        const responseText = await this.callLLM(apiKey, systemPrompt, messages);
        if (responseText) {
          return { message: responseText, source: 'llm-agent-harness' };
        }
      } catch (error) {
        console.warn('[CopilotAgent] LLM provider error:', error.message);
      }
    }

    // 2. Intelligent Context Harness Reasoning Engine
    return {
      message: this.executeContextHarnessReasoning(messages, context, { totalExpenses, completedTasks, tasksPercent }),
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
        temperature: 0.5,
        max_tokens: 400
      })
    });

    if (!response.ok) {
      throw new Error(`LLM provider returned status ${response.status}`);
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
    const tasks = context.tasks || [];

    // --- IN-DOMAIN TOPIC 1: Cooking / Recipes / Food ---
    if (msgLower.includes('cocin') || msgLower.includes('recet') || msgLower.includes('comid') || msgLower.includes('hambre') || msgLower.includes('menu') || msgLower.includes('cenar') || msgLower.includes('almorzar')) {
      const ingList = ingredients.length > 0 ? ingredients.join(', ') : 'Arroz, Pollo y Vegetales de estación';
      return `🍳 **Sugerencia de Cocina para ${user} en ${city}:**\nBasado en tu alacena actual (${ingList}), te recomiendo:\n\n💡 **Salteado Express Anti-Desperdicio**\n⏱️ Tiempo: 18 min | 🏷️ Rendimiento Económico\n\n📋 **Instrucciones:**\n1. Picar los ingredientes disponibles en cubos medianos.\n2. Sazonar y dorar en sartén con un hilo de aceite a fuego medio por 8 min.\n3. Servir caliente acompañado de pan tostado o ensalada fresca.\n\n¿Deseas registrar nuevos alimentos en 'Mi Refrigerador'?`;
    }

    // --- IN-DOMAIN TOPIC 2: Relocation / Mudanza / Contracts ---
    if (msgLower.includes('mudan') || msgLower.includes('rent') || msgLower.includes('alquil') || msgLower.includes('contrat') || msgLower.includes('deposit') || msgLower.includes('arriend') || msgLower.includes('fianz') || msgLower.includes('tramit')) {
      const pendingTasks = tasks.filter(t => !t.completed);
      const pendingText = pendingTasks.length > 0 
        ? pendingTasks.slice(0, 3).map(t => `• ${t.title || t.text}`).join('\n')
        : '• ¡Todas tus tareas principales están al día!';

      return `📦 **Recomendaciones de Mudanza & Arrendamiento en ${city}:**\n• Estado del Checklist: ${stats.completedTasks} completadas (${stats.tasksPercent}% de avance).\n\n📋 **Próximos trámites sugeridos:**\n${pendingText}\n\n💡 **Tip Legal:** Utiliza el **Analizador de Contratos con IA** en la pestaña de Mudanza para verificar cláusulas de garantía, depósitos y aumentos anuales antes de firmar tu contrato de alquiler.`;
    }

    // --- IN-DOMAIN TOPIC 3: Finances / 50-50 Expenses ---
    if (msgLower.includes('gast') || msgLower.includes('diner') || msgLower.includes('cuent') || msgLower.includes('50/50') || msgLower.includes('presupuest') || msgLower.includes('pag') || msgLower.includes('saldo') || msgLower.includes('cuanto')) {
      const half = stats.totalExpenses / 2;
      return `💰 **Resumen de Finanzas Compartidas para ${user} (${city}):**\n• Registros de gastos: ${expenses.length} ítems.\n• Total acumulado: $${stats.totalExpenses.toLocaleString()} ${currency}.\n• Cuota 50/50 por persona: $${half.toLocaleString()} ${currency}.\n\n💡 Puedes ver el desglose detallado o exportar el reporte en formato CSV desde el módulo de Finanzas.`;
    }

    // --- IN-DOMAIN TOPIC 4: Pantry & Ingredients Inquiry ---
    if (msgLower.includes('product') || msgLower.includes('ingredien') || msgLower.includes('alacen') || msgLower.includes('refrig') || msgLower.includes('que tengo') || msgLower.includes('teng')) {
      if (ingredients.length === 0) {
        return `🛒 Hola ${user}, actualmente tu alacena en ${city} está vacía (0 alimentos registrados).\n\nPuedes ingresar a la pestaña 'Mi Refrigerador' para agregar ingredientes o tomarle una foto con la cámara.`;
      }
      return `🛒 **Alacena Actual en ${city} (${ingredients.length} items):**\n${ingredients.map(i => `• ${i}`).join('\n')}\n\n💡 ¿Quieres que te sugiera una receta combinando estos ingredientes?`;
    }

    // --- IN-DOMAIN TOPIC 5: City Events & Exploration ---
    if (msgLower.includes('event') || msgLower.includes('ciudad') || msgLower.includes('plan') || msgLower.includes('salir') || msgLower.includes('hacer') || msgLower.includes('cartelera')) {
      return `📍 **Exploración Urbana en ${city}:**\nPuedes consultar la cartelera cultural y gastronómica verificada en la sección 'Explorar Ciudad' y pedirle a la IA que cree tu itinerario guiado para el fin de semana.`;
    }

    // --- IN-DOMAIN TOPIC 6: Friendly Greetings ---
    if (/^(hola|buenas|hey|buenos dias|buenas tardes|buenas noches|saludos)$/i.test(msgLower)) {
      return `¡Hola ${user}! 👋 Soy tu Copiloto RoomIA en ${city}.\n\n¿En qué te puedo ayudar hoy con tu alacena, finanzas 50/50 o planes de mudanza?`;
    }

    // --- STRICT HARNESS BOUNDARY: Decline Out-of-Scope Questions (e.g. Python, sports, political history, etc.) ---
    return `Como tu Copiloto RoomIA en ${city}, mi función está delimitada a la gestión de tu hogar, tus finanzas 50/50, tu alacena y tu mudanza. ¿En qué te puedo ayudar hoy sobre tu casa o tu estadía?`;
  }
}
