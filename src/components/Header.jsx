import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup, signOut } from 'firebase/auth';
import { ThemeContext } from '../context/ThemeContext';
import icon from '../assets/icon.svg';
import login_icon from '../assets/login.svg';
import logout_icon from '../assets/logout.svg';
import hamburger_icon from '../assets/hamburger_menu.svg';

const Header = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={`bg-gray-800 text-white p-4 ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={icon} alt="icon" className="w-8 h-8" />
          <h1 className="text-2xl font-bold">My Writing Palace</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={toggleMenu} className="md:hidden">
            <img src={hamburger_icon} alt="menu" className="w-8 h-8" />
          </button>

          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="hover:text-gray-500">Home</Link>
            <Link to="/explore" className="hover:text-gray-500">Explore</Link>
            <Link to="/favorites" className="hover:text-gray-500">Favorites</Link>
            {user && user.uid === import.meta.env.VITE_USER_ID && (
              <Link to="/add-poem" className="hover:text-gray-500">Add Poem</Link>
            )}
          </nav>

          <button
            onClick={toggleTheme}
            className="w-12 h-12 rounded-full hover:bg-gray-700 flex justify-center items-center"
          >
            <p className={`text-3xl ${isDarkMode ? 'transform -rotate-45' : ''}`}>
              {isDarkMode ? '☾' : '☼'}
            </p>
          </button>

          {user ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center rounded-full hover:bg-gray-700 w-12 h-12"
              >
                <img src={logout_icon} alt="logout" className="w-8 h-8" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center justify-center rounded-full hover:bg-gray-700 w-12 h-12"
            >
              <img src={login_icon} alt="login" className="w-8 h-8" />
            </button>
          )}
        </div>
      </div>

      <nav className={`md:hidden ${menuOpen ? 'block' : 'hidden'} mt-4`}>
        <ul className="flex flex-col space-y-2">
          <li>
            <Link to="/" className="hover:text-gray-500 block">Home</Link>
          </li>
          <li>
            <Link to="/explore" className="hover:text-gray-500 block">Explore</Link>
          </li>
          <li>
            <Link to="/favorites" className="hover:text-gray-500 block">Favorites</Link>
          </li>
          {user && user.uid === import.meta.env.VITE_USER_ID && (
            <li>
              <Link to="/add-poem" className="hover:text-gray-500 block">Add Poem</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
