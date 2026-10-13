import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES, DEFAULT_THEME } from '../theme/themes';
import settingsHandler from '../services/settingsHandler';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKey] = useState(() => settingsHandler.getTheme());
  const [useWebGames, setUseWebGamesState] = useState(() => settingsHandler.getUseWebGames());

  useEffect(() => {
    // Subscribe to settings changes via settingsHandler
    const unsubscribe = settingsHandler.subscribe((allSettings) => {
      if (allSettings.themeKey && THEMES[allSettings.themeKey]) {
        setThemeKey(allSettings.themeKey);
      }
      setUseWebGamesState(Boolean(allSettings.useWebGames));
    });
    return unsubscribe;
  }, []);

  const changeTheme = (key) => {
    if (THEMES[key]) {
      setThemeKey(key);
      settingsHandler.setTheme(key);
    }
  };

  const setUseWebGames = (val) => {
    setUseWebGamesState(Boolean(val));
    settingsHandler.setUseWebGames(Boolean(val));
  };

  const toggleUseWebGames = () => {
    const nextVal = !useWebGames;
    setUseWebGamesState(nextVal);
    settingsHandler.setUseWebGames(nextVal);
  };

  const theme = THEMES[themeKey] || THEMES[DEFAULT_THEME];

  return (
    <ThemeContext.Provider
      value={{
        themeKey,
        theme,
        changeTheme,
        themes: Object.values(THEMES),
        useWebGames,
        setUseWebGames,
        toggleUseWebGames,
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
