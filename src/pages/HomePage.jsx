import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PoemsContext } from '../context/PoemsContext';
import { ThemeContext } from '../context/ThemeContext';
import { PoemShortBox } from '../components/PoemShortBox';
import { auth } from '../firebaseConfig';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const { poems, favorites } = useContext(PoemsContext);
  const { isDarkMode } = useContext(ThemeContext);

  const favoritePoems = poems.filter((poem) => favorites.includes(poem.id)).slice(0, 4);
  const featuredPoems = poems.filter((poem) => poem.isFeatured);
  const recentPoems = [...poems].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-3xl font-bold mb-6">Welcome, {!!user ? user.displayName : "Poetic Nomad!"}</h1>

      {favoritePoems.length > 0 &&
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Favorites</h2>
          <div className="grid grid-cols-2 gap-4">
            {favoritePoems.map((poem, index) => <PoemShortBox key={index} poem={poem} />)}
          </div>
        </section>
      }

      {featuredPoems.length > 0 &&
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Featured Poems</h2>
          <div className="grid grid-cols-2 gap-4">
            {featuredPoems.map((poem, index) => <PoemShortBox key={index} poem={poem} />)}
          </div>
        </section>
      }

      {recentPoems.length > 0 &&
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Poems</h2>
          <div className="grid grid-cols-2 gap-4">
            {recentPoems.map((poem, index) => <PoemShortBox key={index} poem={poem} />)}
          </div>
        </section>
      }
    </div>
  );
};

export default HomePage;
