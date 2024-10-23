import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          My Writing Palace
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-gray-300">Home</Link>
            </li>
            <li>
              <Link to="/favorites" className="hover:text-gray-300">Favorites</Link>
            </li>
            <li>
              <Link to="/add-poem" className="hover:text-gray-300">Add Poem</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
