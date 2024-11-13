// composables/useCache.js
export const useCache = () => {
  const CACHE_VERSION = '1.0'; // Add versioning
  const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  const getCacheKey = (prefix, identifiers = {}) => {
    const parts = [prefix, CACHE_VERSION];
    Object.entries(identifiers).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        parts.push(`${key}:${value}`);
      }
    });
    return parts.join('-');
  };

  const clearCache = (prefix = null) => {
    if (process.server) return;
    
    if (!prefix) {
      localStorage.clear();
      return;
    }

    // Clear only cache items starting with prefix
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  };

  const getCache = (key) => {
    if (process.server) return null;
    
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp, version } = JSON.parse(cached);
      
      // Version check
      if (version !== CACHE_VERSION) {
        localStorage.removeItem(key);
        return null;
      }

      // TTL check
      const cacheAge = Date.now() - timestamp;
      if (cacheAge > DEFAULT_TTL) {
        localStorage.removeItem(key);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Cache read error:', error);
      localStorage.removeItem(key);
      return null;
    }
  };

  const setCache = (key, data, ttl = DEFAULT_TTL) => {
    if (process.server) return;
    
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now(),
        version: CACHE_VERSION,
        ttl
      }));
    } catch (error) {
      console.error('Cache write error:', error);
      // If storage is full, clear old cache entries
      clearOldCache();
      try {
        // Try again after clearing
        localStorage.setItem(key, JSON.stringify({
          data,
          timestamp: Date.now(),
          version: CACHE_VERSION,
          ttl
        }));
      } catch (retryError) {
        console.error('Cache write retry failed:', retryError);
      }
    }
  };

  const clearOldCache = () => {
    if (process.server) return;
    
    Object.keys(localStorage).forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const { timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp > DEFAULT_TTL) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        // If entry is corrupted, remove it
        localStorage.removeItem(key);
      }
    });
  };

  return {
    getCacheKey,
    getCache,
    setCache,
    clearCache,
    clearOldCache
  };
};