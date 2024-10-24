import React, { useState, useContext } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { PoemsContext } from '../context/PoemsContext';
import { ThemeContext } from '../context/ThemeContext';

const AddPoemPage = () => {
  const { addPoem } = useContext(PoemsContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [title, setTitle] = useState('');
  const [poemContent, setPoemContent] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const lines = poemContent.split('\n');
      const newPoem = {
        title,
        content: lines,
        isFeatured,
        createdAt: new Date()
      };

      const poemsCollectionRef = collection(db, 'poems');
      const docRef = await addDoc(poemsCollectionRef, newPoem);

      addPoem({ id: docRef.id, ...newPoem });

      setTitle('');
      setPoemContent('');
      setIsFeatured(false);
      alert('Poem added successfully!');
    } catch (error) {
      console.error('Error adding poem: ', error);
      setError('Failed to add poem. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`add-poem-page p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      <h2 className="text-xl font-bold mb-4">Add New Poem</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Poem Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`input-field w-full p-2 border rounded ${
              isDarkMode
                ? 'border-gray-700 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-black'
            }`}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Poem Content
          </label>
          <textarea
            value={poemContent}
            onChange={(e) => setPoemContent(e.target.value)}
            placeholder="Enter the poem content here, each line on a new line."
            rows={12}
            className={`textarea-field w-full p-2 border rounded ${
              isDarkMode
                ? 'border-gray-700 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-black'
            }`}
            required
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="mr-2"
            />
            <span>Mark as Featured Poem</span>
          </label>
        </div>

        <button
          type="submit"
          className={`${
            loading ? 'bg-gray-500' : 'bg-blue-500'
          } text-white px-4 py-2 rounded`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Poem'}
        </button>
      </form>
    </div>
  );
};

export default AddPoemPage;
