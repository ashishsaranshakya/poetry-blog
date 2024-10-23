import React from 'react';

const PoemDetail = ({ poem }) => {
  return (
    <div className="p-4 border-b border-gray-300">
      <h2 className="text-2xl font-bold">{poem.title}</h2>
      <div className="text-gray-700">
        {poem.content.map((line, index) =>
          line ? (
            <p key={index}>{line}</p>
          ) : (
            <br key={index} />
          )
        )}
      </div>
    </div>
  );
};

export default PoemDetail;
