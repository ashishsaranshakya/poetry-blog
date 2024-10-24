import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup, signOut } from 'firebase/auth';
import { ThemeContext } from '../context/ThemeContext';
import icon from '../assets/icon.svg';
import login_icon from '../assets/login.svg';
import logout_icon from '../assets/logout.svg';

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
        <div className='flex space-x-2'>
          <img src={icon} alt="icon" className="w-8 h-8" />
          <h1 className="text-2xl font-bold">My Writing Palace</h1>
        </div>

        <div className="flex items-center space-x-4">
          <nav className='mr-4'>
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="hover:text-gray-300">Home</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-gray-300">Explore</Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-gray-300">Favorites</Link>
              </li>
              <li>
                {(!!user && user.uid === import.meta.env.VITE_USER_ID) && <Link to="/add-poem" className="hover:text-gray-300">Add Poem</Link>}
              </li>
            </ul>
          </nav>
          <button
            onClick={toggleTheme}
            className=" w-12 h-12 rounded-full hover:bg-gray-700 flex justify-center items-center"
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
                <img src={logout_icon} alt="icon" className="w-8 h-8" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center justify-center rounded-full hover:bg-gray-700 w-12 h-12"
              >
                <img src={login_icon} alt="icon" className="w-8 h-8" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;