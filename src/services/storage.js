// Lightweight, Cross-Platform Storage Adapter
// Automatically uses AsyncStorage if installed, otherwise in-memory persistent store

let memoryStore = {};

let AsyncStorageModule = null;
try {
  AsyncStorageModule = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  // Fall back to memoryStore
}

export const setItem = async (key, value) => {
  try {
    const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
    memoryStore[key] = stringVal;
    if (AsyncStorageModule) {
      await AsyncStorageModule.setItem(key, stringVal);
    }
  } catch (error) {
    memoryStore[key] = typeof value === 'string' ? value : JSON.stringify(value);
  }
};

export const getItem = async (key) => {
  try {
    if (AsyncStorageModule) {
      const val = await AsyncStorageModule.getItem(key);
      if (val !== null) return val;
    }
    return memoryStore[key] || null;
  } catch (error) {
    return memoryStore[key] || null;
  }
};

export const removeItem = async (key) => {
  try {
    delete memoryStore[key];
    if (AsyncStorageModule) {
      await AsyncStorageModule.removeItem(key);
    }
  } catch (error) {
    delete memoryStore[key];
  }
};

export const clear = async () => {
  memoryStore = {};
  if (AsyncStorageModule) {
    try {
      await AsyncStorageModule.clear();
    } catch (e) {}
  }
};

// Convenience helpers
export const storeUserSession = (user) => setItem('@lazyeye_user_session', user);
export const getStoredUserSession = async () => {
  const val = await getItem('@lazyeye_user_session');
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch (e) {
    return null;
  }
};

export const removeUserSession = () => removeItem('@lazyeye_user_session');

export const storeTheme = (themeKey) => setItem('@lazyeye_theme', themeKey);
export const getStoredTheme = () => getItem('@lazyeye_theme');

