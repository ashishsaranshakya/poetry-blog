import React, { useContext } from 'react';
import { PoemsContext } from '../context/PoemsContext';
import LoadingSpinner from './LoadingSpinner';
import { ThemeContext } from '../context/ThemeContext';

const PoemDetail = ({ poem }) => {
  const { favorites, toggleFavorite, loading } = useContext(PoemsContext);
  const { isDarkMode } = useContext(ThemeContext);

  if (loading) {
    return <LoadingSpinner/>;
  }

  const isFavorite = favorites.includes(poem.id);

  return (
    <div className={`py-4 border-b ${isFavorite ? 'border-red-500' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} transition-all duration-300`}>
      <h2 className="text-xl font-bold mb-4">{poem.title}</h2>
      <div className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {poem.content.map((line, index) =>
          line ? (
            <p key={index}>{line}</p>
          ) : (
            <br key={index} />
          )
        )}
      </div>

      <button
        onClick={() => toggleFavorite(poem.id)}
        className={`favorite-btn ${isFavorite ? 'text-red-500' : 'text-gray-400'} transition-colors duration-300`}
      >
        {isFavorite ? '❤️ Unfavorite' : '♡ Favorite'}
      </button>
    </div>
  );
};

export default PoemDetail;
