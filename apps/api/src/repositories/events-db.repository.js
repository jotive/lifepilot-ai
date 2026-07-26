import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DB_DIR, 'events_db.json');

export class EventsDbRepository {
  constructor() {
    this._ensureDbExists();
  }

  _ensureDbExists() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ events: {} }, null, 2), 'utf-8');
      }
    } catch (err) {
      console.warn('EventsDbRepository init warning:', err.message);
    }
  }

  _readDb() {
    try {
      this._ensureDbExists();
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content || '{"events":{}}');
    } catch (err) {
      console.warn('EventsDbRepository read error:', err.message);
      return { events: {} };
    }
  }

  _writeDb(data) {
    try {
      this._ensureDbExists();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('EventsDbRepository write error:', err.message);
    }
  }

  /**
   * Fetch cached daily events from persistent DB
   */
  getDailyEvents(city, dateStr, queryKey = 'default') {
    const db = this._readDb();
    const storageKey = `${city.toLowerCase()}_${dateStr}_${queryKey.toLowerCase()}`;
    const record = db.events[storageKey];

    if (record) {
      console.log(`[Database HIT] Found daily events in DB for ${storageKey}`);
      return record;
    }
    return null;
  }

  /**
   * Save daily web events to persistent DB
   */
  saveDailyEvents(city, dateStr, queryKey = 'default', results) {
    const db = this._readDb();
    const storageKey = `${city.toLowerCase()}_${dateStr}_${queryKey.toLowerCase()}`;

    const record = {
      city,
      date: dateStr,
      queryKey,
      results,
      savedAt: new Date().toISOString()
    };

    db.events[storageKey] = record;
    this._writeDb(db);
    console.log(`[Database SAVED] Persisted daily events to DB for ${storageKey}`);
    return record;
  }

  /**
   * Query all stored historical events by city
   */
  getAllEventsByCity(city) {
    const db = this._readDb();
    const cityLower = city.toLowerCase();
    const records = [];

    for (const key in db.events) {
      if (key.startsWith(cityLower)) {
        records.push(db.events[key]);
      }
    }
    return records;
  }
}
