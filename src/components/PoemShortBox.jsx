import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { PoemsContext } from '../context/PoemsContext';

const PoemShortBox = ({ poem }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { favorites, toggleFavorite } = useContext(PoemsContext);

  const isFavorite = favorites.includes(poem.id);

  const content = poem.content.slice(0, 9).join('\n').concat((poem.content.length >= 10 && poem.content[9] !== '') ? '\n' + poem.content[9] : '').concat(poem.content.length > 10 ? '...' : '');

  const handleFavoriteToggle = async () => {
    await toggleFavorite(poem.id);
  };

  return (
    <div key={poem.id} className={`relative p-4 border rounded ${isDarkMode ? 'border-gray-700 bg-gray-950 text-white' : 'border-gray-300 bg-white text-black'}`}>
      
      <button
        onClick={handleFavoriteToggle}
        className="absolute top-4 right-4 text-xl"
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      <h3 className="text-lg md:text-xl font-medium mb-4 mr-8">{poem.title.length>0 ? poem.title : "Untitled"}</h3>
      <pre className="whitespace-pre-wrap">{content}</pre>
      
      <Link to={`/poems/${poem.id}`} className={`text-blue-500 underline mt-2 block`}>
        Read Poem
      </Link>
    </div>
  );
};

export default PoemShortBox;