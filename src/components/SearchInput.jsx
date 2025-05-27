import React, { useState, useRef, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const SearchInput = ({ value, onChange, isDisabled, suggestions = [], onSelectSuggestion }) => {
	const { isDarkMode } = React.useContext(ThemeContext);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const wrapperRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(event) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setShowSuggestions(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleInputChange = (e) => {
		onChange(e.target.value);
		setShowSuggestions(true);
	};

	const handleSuggestionClick = (suggestionObject) => {
		onSelectSuggestion(suggestionObject.value);
		setShowSuggestions(false);
	};

	const handleFocus = () => {
		if (suggestions.length > 0 && value.trim() !== '') {
			setShowSuggestions(true);
		}
	};

	const handleBlur = () => {
		setTimeout(() => {
			setShowSuggestions(false);
		}, 100);
	};

	return (
		<div className="relative mb-4" ref={wrapperRef}>
			<input
				type="text"
				placeholder="Search"
				value={value}
				onChange={handleInputChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				disabled={isDisabled}
				className={`input-field w-full p-2 border rounded ${
				isDarkMode
					? 'border-gray-500 bg-gray-950 text-white'
					: 'border-gray-300 bg-white text-black'
				}`}
				required
			/>
			{showSuggestions && suggestions.length > 0 && (
				<ul className={`absolute z-10 w-full max-h-60 overflow-y-auto rounded-b-md shadow-lg mt-1
								${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
					{suggestions.map((suggestion, index) => (
						<li
							key={index}
							className={`p-2 cursor-pointer
										${isDarkMode ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-200 text-black'}`}
							onMouseDown={() => handleSuggestionClick(suggestion)}
						>
							{suggestion.value}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SearchInput;