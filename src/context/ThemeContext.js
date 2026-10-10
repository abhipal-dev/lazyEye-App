import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES, DEFAULT_THEME } from '../theme/themes';
import { getStoredTheme, storeTheme } from '../services/storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKey] = useState(DEFAULT_THEME);

  useEffect(() => {
    // Load stored theme on boot
    const loadTheme = async () => {
      try {
        const saved = await getStoredTheme();
        if (saved && THEMES[saved]) {
          setThemeKey(saved);
        }
      } catch (e) {
        // Fallback to default
      }
    };
    loadTheme();
  }, []);

  const changeTheme = async (key) => {
    if (THEMES[key]) {
      setThemeKey(key);
      await storeTheme(key);
    }
  };

  const theme = THEMES[themeKey] || THEMES[DEFAULT_THEME];

  return (
    <ThemeContext.Provider
      value={{
        themeKey,
        theme,
        changeTheme,
        themes: Object.values(THEMES),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

