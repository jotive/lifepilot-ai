import { TavilyRepository } from '../repositories/tavily.repository.js';
import { settings } from '../config/settings.js';

// In-Memory Daily City Events Cache Store
// Cache Key: <city>_<YYYY-MM-DD>_<query>
const dailyEventsCache = new Map();

export class SearchService {
  constructor() {
    this.tavilyRepository = new TavilyRepository();
  }

  async executeEventSearch(query, city, userApiKey) {
    const targetKey = userApiKey || settings.tavilyApiKey;
    const targetCity = city || 'Ciudad de México';
    const todayDateStr = new Date().toISOString().split('T')[0];
    const cleanQuery = (query || '').toLowerCase().trim();
    const cacheKey = `${targetCity.toLowerCase()}_${todayDateStr}_${cleanQuery}`;

    // 1. Check if daily cache exists for this city & date & query
    if (dailyEventsCache.has(cacheKey)) {
      const cached = dailyEventsCache.get(cacheKey);
      console.log(`[DailyCache HIT] Returning cached events for ${cacheKey}`);
      return {
        ...cached,
        cached: true,
        cacheDate: todayDateStr
      };
    }

    // 2. If missing API Key and not in cache, throw missing key error
    if (!targetKey) {
      throw new Error('MISSING_API_KEY');
    }

    // 3. Fetch live web results from Tavily API
    console.log(`[Tavily API FETCH] Querying live web events for ${cacheKey}`);
    const results = await this.tavilyRepository.searchEvents(query, targetCity, targetKey);

    // 4. Store results in daily cache with 24-hour expiration
    dailyEventsCache.set(cacheKey, results);

    return {
      ...results,
      cached: false,
      cacheDate: todayDateStr
    };
  }

  // Method to clear outdated cache entries if needed
  clearCache() {
    dailyEventsCache.clear();
  }
}
