import React from 'react';
import { ThemeContext } from '../context/ThemeContext';

const SearchInput = ({ value, onChange }) => {
	  const { isDarkMode } = React.useContext(ThemeContext);
  return (
    <div>
		<label className="block text-lg mb-2 font-medium">Poem Title</label>
		<input
			type="text"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			className={`input-field w-full p-2 border rounded ${
			isDarkMode
				? 'border-gray-700 bg-gray-700 text-white'
				: 'border-gray-300 bg-white text-black'
			}`}
			required
		/>
    </div>
  );
};

export default SearchInput;