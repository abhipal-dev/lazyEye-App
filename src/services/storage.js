// Enhanced Storage Adapter backed by MMKVStorage
import MMKVStorage from './mmkvStorage';

export const setItem = async (key, value) => {
  MMKVStorage.set(key, value);
};

export const getItem = async (key) => {
  return MMKVStorage.getString(key, null);
};

export const removeItem = async (key) => {
  MMKVStorage.delete(key);
};

export const clear = async () => {
  MMKVStorage.clearAll();
};

// Convenience helpers
export const storeUserSession = (user) => {
  MMKVStorage.set('@lazyeye_user_session', user);
};

export const getStoredUserSession = async () => {
  const val = MMKVStorage.getString('@lazyeye_user_session');
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch (e) {
    return null;
  }
};

export const removeUserSession = () => {
  MMKVStorage.delete('@lazyeye_user_session');
};

export const storeTheme = (themeKey) => {
  MMKVStorage.set('@lazyeye_pref_theme', themeKey);
};

export const getStoredTheme = () => {
  return MMKVStorage.getString('@lazyeye_pref_theme', 'modern');
};

export const storeGameEngineMode = (useWeb) => {
  MMKVStorage.set('@lazyeye_pref_use_web_games', Boolean(useWeb));
};

export const getStoredGameEngineMode = async () => {
  return MMKVStorage.getBoolean('@lazyeye_pref_use_web_games', false);
};

export default {
  setItem,
  getItem,
  removeItem,
  clear,
  storeUserSession,
  getStoredUserSession,
  removeUserSession,
  storeTheme,
  getStoredTheme,
  storeGameEngineMode,
  getStoredGameEngineMode,
};
