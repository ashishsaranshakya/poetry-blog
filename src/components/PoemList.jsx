import React, { useContext } from 'react';
import { PoemsContext } from '../context/PoemsContext';
import PoemDetail from './PoemDetail';
import LoadingSpinner from './LoadingSpinner';
import { ThemeContext } from '../context/ThemeContext';

const PoemList = () => {
  const { poems, loading } = useContext(PoemsContext);
  const { isDarkMode } = useContext(ThemeContext);

  if (loading) {
    return <LoadingSpinner/>;
  }

  return (
    <div className={`poem-list p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} min-h-screen transition-all duration-300`}>
      {poems.map((poem) => (
        <PoemDetail key={poem.id} poem={poem} />
      ))}
    </div>
  );
};

export default PoemList;
