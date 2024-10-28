import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PoemsContext } from '../context/PoemsContext';
import { ThemeContext } from '../context/ThemeContext';
import PoemExport from "../components/PoemExport";
import download_black from '../assets/download_black.svg';
import download_white from '../assets/download_white.svg';

const PoemPage = () => {
  const { id } = useParams();
  const { poems, toggleFavorite } = useContext(PoemsContext);
  const { isDarkMode } = useContext(ThemeContext);

  const poem = poems.find((p) => p.id === id);

  const [isExportVisible, setExportVisible] = useState(false);

  if (!poem) {
    return <div>Poem not found.</div>;
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
        <p className='text-2xl'>
          {poem.isFavorite ? '❤️' : '🤍'}
        </p>
      </button>

      <h2 className="text-2xl font-bold mb-4">{poem.title.length > 0 ? poem.title : "Untitled"}</h2>
      {!!poem.themes && poem.themes.length > 0 && (
        <div className="mb-2">
          <span className="font-bold">Themes:</span> {poem.themes.join(', ')}
        </div>
      )}
      <pre className="whitespace-pre-wrap">{poem.content.join('\n')}</pre>

      <button
        onClick={handleDownloadClick}
        className="absolute right-6 bottom-6 rounded"
      >
        <img src={isDarkMode ? download_white : download_black} alt="logout" className="w-8 h-8" />
      </button>

      {isExportVisible && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isDarkMode ? 'bg-black bg-opacity-75' : 'bg-white bg-opacity-75'}`}>
          <PoemExport {...poem} />
          <button onClick={handleCloseExport} className="absolute top-2 right-2 text-xl">✖️</button>
        </div>
      )}
    </div>
  );
};

export default PoemPage;
