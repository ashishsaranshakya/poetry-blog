import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { PoemsContext } from '../context/PoemsContext';

export const PoemShortBox = ({ poem }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { favorites, toggleFavorite } = useContext(PoemsContext);

  const isFavorite = favorites.includes(poem.id);

  const handleFavoriteToggle = async () => {
    await toggleFavorite(poem.id);
  };

  return (
    <div key={poem.id} className={`relative p-4 border rounded ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black'}`}>
      
      <button
        onClick={handleFavoriteToggle}
        className="absolute top-4 right-4 text-xl"
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      <h3 className="text-lg md:text-xl font-medium mb-4 mr-8">{poem.title}</h3>
      <pre className="whitespace-pre-wrap">{poem.content.slice(0, 10).join('\n')}</pre>
      
      <Link to={`/poems/${poem.id}`} className={`text-blue-500 underline mt-2 block`}>
        Show More
      </Link>
    </div>
  );
};
