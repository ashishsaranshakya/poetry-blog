import React, { useState, useContext, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ThemeContext } from '../context/ThemeContext';
import MultiselectDropdown from '../components/MultiselectDropdown';
import themes from '../assets/poem_themes.json';
import { PoemsContext } from '../context/PoemsContext';

const AddPoemPage = () => {
  const { setTitle: setPageTitle } = useContext(PoemsContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [title, setTitle] = useState('');
  const [poemContent, setPoemContent] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [dateCreated, setDateCreated] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
      setPageTitle("My Writing Palace | Add Poem");
  }, []);

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
        createdAt: dateCreated,
        themes: flattenedThemes,
      };

      const poemsCollectionRef = collection(db, 'poems');
      const docRef = await addDoc(poemsCollectionRef, newPoem);

      setTitle('');
      setPoemContent('');
      setIsFeatured(false);
      setDateCreated(new Date());
      setSelectedThemes([]);
    } catch (error) {
      console.error('Error adding poem: ', error);
      setError('Failed to add poem. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('Text');
    
    let lines = pastedText.split('\n');
    let result = lines.filter(line => line.trim() !== '');
    const outputText = result.join('\n');
    
    setPoemContent(outputText);
  };

  return (
    <div className={`add-poem-page p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} min-h-screen transition-all duration-300`}>
      <h2 className="text-2xl font-bold mb-4">Add New Poem</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>

        <div className="flex justify-between gap-10 mb-4">
          <div className="flex-1">
            <label className="block text-lg mb-2 font-medium">Poem Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`input-field w-full p-2 border rounded ${
                isDarkMode
                  ? 'border-gray-500 bg-gray-950 text-white'
                  : 'border-gray-300 bg-white text-black'
              }`}
            />
          </div>
          <div className='flex-1'>
            <label className="block text-lg mb-2 font-medium">Featured</label>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className={`w-10 h-10 cursor-pointer ${
                isDarkMode ? 'bg-gray-500 border-gray-600' : 'bg-white border-gray-300'
              } rounded`}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Poem Themes</label>
          <MultiselectDropdown isMulti options={themes} selectedOptions={selectedThemes} setSelectedOptions={setSelectedThemes} />
        </div>

        <div className="mb-2">
          <div className='md:flex items-center mb-2'>
            <label className="text-lg font-medium mr-4">Poem Content</label>
            <p className='text-sm font-normal'>(Note: All blank lines are removed during pasting)</p>
          </div>
          <textarea
            value={poemContent}
            onChange={(e) => setPoemContent(e.target.value)}
            placeholder="Enter the poem content here"
            rows={12}
            className={`textarea-field w-full p-2 border rounded ${
              isDarkMode
                ? 'border-gray-700 bg-gray-950 text-white'
                : 'border-gray-300 bg-white text-black'
            }`}
            onPaste={handlePaste}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Date Created</label>
          <input
            type="date"
            value={new Date(dateCreated).toISOString().substring(0, 10)}
            onChange={(e) => setDateCreated(new Date(e.target.value))}
            className={`w-full border p-2 rounded mb-4 ${
              isDarkMode
                ? 'border-gray-700 bg-gray-950 text-white'
                : 'border-gray-300 bg-white text-black'
              }`}
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
