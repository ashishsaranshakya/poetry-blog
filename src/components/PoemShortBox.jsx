import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { ThemeContext } from '../context/ThemeContext';
import { PoemsContext } from '../context/PoemsContext';

const PoemShortBox = ({ poem }) => {
  const [user, setUser] = useState(null);
  const { isDarkMode } = useContext(ThemeContext);
  const { favorites, toggleFavorite } = useContext(PoemsContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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

      <div className="flex justify-between mt-auto pt-4">
        <Link to={`/poems/${poem.id}`} className="text-blue-500 underline block">
          Read Poem
        </Link>
        {user && user.uid === import.meta.env.VITE_USER_ID && (
          <Link to={`/edit/${poem.id}`} className="text-blue-500 underline block">
            Edit Poem
          </Link>
        )}
      </div>
    </div>
  );
};

export default PoemShortBox;