import React, { createContext, useEffect, useState } from 'react';

export const SettingsContext = createContext();

const fontSizesList = [
  'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl',
  'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl', 'text-9xl'
];

const MD_BREAKPOINT = 768;

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < MD_BREAKPOINT);

  const [fontSizeClass, setFontSizeClass] = useState(() => localStorage.getItem('globalPoemFontSize') || 'text-base');
  const [fontStyleClass, setFontStyleClass] = useState(() => localStorage.getItem('globalPoemFontStyle') || 'font-sans');
  const [lineHeightClass, setLineHeightClass] = useState(() => localStorage.getItem('globalPoemLineHeight') || 'leading-normal');

  const [ttsVoices, setTtsVoices] = useState([]);
  const [ttsVoice, setTtsVoiceState] = useState(() => localStorage.getItem('ttsVoice') || null);
  const [ttsRate, setTtsRateState] = useState(() => {
    const stored = localStorage.getItem('ttsRate');
    return stored ? Number(stored) : 1;
  });

  const getRelativeFontSizeClass = (baseSizeClass, offset, maxIndex = !isSmallScreen ? fontSizesList.length - 1 : 5) => {
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

  const setTtsVoice = (voice) => {
    setTtsVoiceState(voice);
    localStorage.setItem('ttsVoice', voice);
  };

  const setTtsRate = (rate) => {
    setTtsRateState(rate);
    localStorage.setItem('ttsRate', rate);
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < MD_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const populateVoices = () => {
      const availableVoices = synth.getVoices();
      const englishVoices = availableVoices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
      setTtsVoices(englishVoices);
      if (!ttsVoice && englishVoices.length > 0) {
        setTtsVoice(englishVoices[0].voiceURI);
      }
    };
    populateVoices();
    synth.onvoiceschanged = populateVoices;
    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        theme,
        toggleTheme,
        isDarkMode,
        isSmallScreen,
        fontSizeClass,
        setFontSizeClass: setGlobalFontSize,
        fontStyleClass,
        setFontStyleClass: setGlobalFontStyle,
        lineHeightClass,
        setLineHeightClass: setGlobalLineHeight,
        getRelativeFontSizeClass,
        ttsVoices,
        ttsVoice,
        setTtsVoice,
        ttsRate,
        setTtsRate
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};