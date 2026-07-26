const API_BASE = 'http://localhost:4000/api/v1';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error?.message || 'API request failed');
  }
  return data.data;
}

export class ApiService {
  static async searchEvents(query, city, apiKey = '') {
    return request('/search', {
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
}
