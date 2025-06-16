import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { PoemsContext } from '../context/PoemsContext';

const PoemShortBox = ({ poem }) => {
  const { isDarkMode, fontSizeClass, fontStyleClass, lineHeightClass, getRelativeFontSizeClass } = useContext(ThemeContext);
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

  const poemTitleClass = getRelativeFontSizeClass(fontSizeClass, 1);

  return (
    <Link
      to={`/poem/${poem.id}`}
      key={poem.id}
      className={`relative p-4 border rounded flex flex-col justify-between cursor-pointer
        transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300
        ${isDarkMode ? 'border-gray-700 bg-gray-950 text-white shadow-md shadow-gray-700/50' : 'border-gray-300 bg-white text-black shadow-md shadow-gray-300/50'}`}
    >
      <button
        onClick={handleFavoriteToggle}
        className="absolute top-4 right-4 text-xl z-10"
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      <h3 className={`${poemTitleClass} font-bold mb-4 mr-8 ${fontStyleClass} ${lineHeightClass}`}>
        {poem.title.length > 0 ? poem.title : 'Untitled'}
      </h3>
      <pre className={`whitespace-pre-wrap flex-grow ${fontSizeClass} ${fontStyleClass} ${lineHeightClass}`}>
        {content}
      </pre>
    </Link>
  );
};

export default PoemShortBox;