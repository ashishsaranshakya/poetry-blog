import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { PoemsContext } from '../context/PoemsContext';
import { ThemeContext } from '../context/ThemeContext';

const PoemPage = () => {
  const { id } = useParams();
  const { poems, toggleFavorite } = useContext(PoemsContext);
  const { isDarkMode } = useContext(ThemeContext);

  const poem = poems.find((p) => p.id === id);

  if (!poem) {
    return <div>Poem not found.</div>;
  }

  const handleFavoriteToggle = async () => {
    await toggleFavorite(poem.id);
  };

  return (
    <div className={`relative p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <button
        onClick={handleFavoriteToggle}
        className="absolute top-6 right-6 px-4 rounded"
      >
        <p className='text-2xl'>
          {poem.isFavorite ? '❤️' : '🤍'}
        </p>
      </button>

      <h1 className="text-3xl font-bold mb-4">{poem.title}</h1>
      <pre className="whitespace-pre-wrap">{poem.content.join('\n')}</pre>
    </div>
  );
};

export default PoemPage;
