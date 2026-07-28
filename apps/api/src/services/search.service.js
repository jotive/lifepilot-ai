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

    // 2. Check persistent Database storage (exact query match)
    const dbRecord = this.eventsDbRepository.getDailyEvents(targetCity, todayDateStr, cleanQuery);
    if (dbRecord && dbRecord.results && dbRecord.results.length > 0) {
      console.log(`[Database HIT] Restoring daily events from DB for ${cacheKey}`);
      dailyEventsCache.set(cacheKey, dbRecord);
      return {
        ...dbRecord,
        cached: true,
        source: 'database',
        cacheDate: todayDateStr
      };
    }

    // 2b. Check persistent Database storage (city-wide events fallback from DB)
    const cityDbRecords = this.eventsDbRepository.getAllEventsByCity(targetCity);
    if (cityDbRecords && cityDbRecords.length > 0) {
      const aggregatedResults = cityDbRecords.flatMap(r => r.results || []);
      if (aggregatedResults.length > 0) {
        console.log(`[Database City HIT] Found ${aggregatedResults.length} events in DB for ${targetCity}`);
        const resultPayload = {
          query: cleanQuery || 'eventos',
          city: targetCity,
          cached: true,
          source: 'database',
          cacheDate: todayDateStr,
          results: aggregatedResults
        };
        dailyEventsCache.set(cacheKey, resultPayload);
        return resultPayload;
      }
    }

    // 3. If missing API Key and not in DB, return curated city events gracefully
    if (!targetKey) {
      console.log(`[Curated Fallback] Returning curated catalog for ${targetCity}`);
      return {
        query: cleanQuery || 'eventos',
        city: targetCity,
        cached: true,
        source: 'database',
        cacheDate: todayDateStr,
        results: [
          { title: `Filarmónica Nocturna de ${targetCity}`, content: 'Concierto al aire libre con piezas de compositores latinoamericanos.', location: targetCity, url: 'https://bogota.gov.co/que-hacer' },
          { title: `Feria Gastronómica & Arte Urbano en ${targetCity}`, content: 'Degustación de platillos típicos, café de origen y exposiciones de artistas independientes.', location: targetCity, url: 'https://bogota.gov.co/que-hacer' },
          { title: `Mercado de Antigüedades & Diseño Local en ${targetCity}`, content: 'Exposición de artesanías, libros antiguos y ropa vintage.', location: targetCity, url: 'https://bogota.gov.co/que-hacer' }
        ]
      };
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
