import React, { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

const fontSizesList = [
  'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl',
  'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl', 'text-9xl'
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');

  const [fontSizeClass, setFontSizeClass] = useState(() => localStorage.getItem('globalPoemFontSize') || 'text-base');
  const [fontStyleClass, setFontStyleClass] = useState(() => localStorage.getItem('globalPoemFontStyle') || 'font-sans');
  const [lineHeightClass, setLineHeightClass] = useState(() => localStorage.getItem('globalPoemLineHeight') || 'leading-normal');

  const getRelativeFontSizeClass = (baseSizeClass, offset, maxIndex = fontSizesList.length - 1) => {
    const baseIndex = fontSizesList.indexOf(baseSizeClass);
    if (baseIndex === -1) {
      return baseSizeClass;
    }

    const targetIndex = Math.min(maxIndex, Math.max(0, baseIndex + offset));
    return fontSizesList[targetIndex];
  };

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    setIsDarkMode(newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  const setGlobalFontSize = (sizeClass) => {
    setFontSizeClass(sizeClass);
    localStorage.setItem('globalPoemFontSize', sizeClass);
  };

  const setGlobalFontStyle = (styleClass) => {
    setFontStyleClass(styleClass);
    localStorage.setItem('globalPoemFontStyle', styleClass);
  };

  const setGlobalLineHeight = (heightClass) => {
    setLineHeightClass(heightClass);
    localStorage.setItem('globalPoemLineHeight', heightClass);
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDarkMode,
        fontSizeClass,
        setFontSizeClass: setGlobalFontSize,
        fontStyleClass,
        setFontStyleClass: setGlobalFontStyle,
        lineHeightClass,
        setLineHeightClass: setGlobalLineHeight,
        getRelativeFontSizeClass, 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};