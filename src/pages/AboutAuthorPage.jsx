import React, { useContext } from "react";
import { SettingsContext } from '../context/SettingsContext';

const AboutAuthorPage = () => {
  const { isDarkMode, fontSizeClass, fontStyleClass, lineHeightClass, getRelativeFontSizeClass } = useContext(SettingsContext);

  const headingFontSize = getRelativeFontSizeClass(fontSizeClass, 3);
  const textFontSize = getRelativeFontSizeClass(fontSizeClass, -1);
  return (
    <div className={`flex items-center justify-center`}>
      <div className={`max-w-2xl w-full rounded-xl shadow-lg p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-900' : 'bg-white border-gray-100'}`}>
        <h1 className={`${headingFontSize} font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-black'} ${fontStyleClass}`}>About The Author</h1>
        <div className={`space-y-2 text-center ${textFontSize} ${fontStyleClass} ${lineHeightClass} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <p>
            <span className="font-semibold">Ashish Saran Shakya</span> is a poet and software developer, originally from Aliganj, Uttar Pradesh, and currently based in Pune. He is currently interning at UBS as a backend developer, balancing the logic of programming with the lyrical rhythm of poetry.
          </p>
          <p>
            His journey into writing began spontaneously in 2022 and has since grown into a space of deep introspection and expression. Ashish's poetry often explores solitude, emotional weight, and fleeting moments, weaving atmospheric imagery with themes like existential tension, personal control, longing, and memory. He also writes about love, heartbreak, nature, and anything that stirs thought or emotion.
          </p>
          <p>
            This platform is both a personal archive and a creative playground—meant to share his work and sharpen his frontend development skills. Ashish believes that every reader should walk away with their own unique interpretation of a poem. For him, meaning lies not in explanation, but in the quiet moments of connection a verse can spark.
          </p>
          <p>
            He is open to collaboration, feedback, and thoughtful conversation. Readers are welcome to connect with him via Instagram, to share interpretations, reactions, or just a moment of resonance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutAuthorPage;