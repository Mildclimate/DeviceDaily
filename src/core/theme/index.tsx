/**
 * 主题设计 tokens：颜色 / 间距 / 字号 / 圆角
 * 亮暗色共用 spacing/typography，颜色随系统切换
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

export interface Palette {
  background: string;
  card: string;
  text: string;
  subText: string;
  accent: string;
  accentSoft: string;
  border: string;
  danger: string;
  success: string;
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const font = {
  title: 28,
  heading: 20,
  body: 16,
  caption: 13,
  mini: 11,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

const light: Palette = {
  background: '#F5F5F7',
  card: '#FFFFFF',
  text: '#1C1C1E',
  subText: '#8E8E93',
  accent: '#0A84FF',
  accentSoft: '#E5F1FF',
  border: '#E5E5EA',
  danger: '#FF3B30',
  success: '#34C759',
};

const dark: Palette = {
  background: '#000000',
  card: '#1C1C1E',
  text: '#F5F5F7',
  subText: '#8E8E93',
  accent: '#0A84FF',
  accentSoft: '#0A2540',
  border: '#2C2C2E',
  danger: '#FF453A',
  success: '#30D158',
};

export interface Theme {
  dark: boolean;
  colors: Palette;
  spacing: typeof spacing;
  font: typeof font;
  radius: typeof radius;
}

const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const scheme = useColorScheme();
  const theme = useMemo<Theme>(
    () => ({
      dark: scheme === 'dark',
      colors: scheme === 'dark' ? dark : light,
      spacing,
      font,
      radius,
    }),
    [scheme],
  );
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
