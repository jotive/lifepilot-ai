export class TavilyRepository {
  async searchEvents(query, city, apiKey) {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${query} en ${city}`,
        search_depth: 'advanced',
        include_answer: true,
        max_results: 6
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Tavily API error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  }
}
