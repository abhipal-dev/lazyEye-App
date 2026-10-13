/**
 * MMKV Storage Service for LazyEye Mobile
 * 
 * Provides high-speed synchronous storage conforming to the MMKV interface:
 * - set(key, value)
 * - getString(key, defaultValue)
 * - getNumber(key, defaultValue)
 * - getBoolean(key, defaultValue)
 * - delete(key)
 * - clearAll()
 * - getAllKeys()
 * - contains(key)
 * - addOnValueChangedListener(listener)
 * 
 * Synchronous in-memory access with automatic multi-tier fallback and persistence.
 */

import { Platform } from 'react-native';

// In-memory synchronous cache for zero-latency instant reads & writes
let memoryCache = {};
const listeners = new Set();

// Try native react-native-mmkv if available
let nativeMMKV = null;
try {
  const { MMKV } = require('react-native-mmkv');
  nativeMMKV = new MMKV({ id: 'lazyeye-storage' });
} catch (e) {
  // react-native-mmkv not linked or running in pure JS engine; use zero-latency synchronized cache
}

// Optional AsyncStorage fallback for background persistence
let AsyncStorageModule = null;
try {
  AsyncStorageModule = require('@react-native-async-storage/async-storage').default;
} catch (e) {}

// Hydrate memoryCache from AsyncStorage on startup if nativeMMKV is absent
const hydrateCache = async () => {
  if (nativeMMKV) return;
  if (!AsyncStorageModule) return;
  try {
    const keys = await AsyncStorageModule.getAllKeys();
    if (keys && keys.length > 0) {
      const pairs = await AsyncStorageModule.multiGet(keys);
      pairs.forEach(([k, v]) => {
        if (v !== null && v !== undefined) {
          memoryCache[k] = v;
        }
      });
    }
  } catch (err) {
    // Silent fallback
  }
};
hydrateCache();

export const MMKVStorage = {
  /**
   * Set a key-value pair synchronously
   * @param {string} key 
   * @param {string | number | boolean | object} value 
   */
  set: (key, value) => {
    let serialized;
    if (typeof value === 'boolean') {
      serialized = value ? 'true' : 'false';
    } else if (typeof value === 'number') {
      serialized = String(value);
    } else if (typeof value === 'string') {
      serialized = value;
    } else {
      serialized = JSON.stringify(value);
    }

    memoryCache[key] = serialized;

    if (nativeMMKV) {
      try {
        if (typeof value === 'boolean') nativeMMKV.set(key, value);
        else if (typeof value === 'number') nativeMMKV.set(key, value);
        else if (typeof value === 'string') nativeMMKV.set(key, value);
        else nativeMMKV.set(key, JSON.stringify(value));
      } catch (err) {
        // Fallback to memory
      }
    }

    if (AsyncStorageModule) {
      AsyncStorageModule.setItem(key, serialized).catch(() => {});
    }

    // Notify listeners
    listeners.forEach((listener) => {
      try {
        listener(key, value);
      } catch (e) {}
    });
  },

  /**
   * Get string value synchronously
   * @param {string} key 
   * @param {string} [defaultValue] 
   * @returns {string | undefined}
   */
  getString: (key, defaultValue) => {
    if (nativeMMKV) {
      try {
        const val = nativeMMKV.getString(key);
        if (val !== undefined && val !== null) return val;
      } catch (e) {}
    }
    const mem = memoryCache[key];
    if (mem !== undefined && mem !== null) return mem;
    return defaultValue;
  },

  /**
   * Get number value synchronously
   * @param {string} key 
   * @param {number} [defaultValue] 
   * @returns {number | undefined}
   */
  getNumber: (key, defaultValue) => {
    if (nativeMMKV) {
      try {
        const val = nativeMMKV.getNumber(key);
        if (val !== undefined && !isNaN(val)) return val;
      } catch (e) {}
    }
    const mem = memoryCache[key];
    if (mem !== undefined && mem !== null) {
      const num = Number(mem);
      if (!isNaN(num)) return num;
    }
    return defaultValue;
  },

  /**
   * Get boolean value synchronously
   * @param {string} key 
   * @param {boolean} [defaultValue] 
   * @returns {boolean | undefined}
   */
  getBoolean: (key, defaultValue) => {
    if (nativeMMKV) {
      try {
        const val = nativeMMKV.getBoolean(key);
        if (typeof val === 'boolean') return val;
      } catch (e) {}
    }
    const mem = memoryCache[key];
    if (mem !== undefined && mem !== null) {
      if (mem === 'true' || mem === true) return true;
      if (mem === 'false' || mem === false) return false;
    }
    return defaultValue;
  },

  /**
   * Check if key exists
   * @param {string} key 
   * @returns {boolean}
   */
  contains: (key) => {
    if (nativeMMKV) {
      try {
        return nativeMMKV.contains(key);
      } catch (e) {}
    }
    return key in memoryCache;
  },

  /**
   * Delete a key synchronously
   * @param {string} key 
   */
  delete: (key) => {
    delete memoryCache[key];
    if (nativeMMKV) {
      try {
        nativeMMKV.delete(key);
      } catch (e) {}
    }
    if (AsyncStorageModule) {
      AsyncStorageModule.removeItem(key).catch(() => {});
    }
    listeners.forEach((listener) => {
      try {
        listener(key, undefined);
      } catch (e) {}
    });
  },

  /**
   * Clear all storage synchronously
   */
  clearAll: () => {
    memoryCache = {};
    if (nativeMMKV) {
      try {
        nativeMMKV.clearAll();
      } catch (e) {}
    }
    if (AsyncStorageModule) {
      AsyncStorageModule.clear().catch(() => {});
    }
    listeners.forEach((listener) => {
      try {
        listener(null, null);
      } catch (e) {}
    });
  },

  /**
   * Get all storage keys
   * @returns {string[]}
   */
  getAllKeys: () => {
    if (nativeMMKV) {
      try {
        return nativeMMKV.getAllKeys();
      } catch (e) {}
    }
    return Object.keys(memoryCache);
  },

  /**
   * Listen for key updates
   * @param {Function} listener (key, value) => void
   * @returns {Function} unsubscribe function
   */
  addOnValueChangedListener: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export default MMKVStorage;

