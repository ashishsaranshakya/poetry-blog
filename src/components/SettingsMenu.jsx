import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const SettingsMenu = ({ isOpen, onClose }) => {
  const {
		isDarkMode,
		theme,
    toggleTheme,
    isSmallScreen,
    fontSizeClass,
    setFontSizeClass,
    fontStyleClass,
    setFontStyleClass,
    lineHeightClass,
    setLineHeightClass
	} = useContext(ThemeContext);
  const [themeSelected, setThemeSelected] = useState(theme);

  if (!isOpen) return null;

  const baseFontSizeOptions = !isSmallScreen ?
    ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl']:
    ['text-xs', 'text-sm', 'text-base'];
  const currentFontSizeIndex = baseFontSizeOptions.indexOf(fontSizeClass);

  const fontStyleOptions = [
    { value: 'font-sans', label: 'Sans-serif' },
    { value: 'font-serif', label: 'Serif' },
    { value: 'font-typewriter', label: 'Typewriter' },
  ];

  const lineHeightOptions = [
    { value: 'leading-normal', label: 'Normal' },
    { value: 'leading-relaxed', label: 'Relaxed' },
    { value: 'leading-loose', label: 'Loose' },
  ];

  const increaseFontSize = () => {
    if (currentFontSizeIndex < baseFontSizeOptions.length - 1) {
      setFontSizeClass(baseFontSizeOptions[currentFontSizeIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    if (currentFontSizeIndex > 0) {
      setFontSizeClass(baseFontSizeOptions[currentFontSizeIndex - 1]);
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-[100] p-4 ${isDarkMode ? 'bg-black bg-opacity-75' : 'bg-gray-800 bg-opacity-75'}`}>
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-2xl
                      ${isDarkMode ? 'bg-gray-800 text-white border border-gray-800' : 'bg-gray-100 text-black border border-gray-100'}
                      transform transition-all duration-300 scale-100 opacity-100`}>
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 text-2xl p-1 rounded-full
                      ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'}`}
          aria-label="Close settings"
        >
          ✖️
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>

        <div className="mb-4">
          <label className="text-lg font-semibold mb-2 mr-4">Theme:</label>
          <select
            value={themeSelected}
					  onChange={(e) => {
						  console.log("Selected theme:", e.target.value);
						  toggleTheme(e.target.value)
						  setThemeSelected(e.target.value);
					  }}
            className={`w-full max-w-[150px] mx-auto px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Font Size:</label>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={decreaseFontSize}
              disabled={currentFontSizeIndex === 0}
              className={`w-12 p-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${currentFontSizeIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Decrease font size"
            >
              <pre className="text-md">A-</pre>
            </button>
            <span className={`${fontSizeClass} ${fontStyleClass}`}>Sample Text</span>
            <button
              onClick={increaseFontSize}
              disabled={currentFontSizeIndex === baseFontSizeOptions.length - 1}
              className={`w-12 p-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${currentFontSizeIndex === baseFontSizeOptions.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Increase font size"
            >
              <span className="text-xl">A+</span>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-lg font-semibold mb-2 mr-4">Font Style:</label>
          <select
            value={fontStyleClass}
            onChange={(e) => setFontStyleClass(e.target.value)}
            className={`w-full max-w-[150px] mx-auto px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
          >
            {fontStyleOptions.map(option => (
              <option key={option.value} value={option.value} className={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-lg font-semibold mb-2 mr-4">Line Spacing:</label>
          <select
            value={lineHeightClass}
            onChange={(e) => setLineHeightClass(e.target.value)}
            className={`w-full max-w-[150px] mx-auto px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
          >
            {lineHeightOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
