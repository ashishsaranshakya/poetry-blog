import React, { useContext, useEffect } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { PoemsContext } from '../context/PoemsContext';
import { Link } from 'react-router-dom';
import page_not_found from '../assets/page_not_found.svg';

const NotFoundPage = () => {
  const { isDarkMode } = useContext(SettingsContext);
  const { setTitle } = useContext(PoemsContext);

  useEffect(() => {
    setTitle("My Writing Palace | Page Not Found");
  }, [setTitle]);

  return (
    <div
      className={`flex items-center justify-center p-6 text-center
        ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}
        transition-colors duration-300`}
    >
      <div className="max-w-full mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        <div className="">
          <div className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center overflow-hidden">
            {<img src={page_not_found} alt="Page Not Found" className="w-full h-full object-cover" /> }
          </div>
        </div>

        <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left">
          <p className="md:text-md font-semibold mb-4 whitespace-pre-line leading-relaxed">
            Poem Here
          </p>
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg font-semibold text-md
              ${isDarkMode ? 'bg-blue-700 hover:bg-blue-900' : 'bg-blue-500 hover:bg-blue-700'} text-white
              transition-colors duration-300 shadow-md`}
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;