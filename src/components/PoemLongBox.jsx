import React, { useContext } from 'react';
import { PoemsContext } from '../context/PoemsContext';
import LoadingSpinner from './LoadingSpinner';
import { ThemeContext } from '../context/ThemeContext';

const PoemDetail = ({ poem }) => {
  const { favorites, toggleFavorite, loading } = useContext(PoemsContext);
  const { isDarkMode } = useContext(ThemeContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  const isFavorite = favorites.includes(poem.id);

  return (
    <div className={`relative py-4 border-b ${isFavorite ? 'border-red-500' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} transition-all duration-300`}>
      
      <button
        onClick={() => toggleFavorite(poem.id)}
        className="absolute top-4 right-2 text-xl"
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      <h2 className="text-xl font-bold mb-4">{poem.title}</h2>
      <pre className="whitespace-pre-wrap">{poem.content.join('\n')}</pre>
    </div>
  );
};

export default PoemDetail;