import React, { useContext } from 'react';
import { PoemsContext } from '../context/PoemsContext';

const PoemDetail = ({ poem }) => {
  const { favorites, toggleFavorite, loading } = useContext(PoemsContext);

  if (loading) {
    return <LoadingSpinner/>;
  }

  const isFavorite = favorites.includes(poem.id);

  return (
    <div className="p-4 border-b border-gray-300">
      <h2 className="text-2xl font-bold">{poem.title}</h2>
      <div className="text-gray-700 mb-2">
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
        className={`favorite-btn ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
      >
        {isFavorite ? '❤️ Unfavorite' : '♡ Favorite'}
      </button>
    </div>
  );
};

export default PoemDetail;
