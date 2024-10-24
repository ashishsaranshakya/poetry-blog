import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { PoemsContext } from '../context/PoemsContext';
import { ThemeContext } from '../context/ThemeContext';

const PoemPage = () => {
  const { id } = useParams();
  const { poems } = useContext(PoemsContext);
  const { isDarkMode } = useContext(ThemeContext);

  const poem = poems.find((p) => p.id === id);

  if (!poem) {
    return <div>Poem not found.</div>;
  }

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-3xl font-bold mb-4">{poem.title}</h1>
      <pre className="whitespace-pre-wrap">{poem.content.join('\n')}</pre>
    </div>
  );
};

export default PoemPage;
