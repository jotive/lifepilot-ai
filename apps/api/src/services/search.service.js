import { TavilyRepository } from '../repositories/tavily.repository.js';
import { EventsDbRepository } from '../repositories/events-db.repository.js';
import { settings } from '../config/settings.js';

// Fast In-Memory Daily City Events Cache
const dailyEventsCache = new Map();

export class SearchService {
  constructor() {
    this.tavilyRepository = new TavilyRepository();
    this.eventsDbRepository = new EventsDbRepository();
  }

  async executeEventSearch(query, city, userApiKey) {
    const targetKey = userApiKey || settings.tavilyApiKey;
    const targetCity = city || 'Ciudad de México';
    const todayDateStr = new Date().toISOString().split('T')[0];
    const cleanQuery = (query || '').toLowerCase().trim();
    const cacheKey = `${targetCity.toLowerCase()}_${todayDateStr}_${cleanQuery}`;

    // 1. Check fast in-memory cache
    if (dailyEventsCache.has(cacheKey)) {
      const cached = dailyEventsCache.get(cacheKey);
      console.log(`[MemoryCache HIT] Returning events for ${cacheKey}`);
      return {
        ...cached,
        cached: true,
        source: 'memory',
        cacheDate: todayDateStr
      };
    }

    // 2. Check persistent Database storage
    const dbRecord = this.eventsDbRepository.getDailyEvents(targetCity, todayDateStr, cleanQuery);
    if (dbRecord && dbRecord.results) {
      console.log(`[Database HIT] Restoring daily events from DB for ${cacheKey}`);
      dailyEventsCache.set(cacheKey, dbRecord.results);
      return {
        ...dbRecord.results,
        cached: true,
        source: 'database',
        cacheDate: todayDateStr
      };
    }

    // 3. If missing API Key and not in cache/DB, throw missing key error
    if (!targetKey) {
      throw new Error('MISSING_API_KEY');
    }

    // 4. Fetch live web results from Tavily API
    console.log(`[Tavily API FETCH] Querying live web events for ${cacheKey}`);
    const results = await this.tavilyRepository.searchEvents(query, targetCity, targetKey);

    // 5. Save to Persistent Database and In-Memory Cache
    this.eventsDbRepository.saveDailyEvents(targetCity, todayDateStr, cleanQuery, results);
    dailyEventsCache.set(cacheKey, results);

    return {
      ...results,
      cached: false,
      source: 'live_web',
      cacheDate: todayDateStr
    };
  }

  clearCache() {
    dailyEventsCache.clear();
  }
}
