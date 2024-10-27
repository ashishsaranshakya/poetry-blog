import React, { useState, useContext } from 'react';
import MultiselectDropdown from './MultiselectDropdown';
import { ThemeContext } from '../context/ThemeContext';
import poem_themes from '../assets/poem_themes.json';

const PoemEditForm = ({ poem, onSave, onCancel }) => {
	const mappedThemes = poem.themes.map(theme => ({ label: theme, value: theme }));
	const mappedContent = poem.content.join('\n');
	const [title, setTitle] = useState(poem.title);
	const [content, setContent] = useState(mappedContent);
	const [isFeatured, setIsFeatured] = useState(poem.isFeatured);
	const [themes, setThemes] = useState(mappedThemes);
	const [dateCreated, setDateCreated] = useState(poem.createdAt.toDate());
	const { isDarkMode } = useContext(ThemeContext);

	const handleSave = () => {
		const splitContent = content.split('\n');
		onSave({
			id: poem.id,
			title,
			content: splitContent,
			isFeatured,
			themes: themes.map(theme => theme.label),
			createdAt: dateCreated
		});
	};

  return (
    <div className={`relative p-4 border rounded ${isDarkMode ? 'border-gray-700 bg-gray-950 text-white' : 'border-gray-300 bg-white text-black'}`}>
		<h3 className="text-2xl font-semibold mb-4">Edit Poem</h3>

		<div className="flex justify-between gap-10 mb-4">
          <div className="flex-1">
            <label className="block text-lg mb-4 font-medium">Poem Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full border p-2 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
            />
          </div>
          <div className='flex-1'>
            <label className="block text-lg mb-4 font-medium">Featured</label>
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

		<label className="block mb-2 font-medium">Content</label>
		<textarea
			  value={content}
			  onChange={(e) => setContent(e.target.value)}
			  rows="5"
			  className={`w-full border p-2 rounded mb-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
		></textarea>

		<label className="block mb-2 font-medium">Themes</label>
		<MultiselectDropdown isNested options={poem_themes} isMulti selectedOptions={themes} setSelectedOptions={setThemes} />

		<label className="block mt-4 mb-2 font-medium">Date Created</label>
		<input
			  type="date"
			  value={new Date(dateCreated).toISOString().substring(0, 10)}
			  onChange={(e) => setDateCreated(new Date(e.target.value))}
			  className={`w-full border p-2 rounded mb-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
		/>

		<div className="flex justify-end gap-4 mt-4">
			<button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
				Cancel
			</button>
			<button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
				Save
			</button>
		</div>
    </div>
  );
};

export default PoemEditForm;