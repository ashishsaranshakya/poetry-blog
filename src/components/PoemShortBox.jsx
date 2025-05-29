import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { PoemsContext } from '../context/PoemsContext';
import arrow_light from '../assets/arrow_light.svg';
import arrow_dark from '../assets/arrow_dark.svg';

const PoemShortBox = ({ poem }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user, favorites, toggleFavorite } = useContext(PoemsContext);

  const isFavorite = favorites.includes(poem.id);

  const content = poem.content
    .slice(0, 9)
    .join('\n')
    .concat(poem.content.length >= 10 && poem.content[9] !== '' ? '\n' + poem.content[9] : '')
    .concat(poem.content.length > 10 ? '...' : '');

  const handleFavoriteToggle = async () => {
    await toggleFavorite(poem.id);
  };

  return (
    <div
      key={poem.id}
      className={`relative p-4 border rounded flex flex-col justify-between ${isDarkMode ? 'border-gray-700 bg-gray-950 text-white' : 'border-gray-300 bg-white text-black'}`}
    >
      <button
        onClick={handleFavoriteToggle}
        className="absolute top-4 right-4 text-xl"
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      <h3 className="text-lg md:text-xl font-medium mb-4 mr-8">{poem.title.length > 0 ? poem.title : 'Untitled'}</h3>
      <pre className="whitespace-pre-wrap">{content}</pre>

      <div className="absolute bottom-4 right-4">
        <Link to={`/poems/${poem.id}`}>
          <img src={isDarkMode ? arrow_dark : arrow_light} alt="read" className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};

export default PoemShortBox;