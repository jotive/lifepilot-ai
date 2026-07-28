const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

async function request(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options
    });
    clearTimeout(timeoutId);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error?.message || 'API request failed');
    }
    return data.data;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export class ApiService {
  static async searchEvents(query, city, apiKey = '') {
    return request('/events/search', {
      method: 'POST',
      body: JSON.stringify({ query, city, apiKey })
    });
  }

  static async generateRecipes(ingredients, mode, language = 'es') {
    return request('/recipes/generate', {
      method: 'POST',
      body: JSON.stringify({ ingredients, mode, language })
    });
  }

  static async generateItinerary(events, city, mode, language = 'es') {
    return request('/itineraries/generate', {
      method: 'POST',
      body: JSON.stringify({ events, city, mode, language })
    });
  }

  static async scanFridge(imageBase64) {
    return request('/vision/fridge-scans', {
      method: 'POST',
      body: JSON.stringify({ imageBase64 })
    });
  }

  static async scanReceipt(imageBase64) {
    return request('/vision/receipt-scans', {
      method: 'POST',
      body: JSON.stringify({ imageBase64 })
    });
  }

  static async chatWithCopilot(messages, context) {
    return request('/copilot/chat', {
      method: 'POST',
      body: JSON.stringify({ messages, context })
    });
  }
}
