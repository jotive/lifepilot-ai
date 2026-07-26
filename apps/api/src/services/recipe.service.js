import { envConfig } from '../config/env.config.js';

export class RecipeService {
  async generateRecipes(ingredients, mode, language = 'es') {
    const apiKey = envConfig.openaiApiKey || envConfig.groqApiKey || envConfig.openrouterApiKey;

    if (apiKey && apiKey.trim() !== '') {
      try {
        const result = await this.callLLM(apiKey, ingredients, mode, language);
        if (result) return result;
      } catch (error) {
        console.warn('RecipeService LLM fallback active:', error.message);
      }
    }

    return this.generateLocalRecipes(ingredients, mode);
  }

  async callLLM(apiKey, ingredients, mode, language) {
    const ingredientsList = ingredients.join(', ');
    const modeContext = mode === 'couple'
      ? 'para 2 personas (pareja o roomies)'
      : 'para 1 persona (individual, meal prep)';

    const systemPrompt = language === 'es'
      ? `Eres un chef experto en cocina económica y anti-desperdicio. Devuelve ÚNICAMENTE un JSON con la key "recipes" que contiene un array de exactamente 3 recetas. Cada receta tiene: "title" (string), "time" (string, ej: "20 min"), "difficulty" (string: "Fácil", "Media", "Rápido"), "badge" (string: "Anti-Desperdicio", "Económico", "Saludable"), "steps" (array de 3-4 strings con instrucciones claras).`
      : `You are an expert chef specializing in budget and anti-waste cooking. Return ONLY a JSON with key "recipes" containing an array of exactly 3 recipes. Each recipe has: "title" (string), "time" (string), "difficulty" (string), "badge" (string), "steps" (array of 3-4 instruction strings).`;

    const userPrompt = language === 'es'
      ? `Genera 3 recetas creativas y realistas usando ÚNICAMENTE estos ingredientes: ${ingredientsList}. Las porciones son ${modeContext}. Prioriza recetas rápidas, económicas y que eviten desperdiciar alimentos.`
      : `Generate 3 creative and realistic recipes using ONLY these ingredients: ${ingredientsList}. Portions are for ${mode === 'couple' ? '2 people' : '1 person'}. Prioritize quick, budget-friendly, anti-waste recipes.`;

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
        temperature: 0.8,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`LLM API responded with ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);
    return { recipes: parsed.recipes, source: 'ai-llm-engine' };
  }

  generateLocalRecipes(ingredients, mode) {
    const portions = mode === 'couple' ? '2 porciones' : '1 porción';
    const ing1 = ingredients[0] || 'Ingredientes disponibles';
    const ing2 = ingredients[1] || 'acompañamiento';
    const ing3 = ingredients[2] || 'vegetales';

    return {
      recipes: [
        {
          title: `Bowl Saludable de ${ing1} con ${ing2}`,
          time: '20 min',
          difficulty: 'Fácil',
          badge: 'Anti-Desperdicio',
          steps: [
            `Picar ${ing1} en cubos medianos y saltear en sartén con aceite de oliva a fuego medio-alto por 4 min.`,
            `Incorporar ${ing2} y ${ing3} cortados, cocinar 3 min más con sal y pimienta al gusto.`,
            `Servir en bowl con arroz o pan tostado. Rinde ${portions}.`,
            `Tip: Guardar sobrantes en recipiente hermético hasta 2 días en refrigerador.`
          ]
        },
        {
          title: `Salteado Exprés con ${ing3} y ${ing1}`,
          time: '15 min',
          difficulty: 'Rápido',
          badge: 'Económico',
          steps: [
            `Calentar sartén con un hilo de aceite. Agregar ${ing1} cortado fino.`,
            `Añadir ${ing3} y salsa de soya (si disponible) o limón con sal.`,
            `Cocinar a fuego alto revolviendo constantemente por 5-7 minutos.`,
            `Servir caliente. Ideal para cena rápida sin compras extra.`
          ]
        },
        {
          title: `Wrap/Tortilla Rellena de ${ing2} y ${ing3}`,
          time: '10 min',
          difficulty: 'Fácil',
          badge: 'Saludable',
          steps: [
            `Calentar tortilla o pan plano en sartén seco 30 segundos por lado.`,
            `Rellenar con ${ing2} desmenuzado y ${ing3} frescos picados.`,
            `Agregar queso rallado o crema si está disponible. Enrollar y cortar al medio.`,
            `Acompañar con salsa casera. Listo en minutos, rinde ${portions}.`
          ]
        }
      ],
      source: 'local-recipe-engine'
    };
  }
}
