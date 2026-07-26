import { envConfig } from '../config/env.config.js';

export class ItineraryService {
  async generateItinerary(events, city, mode, language = 'es') {
    const apiKey = envConfig.qiroApiKey || envConfig.groqApiKey || envConfig.openrouterApiKey;

    if (apiKey && apiKey.trim() !== '' && events.length > 0) {
      try {
        const result = await this.callLLM(apiKey, events, city, mode, language);
        if (result) return result;
      } catch (error) {
        console.warn('ItineraryService LLM fallback active:', error.message);
      }
    }

    return this.generateLocalItinerary(events, city, mode);
  }

  async callLLM(apiKey, events, city, mode, language) {
    const eventsSummary = events.slice(0, 6).map((e, i) => `${i + 1}. "${e.title}" - ${e.location || city} (${e.date || 'Próximas fechas'})`).join('\n');
    const modeContext = mode === 'couple' ? 'pareja/roomies' : 'persona individual (solo expat)';

    const systemPrompt = language === 'es'
      ? `Eres un planificador de experiencias urbanas para personas que acaban de mudarse a una ciudad nueva. Devuelve ÚNICAMENTE un JSON con la key "itinerary" que contiene: "title" (string), "steps" (array de 4-6 objetos con "time" y "desc").`
      : `You are an urban experience planner for people who just moved to a new city. Return ONLY a JSON with key "itinerary" containing: "title" (string), "steps" (array of 4-6 objects with "time" and "desc").`;

    const userPrompt = language === 'es'
      ? `Crea un itinerario de fin de semana realista y divertido para una ${modeContext} que vive en ${city}. Usa estos eventos REALES encontrados en la ciudad para integrarlos en la ruta:\n\n${eventsSummary}\n\nEl itinerario debe cubrir sábado y domingo, con horarios específicos, mezclando los eventos con actividades complementarias (desayuno, café, paseo, cena). Sé específico con lugares y horarios.`
      : `Create a realistic and fun weekend itinerary for a ${modeContext} living in ${city}. Use these REAL events found in the city:\n\n${eventsSummary}\n\nCover Saturday and Sunday with specific times, mixing events with complementary activities. Be specific with places and times.`;

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

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.85,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`LLM API responded with ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);
    return { itinerary: parsed.itinerary, source: 'ai-llm-engine' };
  }

  generateLocalItinerary(events, city, mode) {
    const isCouple = mode === 'couple';
    const eventTitles = events.slice(0, 3).map(e => e.title || 'Evento cultural');

    return {
      itinerary: {
        title: isCouple
          ? `Ruta de Roomies para Descubrir ${city}`
          : `Ruta Individual de Exploración en ${city}`,
        steps: [
          {
            time: 'Sábado - 10:00 AM',
            desc: `Desayuno en café de especialidad del centro de ${city}. Buen punto para planear la jornada.`
          },
          {
            time: 'Sábado - 12:00 PM',
            desc: eventTitles[0] ? `Asistir a "${eventTitles[0]}" — evento destacado encontrado por RoomIA.` : `Visita al mercado local de productos frescos y artesanía.`
          },
          {
            time: 'Sábado - 05:00 PM',
            desc: eventTitles[1] ? `Explorar "${eventTitles[1]}" antes de la cena.` : `Recorrido por la ruta de museos y galerías del barrio cultural.`
          },
          {
            time: 'Sábado - 08:30 PM',
            desc: isCouple
              ? `Cena ${eventTitles[2] ? `seguida de "${eventTitles[2]}"` : 'en terraza con música en vivo'}.`
              : `Cena individual y cine o meetup cultural local.`
          },
          {
            time: 'Domingo - 11:00 AM',
            desc: `Brunch relajado y caminata por el parque principal de ${city}.`
          },
          {
            time: 'Domingo - 04:00 PM',
            desc: `Preparación de meal prep semanal con recetas anti-desperdicio sugeridas por RoomIA.`
          }
        ]
      },
      source: 'local-itinerary-engine'
    };
  }
}
