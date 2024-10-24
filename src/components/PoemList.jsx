import React, { useContext } from 'react';
import { PoemsContext } from '../context/PoemsContext';
import PoemDetail from './PoemDetail';
import LoadingSpinner from './LoadingSpinner';
import { ThemeContext } from '../context/ThemeContext';

const PoemList = () => {
  const { poems, loading } = useContext(PoemsContext);
  const { theme } = useContext(ThemeContext);

  if (loading) {
    return <LoadingSpinner/>;
  }

  return (
    <div className={`poem-list ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} min-h-screen m-4 transition-all duration-300`}>
      {poems.map((poem) => (
        <PoemDetail key={poem.id} poem={poem} />
      ))}
    </div>
  );
};

export default PoemList;
