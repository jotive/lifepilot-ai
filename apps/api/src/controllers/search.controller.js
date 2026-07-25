import { SearchService } from '../services/search.service.js';

export class SearchController {
  constructor() {
    this.searchService = new SearchService();
  }

  async handleTavilySearch(req, res) {
    const { query, city, apiKey } = req.body;

    try {
      const results = await this.searchService.executeEventSearch(query, city, apiKey);
      return res.json(results);
    } catch (error) {
      if (error.message === 'MISSING_API_KEY') {
        return res.status(400).json({
          error: 'Tavily API Key is missing',
          message: 'Provide your Tavily API Key in application settings or environment variable.'
        });
      }

      return res.status(500).json({ error: 'Failed to execute search', details: error.message });
    }
  }
}
