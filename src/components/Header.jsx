import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup, signOut } from 'firebase/auth';
import { ThemeContext } from '../context/ThemeContext';
import { PoemsContext } from '../context/PoemsContext';
import SettingsMenu from './SettingsMenu';
import icon from '../assets/icon.svg';
import login_icon from '../assets/login.svg';
import logout_icon from '../assets/logout.svg';
import hamburger_icon from '../assets/hamburger_menu.svg';
import settings_icon from '../assets/settings.svg';

const MD_BREAKPOINT = 768;

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const { isDarkMode, fontSizeClass, getRelativeFontSizeClass } = useContext(ThemeContext);
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
    if (isSettingsMenuOpen) setIsSettingsMenuOpen(false);
  };

  const toggleSettingsMenu = () => {
    setIsSettingsMenuOpen(!isSettingsMenuOpen);
    if (menuOpen) setMenuOpen(false);
  };

  const heading1Class = getRelativeFontSizeClass(fontSizeClass, 3)

  return (
    <header className={`bg-gray-800 text-white p-4 ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={icon} alt="icon" className="w-8 h-8" />
          <h1 className={`${heading1Class} font-bold whitespace-nowrap`}>My Writing Palace</h1>
        </Link>

        <div className="flex items-center space-x-2">
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="hover:text-gray-500">Home</Link>
            <Link to="/explore" className="hover:text-gray-500">Explore</Link>
            <Link to="/favorites" className="hover:text-gray-500">Favorites</Link>
            <Link to="/about-author" className="hover:text-gray-500">About The Author</Link>
            {user && user.uid === import.meta.env.VITE_USER_ID && (
              <>
                <Link to="/add-poem" className="hover:text-gray-500">Add Poem</Link>
                <Link to="/admin" className="hover:text-gray-500">Admin</Link>
              </>
            )}
          </nav>

          <button
            onClick={toggleSettingsMenu}
            title="Reader Settings"
            className="w-10 h-10 rounded-full hover:bg-gray-500 flex justify-center items-center"
          >
            <img src={settings_icon} alt="settings" className="w-6 h-6" />
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
          <li><Link to="/" className="hover:text-gray-500 block" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/explore" className="hover:text-gray-500 block" onClick={() => setMenuOpen(false)}>Explore</Link></li>
          <li><Link to="/favorites" className="hover:text-gray-500 block" onClick={() => setMenuOpen(false)}>Favorites</Link></li>
          <li><Link to="/about-author" className="hover:text-gray-500 block" onClick={() => setMenuOpen(false)}>About The Author</Link></li>
          {user && user.uid === import.meta.env.VITE_USER_ID && (
            <>
              <li><Link to="/add-poem" className="hover:text-gray-500 block" onClick={() => setMenuOpen(false)}>Add Poem</Link></li>
              <li><Link to="/admin" className="hover:text-gray-500 block" onClick={() => setMenuOpen(false)}>Admin</Link></li>
            </>
          )}
          {user ? (
              <div className="md:hidden">
                <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
              </div>
            ) : (
              <div className="md:hidden">
                <button onClick={() => { handleLogin(); setMenuOpen(false); }}>Login</button>
              </div>
            )}
        </ul>
      </nav>

      <SettingsMenu isOpen={isSettingsMenuOpen} onClose={() => setIsSettingsMenuOpen(false)} />
    </header>
  );
};

export default Header;
