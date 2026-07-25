export class StorageUtil {
  static get(key, defaultValue) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('LocalStorage save failed:', error);
    }
  }

  static getString(key, defaultValue) {
    return localStorage.getItem(key) || defaultValue;
  }

  static setString(key, value) {
    localStorage.setItem(key, value);
  }
}
