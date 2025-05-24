import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PoemsContext } from '../context/PoemsContext';
import { ThemeContext } from '../context/ThemeContext';
import PoemExport from "../components/PoemExport";
import download_black from '../assets/download_black.svg';
import download_white from '../assets/download_white.svg';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const PoemPage = () => {
  const { id } = useParams();
  const { loading, poems, favorites, toggleFavorite, countPoemRead, setTitle } = useContext(PoemsContext);
  const { isDarkMode } = useContext(ThemeContext);
  if (loading) {
		return <LoadingSpinner />;
	}
  useEffect(() => {
    const handleReadCount = async () => {
      await countPoemRead(id);
    };
    handleReadCount();
    setTitle(poem.title.length > 0 ? poem.title : "Untitled");
  }, [id]);

  const poem = poems.find((p) => p.id === id);
  const isFavorite = favorites.includes(poem.id);

  const [isExportVisible, setExportVisible] = useState(false);

  if (!poem) {
    return <div className={`relative p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} transition-all duration-300`}>Poem not found.</div>;
  }

  const handleFavoriteToggle = async () => {
    await toggleFavorite(poem.id);
  };

  const handleDownloadClick = () => {
    setExportVisible(true);
  };

  const handleCloseExport = () => {
    setExportVisible(false);
  };

  return (
    <div className={`relative p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} transition-all duration-300`}>
      <button
        onClick={handleFavoriteToggle}
        className="absolute top-6 right-6 rounded"
      >
        <p className='text-xl md:text-2xl'>
          {isFavorite ? '❤️' : '🤍'}
        </p>
      </button>

      <h2 className="text-xl md:text-2xl font-bold mb-2 mr-12">{poem.title.length > 0 ? poem.title : "Untitled"}</h2>
      {!!poem.themes && poem.themes.length > 0 && (
        <div className="text-sm md:text-base mb-2">
          <span className="font-bold">Themes:</span> {poem.themes.join(', ')}
        </div>
      )}
      
      {poem.content.length > 0 && (
        <div>
          <pre className="text-xs md:text-base whitespace-pre-wrap">{poem.content.slice(0, -1).join('\n')}</pre>
          <pre className="text-xs md:text-base whitespace-pre-wrap mr-12">{poem.content[poem.content.length - 1]}</pre>
        </div>
      )}

      <button
        onClick={handleDownloadClick}
        className="absolute right-6 bottom-6 rounded"
      >
        <img src={isDarkMode ? download_white : download_black} alt="download" className="w-8 h-8" />
      </button>

      {isExportVisible && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isDarkMode ? 'bg-black bg-opacity-75' : 'bg-white bg-opacity-75'}`}>
          <PoemExport {...poem} />
          <button onClick={handleCloseExport} className="absolute top-4 right-4 text-xl">✖️</button>
        </div>
      )}
    </div>
  );
};

export default PoemPage;