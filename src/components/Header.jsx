import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup, signOut } from 'firebase/auth';
import { ThemeContext } from '../context/ThemeContext';
import { PoemsContext } from '../context/PoemsContext';
import icon from '../assets/icon.svg';
import login_icon from '../assets/login.svg';
import logout_icon from '../assets/logout.svg';
import hamburger_icon from '../assets/hamburger_menu.svg';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(PoemsContext);

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
        <Link to="/" className="flex items-center space-x-2">
          <img src={icon} alt="icon" className="w-8 h-8" />
          <h1 className="text-xl md:text-2xl font-bold whitespace-nowrap">My Writing Palace</h1>
        </Link>

        <div className="flex items-center space-x-2">
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="hover:text-gray-500">Home</Link>
            <Link to="/explore" className="hover:text-gray-500">Explore</Link>
            <Link to="/favorites" className="hover:text-gray-500">Favorites</Link>
            {user && user.uid === import.meta.env.VITE_USER_ID && (
              <>
                <Link to="/add-poem" className="hover:text-gray-500">Add Poem</Link>
                <Link to="/admin" className="hover:text-gray-500">Admin</Link>
              </>
            )}
          </nav>

          <button
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="w-10 h-10 rounded-full hover:bg-gray-500 flex justify-center items-center"
          >
            <p className={`text-2xl md:text-3xl ${isDarkMode ? 'transform -rotate-45' : ''}`}>
              {isDarkMode ? '☾' : '☼'}
            </p>
          </button>
          <button onClick={toggleMenu} className="md:hidden w-10 h-10 rounded-full hover:bg-gray-500 flex justify-center items-center">
            <img src={hamburger_icon} alt="menu" className="w-6 h-6" />
          </button>

          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center justify-center rounded-full hover:bg-gray-500 w-12 h-12"
              >
                <img src={logout_icon} alt="logout" className="w-8 h-8" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={handleLogin}
                title="Login with Google"
                className="flex items-center justify-center rounded-full hover:bg-gray-500 w-12 h-12"
              >
                <img src={login_icon} alt="login" className="w-8 h-8" />
              </button>
            </div>
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
            <>
              <li>
                <Link to="/add-poem" className="hover:text-gray-500 block">Add Poem</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-gray-500 block">Admin</Link>
              </li>
            </>
          )}
          {user ? (
              <div className="md:hidden">
                <button onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="md:hidden">
                <button onClick={handleLogin}>
                  Login
                </button>
              </div>
            )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
