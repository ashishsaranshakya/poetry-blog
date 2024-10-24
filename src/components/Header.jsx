import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup, signOut } from 'firebase/auth';
import { ThemeContext } from '../context/ThemeContext';

const Header = () => {
  const [user, setUser] = useState(null);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error('Logout failed:', error));
  };

  return (
    <header className={`bg-gray-800 text-white p-4 ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Writing Palace</h1>

        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-gray-300">Home</Link>
            </li>
            <li>
              <Link to="/poems" className="hover:text-gray-300">Explore</Link>
            </li>
            <li>
              <Link to="/favorites" className="hover:text-gray-300">Favorites</Link>
            </li>
            <li>
              {(!!user && user.uid === import.meta.env.VITE_USER_ID) && <Link to="/add-poem" className="hover:text-gray-300">Add Poem</Link>}
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="bg-gray-600 text-white w-12 h-12 rounded-full hover:bg-gray-700 flex justify-center items-center"
          >
            <p className={`text-2xl ${isDarkMode ? 'transform -rotate-45' : ''}`}>
              {isDarkMode ? '☾' : '☼'}
            </p>
          </button>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-200">Hello, {user.displayName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Login with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;