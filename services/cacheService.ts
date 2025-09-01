const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CacheItem<T> {
  timestamp: number;
  data: T;
}

export const cacheService = {
  get: <T>(key: string): T | null => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }

    try {
      const item: CacheItem<T> = JSON.parse(itemStr);
      const now = Date.now();

      if (now - item.timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      localStorage.removeItem(key);
      return null;
    }
  },

  set: <T>(key: string, data: T): void => {
    try {
      const item: CacheItem<T> = {
        timestamp: Date.now(),
        data,
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  },

  clear: (key: string): void => {
    localStorage.removeItem(key);
  },
};
