import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'midnight-gold' | 'ivory-editorial' | 'modern-studio';

export interface ThemeOption {
  id: Theme;
  label: string;
  name: string;
  paletteDescription: string;
  accentColor: string;
  bgPreview: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'ivory-editorial',
    label: 'Ivory Editorial',
    name: 'Theme A — Ivory Editorial (Default)',
    paletteDescription: 'Soft ivory #F7F4ED, deep navy text #10172E, refined gold details',
    accentColor: '#C68A27',
    bgPreview: '#F7F4ED',
  },
  {
    id: 'midnight-gold',
    label: 'Midnight Gold',
    name: 'Theme B — Midnight Gold',
    paletteDescription: 'Deep navy #10172E, warm gold #E9B13F, cinematic lighting',
    accentColor: '#E9B13F',
    bgPreview: '#10172E',
  },
  {
    id: 'modern-studio',
    label: 'Modern Studio',
    name: 'Theme C — Modern Studio',
    paletteDescription: 'Charcoal #0D1017, soft white text, electric blue accents #4E80EE',
    accentColor: '#4E80EE',
    bgPreview: '#0D1017',
  },
];

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const themeVersion = localStorage.getItem('gdp_theme_default_version');
      if (themeVersion !== 'ivory_default_v1') {
        // Establish Ivory Editorial as default across browsers
        localStorage.setItem('gdp_theme_default_version', 'ivory_default_v1');
        localStorage.setItem('gdp_theme', 'ivory-editorial');
        return 'ivory-editorial';
      }

      const saved = localStorage.getItem('gdp_theme');
      if (saved === 'ivory-editorial' || saved === 'midnight-gold' || saved === 'modern-studio') {
        return saved;
      }
      // Migrate legacy 'dark' / 'light'
      if (saved === 'light') return 'ivory-editorial';
      if (saved === 'dark') return 'midnight-gold';
    }
    return 'ivory-editorial';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'midnight-gold', 'ivory-editorial', 'modern-studio');

    if (theme === 'ivory-editorial') {
      root.classList.add('light', 'ivory-editorial');
    } else if (theme === 'modern-studio') {
      root.classList.add('dark', 'modern-studio');
    } else {
      root.classList.add('dark', 'midnight-gold');
    }

    root.setAttribute('data-theme', theme);
    localStorage.setItem('gdp_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'ivory-editorial') return 'midnight-gold';
      if (prev === 'midnight-gold') return 'modern-studio';
      return 'ivory-editorial';
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const isDark = theme !== 'ivory-editorial';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
