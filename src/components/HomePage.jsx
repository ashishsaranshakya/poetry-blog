import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PoemsContext } from '../context/PoemsContext';
import { ThemeContext } from '../context/ThemeContext';
import { PoemBox } from './PoemBox';

const HomePage = () => {
  const { poems, favorites } = useContext(PoemsContext);
  const { isDarkMode } = useContext(ThemeContext);

  const favoritePoems = poems.filter((poem) => favorites.includes(poem.id)).slice(0, 4);
  const featuredPoems = poems.filter((poem) => poem.isFeatured);
  const recentPoems = [...poems].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-3xl font-bold mb-6">Welcome to the Poetry Blog</h1>

      {favoritePoems.length > 0 &&
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Favorites</h2>
          <div className="grid grid-cols-2 gap-4">
            {favoritePoems.map((poem, index) => <PoemBox key={index} poem={poem} />)}
          </div>
        </section>
      }

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Poems</h2>
        {featuredPoems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {featuredPoems.map((poem, index) => <PoemBox key={index} poem={poem} />)}
          </div>
        ) : (
          <p>No featured poems available.</p>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Poems</h2>
        {recentPoems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
					  {recentPoems.map((poem, index) => <PoemBox key={index} poem={poem} />)}
          </div>
        ) : (
          <p>No recent poems available.</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;
