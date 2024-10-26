import React, { useContext, useState } from 'react';
import { PoemsContext } from '../context/PoemsContext';
import PoemShortBox from '../components/PoemShortBox';
import LoadingSpinner from '../components/LoadingSpinner';
import { ThemeContext } from '../context/ThemeContext';

const ITEMS_PER_PAGE = 10;

const ExplorePage = () => {
  const { poems, loading } = useContext(PoemsContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPoems = poems.length;
  const totalPages = Math.ceil(totalPoems / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPoems = poems.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`poem-list p-6  ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} min-h-screen transition-all duration-300`}>
      <h2 className="text-2xl font-bold mb-4">Explore</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-8'>
				{paginatedPoems.map((poem, index) => <PoemShortBox key={index} poem={poem}/>)}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-500'} ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'}`}
        >
          Previous
        </button>

        <span className="text-lg">{`Page ${currentPage} of ${totalPages}`}</span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-500'} ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ExplorePage;
