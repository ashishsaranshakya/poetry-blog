import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AddPoemPage = () => {
  const [title, setTitle] = useState('');
  const [lines, setLines] = useState(['']);
  const [loading, setLoading] = useState(false);

  const handleLineChange = (index, value) => {
    const newLines = [...lines];
    newLines[index] = value;
    setLines(newLines);
  };

  const addNewLine = () => {
    setLines([...lines, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newPoem = {
        id: Date.now().toString(),
        title,
        content: lines,
      };

      const poemsCollectionRef = collection(db, 'poems');
      await addDoc(poemsCollectionRef, newPoem);

      setTitle('');
      setLines(['']);
      alert('Poem added successfully!');
    } catch (error) {
      console.error('Error adding poem: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-poem-page p-4">
      <h2 className="text-xl font-bold mb-4">Add New Poem</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poem Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poem Content
          </label>
          {lines.map((line, index) => (
            <input
              key={index}
              type="text"
              value={line}
              onChange={(e) => handleLineChange(index, e.target.value)}
              placeholder={`Line ${index + 1}`}
              className="input-field w-full p-2 mb-2 border border-gray-300 rounded"
            />
          ))}
          <button
            type="button"
            onClick={addNewLine}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Add Another Line
          </button>
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
