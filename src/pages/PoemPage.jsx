import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PoemsContext } from '../context/PoemsContext';
import { ThemeContext } from '../context/ThemeContext';
import PoemExport from "../components/PoemExport";
import share_light from '../assets/share_light.svg';
import share_dark from '../assets/share_dark.svg';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import TextToSpeech from '../components/TextToSpeech';

const PoemPage = () => {
  const { id } = useParams();
  const { loading, poems, favorites, toggleFavorite, countPoemRead, setTitle } = useContext(PoemsContext);
  const { isDarkMode, fontSizeClass, fontStyleClass, lineHeightClass, getRelativeFontSizeClass } = useContext(ThemeContext);

  const poem = poems.find((p) => p.id === id);

  const [isExportVisible, setExportVisible] = useState(false);

  useEffect(() => {
    if (!loading) {
      const handleReadCountAndTitle = async () => {
        await countPoemRead(id);
        setTitle(poem.title.length > 0 ? poem.title : "Untitled");
      };
      handleReadCountAndTitle();
    }
  }, [id, loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!poem) {
    return <div className={`relative p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} transition-all duration-300`}>Poem not found.</div>;
  }

  const isFavorite = favorites.includes(poem.id);

  const handleFavoriteToggle = async () => {
    await toggleFavorite(poem.id);
  };

  const handleDownloadClick = () => {
    setExportVisible(true);
  };

  const handleCloseExport = () => {
    setExportVisible(false);
  };

  const poemTitleClass = getRelativeFontSizeClass(fontSizeClass, 3);

  return (
    <div className={`relative p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} transition-all duration-300`}>
      <button
        onClick={handleFavoriteToggle}
        className="absolute top-6 right-6 rounded z-20"
      >
        <p className='text-xl md:text-2xl'>
          {isFavorite ? '❤️' : '🤍'}
        </p>
      </button>
      <div className="absolute top-20 right-6 rounded z-20">
        <TextToSpeech text={poem.content.join('\n')} />
      </div>

      <div className="pr-4">
        <h2 className={`${poemTitleClass} font-bold mb-2 mr-12 ${fontStyleClass} ${lineHeightClass}`}>
          {poem.title.length > 0 ? poem.title : "Untitled"}
        </h2>
        {!!poem.themes && poem.themes.length > 0 && (
          <div className={`${fontSizeClass} ${fontStyleClass} ${lineHeightClass} italic mb-2`}>
            <span className="font-semibold">Themes:</span> {poem.themes.join(', ')}
          </div>
        )}
        
        {poem.content.length > 0 && (
          <div>
            <pre className={`${fontSizeClass} ${fontStyleClass} ${lineHeightClass} whitespace-pre-wrap`}>
              {poem.content.slice(0, -1).join('\n')}
            </pre>
            <pre className={`${fontSizeClass} ${fontStyleClass} ${lineHeightClass} whitespace-pre-wrap mr-12 `}>
              {poem.content[poem.content.length - 1]}
            </pre>
          </div>
        )}
      </div>

      <button
        onClick={handleDownloadClick}
        className="absolute right-6 bottom-6 rounded z-20"
        title="Download Poem"
      >
        <img src={isDarkMode ? share_dark : share_light} alt="download" className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {isExportVisible && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isDarkMode ? 'bg-black bg-opacity-75' : 'bg-white bg-opacity-75'}`}>
          <PoemExport {...poem} showName />
          <button onClick={handleCloseExport} className="absolute top-4 right-4 text-xl text-white">✖️</button>
        </div>
      )}
    </div>
  );
};

export default PoemPage;