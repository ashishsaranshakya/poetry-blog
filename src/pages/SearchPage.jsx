import React, { useEffect, useState, useContext } from 'react';
import SearchInput from '../components/SearchInput';
import MultiselectDropdown from '../components/MultiselectDropdown';
import { PoemsContext } from '../context/PoemsContext';
import { ThemeContext } from '../context/ThemeContext';
import PoemShortBox from '../components/PoemShortBox';

const ITEMS_PER_PAGE = 10;

const SearchPage = () => {
	const { isDarkMode } = useContext(ThemeContext);
	const { poems, favorites } = useContext(PoemsContext);
	const [title, setTitle] = useState('');
	const [isFeatured, setIsFeatured] = useState(false);
	const [selectedThemes, setSelectedThemes] = useState([]);
	const [inFavorites, setInFavorites] = useState(false);
	const [filteredPoems, setFilteredPoems] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		handleSearch();
	}, [title, selectedThemes, isFeatured, inFavorites]);

	const handleSearch = () => {
		let filteredPoems = poems.filter(poem => {
			const titleMatch = poem.title.toLowerCase().includes(title.toLowerCase());
			const themeMatch = selectedThemes.length === 0 || selectedThemes.every(theme => poem.themes.includes(theme.label));
			const featuredMatch = !isFeatured || poem.isFeatured;
			return titleMatch && themeMatch && featuredMatch;
		});

		if (inFavorites) {
			filteredPoems = filteredPoems.filter(poem => favorites.includes(poem.id));
		}

		setFilteredPoems(filteredPoems);
		setCurrentPage(1);
	};

	const totalPages = Math.ceil(filteredPoems.length / ITEMS_PER_PAGE);
	const paginatedPoems = filteredPoems.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	const handlePrevious = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

	const handleNext = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	return (
		<div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} min-h-screen transition-all duration-300`}>
			<h2 className="text-2xl font-bold mb-4">Search Poems</h2>

			<SearchInput value={title} onChange={setTitle} />
			
			<div className="mt-2">
				<MultiselectDropdown selectedThemes={selectedThemes} setSelectedThemes={setSelectedThemes} />
			</div>
			
			<div className="md:flex">
				<div className="md:flex-1 mt-4 flex items-center">
					<input
						type="checkbox"
						id="featured"
						checked={isFeatured}
						onChange={(e) => setIsFeatured(e.target.checked)}
						className="mr-2"
					/>
					<label htmlFor="featured" className="text-lg">Only Featured Poems</label>
				</div>

				<div className="md:flex-1 mt-4 flex items-center">
					<input
						type="checkbox"
						id="favorites"
						checked={inFavorites}
						onChange={(e) => setInFavorites(e.target.checked)}
						className="mr-2"
					/>
					<label htmlFor="favorites" className="text-lg">Only Favorites</label>
				</div>
				{/* <div className="md:flex-1  mt-4 md:flex md:items-center md:justify-end">
					<button
						onClick={handleSearch}
						className="bg-blue-500 w-full text-white py-2 px-4 rounded hover:bg-blue-600"
					>
						Search
					</button>
				</div> */}
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-8'>
				{paginatedPoems.map((poem, index) => <PoemShortBox key={index} poem={poem} />)}
			</div>

			<div className="flex justify-between items-center mt-6">
				<button
					onClick={handlePrevious}
					disabled={currentPage === 1}
					className={`px-4 py-2 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-500'} ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'}`}
				>
					Previous
				</button>

				<span className="text-lg">{`Page ${currentPage} of ${totalPages}`}</span>

				<button
					onClick={handleNext}
					disabled={currentPage === totalPages}
					className={`px-4 py-2 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-500'} ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'}`}
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default SearchPage;