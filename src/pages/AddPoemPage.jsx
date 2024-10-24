import React, { useState, useContext } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ThemeContext } from '../context/ThemeContext';
import Select from 'react-select';

const themes = [
  { value: 'love', label: 'Love' },
  { value: 'heartbreak', label: 'Heartbreak' },
  { value: 'introspection', label: 'Introspection' },
  { value: 'dreaming', label: 'Dreaming' },
  { value: 'philosophy', label: 'Philosophy' },
  { value: 'escapism', label: 'Escapism' },
  { value: 'mortality', label: 'Mortality' },
  { value: 'questioningReality', label: 'Questioning Reality' },
  { value: 'questioningSociety', label: 'Questioning Society' },
  { value: 'monotony', label: 'Monotony' },
  { value: 'regrets', label: 'Regrets' },
  { value: 'littleMoments', label: 'Little Moments' },
  { value: 'feeling', label: 'Feeling' },
];

const AddPoemPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [title, setTitle] = useState('');
  const [poemContent, setPoemContent] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const lines = poemContent.split('\n');
      const flattenedThemes = selectedThemes.map((theme) => theme.label);
      const newPoem = {
        title,
        content: lines,
        isFeatured,
        createdAt: new Date(),
        themes: flattenedThemes,
      };

      const poemsCollectionRef = collection(db, 'poems');
      const docRef = await addDoc(poemsCollectionRef, newPoem);

      setTitle('');
      setPoemContent('');
      setIsFeatured(false);
      setSelectedThemes([]);
    } catch (error) {
      console.error('Error adding poem: ', error);
      setError('Failed to add poem. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: isDarkMode ? 'gray' : 'lightgray',
      backgroundColor: isDarkMode ? '#4A5568' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? (isDarkMode ? '#2D3748' : '#E2E8F0') : (isDarkMode ? '#4A5568' : '#fff'),
      color: isDarkMode ? '#fff' : '#000',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#2B6CB0' : '#63B3ED',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#fff',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#fff',
      ':hover': {
        backgroundColor: isDarkMode ? '#2C5282' : '#B2F5EA',
        color: '#fff',
      },
    }),
  };

  return (
    <div className={`add-poem-page p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      <h2 className="text-xl font-bold mb-4">Add New Poem</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>

        <div className="flex justify-between gap-10 mb-4">
          <div className="flex-1">
            <label className="block text-lg mb-4 font-medium">Poem Title</label>
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
          <div className='flex-1'>
            <label className="block text-lg mb-4 font-medium">Featured</label>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className={`w-10 h-10 cursor-pointer ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } rounded`}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Poem Themes</label>
          <Select
            value={selectedThemes}
            onChange={setSelectedThemes}
            options={themes}
            isMulti
            styles={customStyles}
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Poem Content</label>
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
