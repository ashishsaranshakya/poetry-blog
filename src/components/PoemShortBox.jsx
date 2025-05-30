import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { PoemsContext } from '../context/PoemsContext';

const PoemShortBox = ({ poem }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user, favorites, toggleFavorite } = useContext(PoemsContext);

  const isFavorite = favorites.includes(poem.id);

  const content = poem.content
    .slice(0, 9)
    .join('\n')
    .concat(poem.content.length >= 10 && poem.content[9] !== '' ? '\n' + poem.content[9] : '')
    .concat(poem.content.length > 10 ? '\n...' : '');

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    await toggleFavorite(poem.id);
  };

  return (
    <Link
      to={`/poems/${poem.id}`}
      key={poem.id}
      className={`relative p-4 border rounded flex flex-col justify-between cursor-pointer
        transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300
        ${isDarkMode ? 'border-gray-700 bg-gray-950 text-white shadow-md shadow-gray-700/50' : 'border-gray-300 bg-white text-black shadow-md shadow-gray-300/50'}`}
    >
      <button
        onClick={handleFavoriteToggle}
        className="absolute top-4 right-4 text-xl z-10"
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      <h3 className="md:text-lg font-bold font-typewriter mb-4 mr-8">{poem.title.length > 0 ? poem.title : 'Untitled'}</h3>
      <pre className="text-sm md:text-base whitespace-pre-wrap flex-grow font-typewriter">{content}</pre>
    </Link>
  );
};

export default PoemShortBox;