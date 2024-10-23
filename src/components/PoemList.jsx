import React from 'react';
import PoemDetail from './PoemDetail';

const PoemList = ({ poems }) => {
  return (
    <div className="poem-list">
      {poems.map((poem) => (
        <PoemDetail key={poem.id} poem={poem} />
      ))}
    </div>
  );
};

export default PoemList;