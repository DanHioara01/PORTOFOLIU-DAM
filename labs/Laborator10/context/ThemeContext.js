import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'themeMode';

export const PALETTES = {
  light: {
    background: '#FFFFFF',
    card: '#F4FAFD',
    text: '#0B1F3A',
    muted: '#5A6B7B',
    primary: '#0B1F3A',
    accent: '#1C7293',
    danger: '#B0392F',
    border: '#C9D6E0',
  },
  dark: {
    background: '#0B1F3A',
    card: '#142B4A',
    text: '#F4FAFD',
    muted: '#9FB3C8',
    primary: '#1C7293',
    accent: '#3FA7C9',
    danger: '#E57373',
    border: '#2A4467',
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark') setMode(saved);
      })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(KEY, mode);
  }, [mode, loaded]);

  const toggleTheme = useCallback(
    () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
    []
  );

  const value = useMemo(
    () => ({ mode, colors: PALETTES[mode], toggleTheme }),
    [mode, toggleTheme]
  );

  // Până nu știm tema salvată, nu randăm nimic: evităm o clipire în tema greșită
  if (!loaded) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme trebuie folosit în interiorul unui ThemeProvider');
  }
  return context;
}
