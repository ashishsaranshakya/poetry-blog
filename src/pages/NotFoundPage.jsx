import React, { useContext, useEffect, useMemo } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { PoemsContext } from '../context/PoemsContext';
import { Link } from 'react-router-dom';
import page_not_found from '../assets/page_not_found.svg';
import PoemShortBox from '../components/PoemShortBox';
import LoadingSpinner from '../components/LoadingSpinner';

const NotFoundPage = () => {
  const { isDarkMode } = useContext(SettingsContext);
  const { loading, setTitle, poems } = useContext(PoemsContext);

  useEffect(() => {
    setTitle("My Writing Palace | Page Not Found");
  }, [setTitle]);

  const lostPoems = useMemo(() =>
    poems.filter(poem => {
      const inTitle = poem.title && poem.title.toLowerCase().includes('lost');
      const inContent = Array.isArray(poem.content) && poem.content.some(line => line.toLowerCase().includes('lost'));
      return inTitle || inContent;
    }), [poems]
  );

  const randomLostPoem = useMemo(() => {
    if (lostPoems.length === 0) return null;
    const idx = Math.floor(Math.random() * lostPoems.length);
    return lostPoems[idx];
  }, [lostPoems, poems]);

  if(loading){
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-[70vh] flex items-center justify-center p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} transition-colors duration-300`}>
      <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24">
        <div className="flex items-center justify-center">
          <div className="w-64 h-64 md:w-[22rem] md:h-[22rem] flex items-center justify-center overflow-hidden">
            <img src={page_not_found} alt="Page Not Found" className="w-full h-full object-cover" />
          </div>
        </div>

        <div>
          <div className="mb-8">
            <PoemShortBox poem={randomLostPoem} linelimit={7}/>
          </div>
          <Link
            to="/"
            className={`mt-6 px-4 py-2 rounded-lg font-semibold text-md ${isDarkMode ? 'bg-blue-700 hover:bg-blue-900' : 'bg-blue-500 hover:bg-blue-700'} text-white transition-colors duration-300 shadow-md`}
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;