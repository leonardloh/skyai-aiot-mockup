import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Default to light mode as requested
  const [theme, setTheme] = useState<Theme>('light');

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('skyai-theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    }
  }, []);

  // Update localStorage and apply theme when theme changes
  useEffect(() => {
    localStorage.setItem('skyai-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update root CSS variables based on theme
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--color-background-main', '#e5e5e5');
      root.style.setProperty('--color-background-container', '#1a1a1a');
      root.style.setProperty('--color-background-card', '#2a2a2a');
      root.style.setProperty('--color-background-nested', '#333333');
      root.style.setProperty('--color-text-primary', '#ffffff');
      root.style.setProperty('--color-text-secondary', '#888888');
      root.style.setProperty('--color-border', '#444444');
      root.style.setProperty('--color-button-active', '#00AA00');
      root.style.setProperty('--color-button-inactive', 'transparent');
      root.style.setProperty('--color-success', '#00FF00');
      root.style.setProperty('--color-warning', '#FF6B6B');
    } else {
      root.style.setProperty('--color-background-main', '#F8F8F8');
      root.style.setProperty('--color-background-container', '#FFFFFF');
      root.style.setProperty('--color-background-card', '#FFFFFF');
      root.style.setProperty('--color-background-nested', '#F8F8F8');
      root.style.setProperty('--color-text-primary', '#252617');
      root.style.setProperty('--color-text-secondary', '#808080');
      root.style.setProperty('--color-border', '#E5E5E5');
      root.style.setProperty('--color-button-active', '#00AA00');
      root.style.setProperty('--color-button-inactive', '#F0F0F0');
      root.style.setProperty('--color-success', '#00AA00');
      root.style.setProperty('--color-warning', '#FF0000');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};