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

    // Strict Domain Agent Harness System Prompt
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

    const apiKey = customApiKey || envConfig.groqApiKey || envConfig.openrouterApiKey || envConfig.openaiApiKey || envConfig.geminiApiKey;

    // Execute Real LLM Call via Provider
    try {
      const responseText = await this.callLLM(apiKey, systemPrompt, messages);
      if (responseText) {
        return { message: responseText, source: 'llm-agent-harness' };
      }
    } catch (error) {
      console.warn('[CopilotAgent] LLM provider error:', error.message);
    }

    // Fallback to OpenRouter Free LLM Endpoint if no custom key
    try {
      const freeResponse = await this.callFreeLLM(systemPrompt, messages);
      if (freeResponse) {
        return { message: freeResponse, source: 'openrouter-free-llm' };
      }
    } catch (err) {
      console.warn('[CopilotAgent] Free LLM endpoint error:', err.message);
    }

    // Strict Out-of-Domain / Domain Harness Fallback
    return {
      message: `Como tu Copiloto RoomIA en ${city}, mi función está delimitada a la gestión de tu hogar, tus finanzas 50/50, tu alacena y tu mudanza. ¿En qué te puedo ayudar hoy sobre tu casa o tu estadía?`,
      source: 'domain-harness-boundary'
    };
  }

  async callLLM(apiKey, systemPrompt, messages) {
    if (!apiKey || apiKey.trim() === '') return null;

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

  async callFreeLLM(systemPrompt, messages) {
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }))
    ];

    // OpenRouter Free LLM API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: formattedMessages,
        temperature: 0.5,
        max_tokens: 400
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.choices[0]?.message?.content;
  }
}
