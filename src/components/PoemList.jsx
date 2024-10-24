import React, { useContext } from 'react';
import { PoemsContext } from '../context/PoemsContext';
import PoemDetail from './PoemDetail';
import LoadingSpinner from './LoadingSpinner';

const PoemList = () => {
  const { poems, loading } = useContext(PoemsContext);

  if (loading) {
    return <LoadingSpinner/>;
  }

  return (
    <div className="poem-list">
      {poems.map((poem) => (
        <PoemDetail key={poem.id} poem={poem} />
      ))}
    </div>
  );
};

export default PoemList;