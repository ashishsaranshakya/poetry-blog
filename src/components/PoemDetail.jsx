import React, { useContext } from 'react';
import { PoemsContext } from '../context/PoemsContext';
import LoadingSpinner from './LoadingSpinner';
import { ThemeContext } from '../context/ThemeContext';

const PoemDetail = ({ poem }) => {
  const { favorites, toggleFavorite, loading } = useContext(PoemsContext);
  const { theme } = useContext(ThemeContext);

  if (loading) {
    return <LoadingSpinner/>;
  }

  const isFavorite = favorites.includes(poem.id);

  return (
    <div className={`p-4 pt-8 border-b ${isFavorite ? 'border-red-500' : 'border-gray-300'} ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} transition-all duration-300`}>
      <h2 className="text-2xl font-bold">{poem.title}</h2>
      <div className={`mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
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
