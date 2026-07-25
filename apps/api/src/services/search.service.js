import { TavilyRepository } from '../repositories/tavily.repository.js';
import { settings } from '../config/settings.js';

export class SearchService {
  constructor() {
    this.tavilyRepository = new TavilyRepository();
  }

  async executeEventSearch(query, city, userApiKey) {
    const targetKey = userApiKey || settings.tavilyApiKey;

    if (!targetKey) {
      throw new Error('MISSING_API_KEY');
    }

    return await this.tavilyRepository.searchEvents(query, city || 'Ciudad de México', targetKey);
  }
}
