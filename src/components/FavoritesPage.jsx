import React, { useContext } from 'react';
import { PoemsContext } from '../context/PoemsContext';
import PoemDetail from '../components/PoemDetail';
import LoadingSpinner from '../components/LoadingSpinner';

const FavoritesPage = () => {
  const { poems, favorites, loading } = useContext(PoemsContext);

  if (loading) {
    return <LoadingSpinner/>;
  }

  const favoritePoems = poems.filter((poem) => favorites.includes(poem.id));

  return (
    <div className="favorites-page">
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