import React, { useContext } from 'react';
import { PoemsContext } from '../context/PoemsContext';
import PoemDetail from '../components/PoemLongBox';
import LoadingSpinner from '../components/LoadingSpinner';
import { ThemeContext } from '../context/ThemeContext';

const FavoritesPage = () => {
  const { poems, favorites, loading } = useContext(PoemsContext);
  const { isDarkMode } = useContext(ThemeContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  const favoritePoems = poems.filter((poem) => favorites.includes(poem.id));

  return (
    <div className={`p-6 favorites-page ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-2xl font-bold mb-4">Your Favorites Poems</h2>
      {favoritePoems.length > 0 ? (
        favoritePoems.map((poem) => <PoemDetail key={poem.id} poem={poem} />)
      ) : (
        <p>No favorite poems yet.</p>
      )}
    </div>
  );
};

export default FavoritesPage;