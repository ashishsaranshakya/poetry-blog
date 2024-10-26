import React, { useEffect, useState, useContext } from 'react';
import SearchInput from '../components/SearchInput';
import MultiselectDropdown from '../components/MultiselectDropdown';
import { PoemsContext } from '../context/PoemsContext';
import { ThemeContext } from '../context/ThemeContext';
import PoemShortBox from '../components/PoemShortBox';
import LoadingSpinner from '../components/LoadingSpinner';
import themes from '../assets/poem_themes.json';

const ITEMS_PER_PAGE = 10;
const sortOptions = [
	{ value: "", label: "Select..." },
	{ value: "dateDesc", label: "Latest first" },
	{ value: "dateAsc", label: "Oldest first" },
	{ value: "alphaAsc", label: "Alphabetical (A-Z)" },
	{ value: "alphaDesc", label: "Reverse Alphabetical (Z-A)" }
];

const SearchPage = () => {
	const { isDarkMode } = useContext(ThemeContext);
	const { poems, favorites, loading } = useContext(PoemsContext);
	const [title, setTitle] = useState('');
	const [isFeatured, setIsFeatured] = useState(false);
	const [selectedThemes, setSelectedThemes] = useState([]);
	const [inFavorites, setInFavorites] = useState(false);
	const [searchUntitled, setSearchUntitled] = useState(false);
	const [filteredPoems, setFilteredPoems] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortOrder, setSortOrder] = useState(sortOptions[0]);

	useEffect(() => {
		handleSearch();
	}, [poems, title, selectedThemes, isFeatured, inFavorites, searchUntitled, sortOrder]);

	const handleSearch = () => {
		let filteredPoems = poems.filter(poem => {
			const titleMatch = searchUntitled
				? !poem.title || poem.title.trim() === ""
				: poem.title.toLowerCase().includes(title.toLowerCase());
			const themeMatch = selectedThemes.length === 0 || selectedThemes.every(theme => poem.themes.includes(theme.label));
			const featuredMatch = !isFeatured || poem.isFeatured;
			return titleMatch && themeMatch && featuredMatch;
		});

		if (inFavorites) {
			filteredPoems = filteredPoems.filter(poem => favorites.includes(poem.id));
		}

		switch (sortOrder.value) {
			case 'dateAsc':
				filteredPoems.sort((a, b) => a.createdAt - b.createdAt);
				break;
			case 'dateDesc':
				filteredPoems.sort((a, b) => b.createdAt - a.createdAt);
				break;
			case 'alphaAsc':
				filteredPoems.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case 'alphaDesc':
				filteredPoems.sort((a, b) => b.title.localeCompare(a.title));
				break;
			default:
				break;
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

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} min-h-screen transition-all duration-300`}>
			<h2 className="text-2xl font-bold mb-4">Search Poems</h2>

			<SearchInput value={title} onChange={setTitle} isDisabled={searchUntitled} />

			<div className="my-2">
				<label className="block text-lg font-medium mb-2">Poem Themes</label>
				<MultiselectDropdown isMulti options={themes} selectedOptions={selectedThemes} setSelectedOptions={setSelectedThemes} />
			</div>

			<div className="md:flex">
				<div className="md:flex-1 mt-4 flex items-center md:justify-start w-full">
					<label className="block text-lg font-medium mr-4">Sort by:</label>
					<div className="flex-grow md:w-48">
						<MultiselectDropdown options={sortOptions} selectedOptions={sortOrder} setSelectedOptions={setSortOrder} />
					</div>
				</div>

				<div className="md:flex-1 mt-4 flex items-center md:justify-center">
					<input
						type="checkbox"
						id="featured"
						checked={isFeatured}
						onChange={(e) => setIsFeatured(e.target.checked)}
						className="mr-2"
					/>
					<label htmlFor="featured" className="text-lg">Only Featured Poems</label>
				</div>

				<div className="md:flex-1 mt-4 flex items-center md:justify-center">
					<input
						type="checkbox"
						id="favorites"
						checked={inFavorites}
						onChange={(e) => setInFavorites(e.target.checked)}
						className="mr-2"
					/>
					<label htmlFor="favorites" className="text-lg">Only Favorites</label>
				</div>

				<div className="md:flex-1 mt-4 flex items-center md:justify-end">
					<input
						type="checkbox"
						id="untitled"
						checked={searchUntitled}
						onChange={(e) => setSearchUntitled(e.target.checked)}
						className="mr-2"
					/>
					<label htmlFor="untitled" className="text-lg">Only Untitled Poems</label>
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

			{filteredPoems.length === 0 ? (
				<p className="text-lg my-10 text-center">No poems found. Please try a different search.</p>
			) : (
				<>
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
				</>
			)}		
		</div>
	);
};

export default SearchPage;