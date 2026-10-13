/**
 * Centralized Settings Handler
 * Powered by MMKVStorage for zero-latency synchronous reads and reactive persistence.
 */

import MMKVStorage from './mmkvStorage';

// Storage Key Constants
export const SETTINGS_KEYS = {
  THEME: '@lazyeye_pref_theme',
  USE_WEB_GAMES: '@lazyeye_pref_use_web_games',
  DAILY_GOAL_MINS: '@lazyeye_pref_daily_goal_mins',
  SOUND_ENABLED: '@lazyeye_pref_sound_enabled',
  HAPTICS_ENABLED: '@lazyeye_pref_haptics_enabled',
  LEFT_EYE_COLOR: '@lazyeye_pref_left_eye_color',
  RIGHT_EYE_COLOR: '@lazyeye_pref_right_eye_color',
  LEFT_EYE_CONTRAST: '@lazyeye_pref_left_eye_contrast',
  RIGHT_EYE_CONTRAST: '@lazyeye_pref_right_eye_contrast',
  NOTIFICATIONS_ENABLED: '@lazyeye_pref_notifications_enabled',
  ACTIVE_TAB: '@lazyeye_pref_active_tab',
};

// Default Settings Values
export const DEFAULT_SETTINGS = {
  themeKey: 'modern',
  useWebGames: false,
  dailyGoalMins: 20,
  soundEnabled: true,
  hapticsEnabled: true,
  leftEyeColor: '#EF4444',
  rightEyeColor: '#0284C7',
  leftEyeContrast: 255,
  rightEyeContrast: 255,
  notificationsEnabled: true,
  activeTab: 'Overview',
};

class SettingsHandler {
  constructor() {
    this.subscribers = new Set();

    // Listen to changes in MMKVStorage to propagate to subscribers
    MMKVStorage.addOnValueChangedListener((key, value) => {
      this.notifySubscribers(key, value);
    });
  }

  /**
   * Get all active settings synchronously
   */
  getAllSettings() {
    return {
      themeKey: MMKVStorage.getString(SETTINGS_KEYS.THEME, DEFAULT_SETTINGS.themeKey),
      useWebGames: MMKVStorage.getBoolean(SETTINGS_KEYS.USE_WEB_GAMES, DEFAULT_SETTINGS.useWebGames),
      dailyGoalMins: MMKVStorage.getNumber(SETTINGS_KEYS.DAILY_GOAL_MINS, DEFAULT_SETTINGS.dailyGoalMins),
      soundEnabled: MMKVStorage.getBoolean(SETTINGS_KEYS.SOUND_ENABLED, DEFAULT_SETTINGS.soundEnabled),
      hapticsEnabled: MMKVStorage.getBoolean(SETTINGS_KEYS.HAPTICS_ENABLED, DEFAULT_SETTINGS.hapticsEnabled),
      leftEyeColor: MMKVStorage.getString(SETTINGS_KEYS.LEFT_EYE_COLOR, DEFAULT_SETTINGS.leftEyeColor),
      rightEyeColor: MMKVStorage.getString(SETTINGS_KEYS.RIGHT_EYE_COLOR, DEFAULT_SETTINGS.rightEyeColor),
      leftEyeContrast: MMKVStorage.getNumber(SETTINGS_KEYS.LEFT_EYE_CONTRAST, DEFAULT_SETTINGS.leftEyeContrast),
      rightEyeContrast: MMKVStorage.getNumber(SETTINGS_KEYS.RIGHT_EYE_CONTRAST, DEFAULT_SETTINGS.rightEyeContrast),
      notificationsEnabled: MMKVStorage.getBoolean(SETTINGS_KEYS.NOTIFICATIONS_ENABLED, DEFAULT_SETTINGS.notificationsEnabled),
      activeTab: MMKVStorage.getString(SETTINGS_KEYS.ACTIVE_TAB, DEFAULT_SETTINGS.activeTab),
    };
  }

  // --- Specific Getters ---
  getTheme() {
    return MMKVStorage.getString(SETTINGS_KEYS.THEME, DEFAULT_SETTINGS.themeKey);
  }

  getUseWebGames() {
    return MMKVStorage.getBoolean(SETTINGS_KEYS.USE_WEB_GAMES, DEFAULT_SETTINGS.useWebGames);
  }

  getDailyGoal() {
    return MMKVStorage.getNumber(SETTINGS_KEYS.DAILY_GOAL_MINS, DEFAULT_SETTINGS.dailyGoalMins);
  }

  getSoundEnabled() {
    return MMKVStorage.getBoolean(SETTINGS_KEYS.SOUND_ENABLED, DEFAULT_SETTINGS.soundEnabled);
  }

  getHapticsEnabled() {
    return MMKVStorage.getBoolean(SETTINGS_KEYS.HAPTICS_ENABLED, DEFAULT_SETTINGS.hapticsEnabled);
  }

  getLeftEyeColor() {
    return MMKVStorage.getString(SETTINGS_KEYS.LEFT_EYE_COLOR, DEFAULT_SETTINGS.leftEyeColor);
  }

  getRightEyeColor() {
    return MMKVStorage.getString(SETTINGS_KEYS.RIGHT_EYE_COLOR, DEFAULT_SETTINGS.rightEyeColor);
  }

  getActiveTab() {
    return MMKVStorage.getString(SETTINGS_KEYS.ACTIVE_TAB, DEFAULT_SETTINGS.activeTab);
  }

  // --- Specific Setters ---
  setTheme(themeKey) {
    MMKVStorage.set(SETTINGS_KEYS.THEME, themeKey);
  }

  setUseWebGames(useWeb) {
    MMKVStorage.set(SETTINGS_KEYS.USE_WEB_GAMES, Boolean(useWeb));
  }

  setDailyGoal(minutes) {
    MMKVStorage.set(SETTINGS_KEYS.DAILY_GOAL_MINS, Number(minutes) || 20);
  }

  setSoundEnabled(enabled) {
    MMKVStorage.set(SETTINGS_KEYS.SOUND_ENABLED, Boolean(enabled));
  }

  setHapticsEnabled(enabled) {
    MMKVStorage.set(SETTINGS_KEYS.HAPTICS_ENABLED, Boolean(enabled));
  }

  setLeftEyeColor(hexColor) {
    MMKVStorage.set(SETTINGS_KEYS.LEFT_EYE_COLOR, hexColor);
  }

  setRightEyeColor(hexColor) {
    MMKVStorage.set(SETTINGS_KEYS.RIGHT_EYE_COLOR, hexColor);
  }

  setContrastCalibration(leftVal, rightVal) {
    MMKVStorage.set(SETTINGS_KEYS.LEFT_EYE_CONTRAST, Number(leftVal));
    MMKVStorage.set(SETTINGS_KEYS.RIGHT_EYE_CONTRAST, Number(rightVal));
  }

  setActiveTab(tabName) {
    MMKVStorage.set(SETTINGS_KEYS.ACTIVE_TAB, tabName);
  }

  /**
   * Reset all settings to default
   */
  resetToDefaults() {
    Object.keys(DEFAULT_SETTINGS).forEach((key) => {
      const storageKey = SETTINGS_KEYS[key.toUpperCase()] || `@lazyeye_pref_${key}`;
      MMKVStorage.delete(storageKey);
    });
  }

  /**
   * Subscribe to settings change
   * @param {Function} callback (newSettings) => void
   * @returns {Function} unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(key, val) {
    const all = this.getAllSettings();
    this.subscribers.forEach((cb) => {
      try {
        cb(all, key, val);
      } catch (e) {}
    });
  }
}

export const settingsHandler = new SettingsHandler();
export default settingsHandler;

