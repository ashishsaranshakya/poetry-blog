import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AddPoemPage = () => {
  const [title, setTitle] = useState('');
  const [poemContent, setPoemContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const lines = poemContent.split('\n');

      const newPoem = {
        title,
        content: lines,
      };

      const poemsCollectionRef = collection(db, 'poems');
      await addDoc(poemsCollectionRef, newPoem);

      setTitle('');
      setPoemContent('');
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
          <textarea
            value={poemContent}
            onChange={(e) => setPoemContent(e.target.value)}
            placeholder="Enter the poem content here, each line on a new line."
            rows={6}
            className="textarea-field w-full p-2 border border-gray-300 rounded"
            required
          />
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
