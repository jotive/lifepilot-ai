import { SearchService } from '../services/search.service.js';
import { ResponseUtil } from '../utils/response.util.js';

export class SearchController {
  constructor() {
    this.searchService = new SearchService();
  }

  async handleTavilySearch(req, res, next) {
    const { query, city, apiKey } = req.body;

    try {
      const results = await this.searchService.executeEventSearch(query, city, apiKey);
      return ResponseUtil.success(res, results);
    } catch (error) {
      if (error.message === 'MISSING_API_KEY') {
        return ResponseUtil.error(
          res, 
          'Tavily API Key is missing', 
          400, 
          'Provide your Tavily API Key in application settings or TAVILY_API_KEY environment variable.'
        );
      }
      next(error);
    }
  }
}
