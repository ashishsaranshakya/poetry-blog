import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { PoemsContext } from '../context/PoemsContext';
import { formatFirebaseTimestamp } from '../utils/dateUtils.js';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import SearchInput from '../components/SearchInput';
import MultiselectDropdown from '../components/MultiselectDropdown';
import themes from '../assets/poem_themes.json';
import edit_icon_light from '../assets/edit_icon_light.svg';
import edit_icon_dark from '../assets/edit_icon_dark.svg';
import bin_icon_light from '../assets/bin_icon_light.svg';
import bin_icon_dark from '../assets/bin_icon_dark.svg';

const ITEMS_PER_PAGE = 10;
const sortOptions = [
	{ value: "", label: "Select..." },
	{ value: "dateDesc", label: "Latest first" },
	{ value: "dateAsc", label: "Oldest first" },
	{ value: "mostReads", label: "Most read" },
	{ value: "leastReads", label: "Least read" },
	{ value: "alphaAsc", label: "Alphabetical (A-Z)" },
	{ value: "alphaDesc", label: "Reverse Alphabetical (Z-A)" }
];

const AdminPage = () => {
	const { isDarkMode } = useContext(ThemeContext);
	const { poems, loading, favorites, deletePoem, setTitle: setPageTitle } = useContext(PoemsContext);
	const navigate = useNavigate();
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

	useEffect(() => {
		  setPageTitle("My Writing Palace | Add Poem");
	}, []);

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
			case 'mostReads':
				filteredPoems.sort((a, b) => b.reads - a.reads);
				break;
			case 'leastReads':
				filteredPoems.sort((a, b) => a.reads - b.reads);
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
		<div className={`relative p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} transition-all duration-300`}>
			<div className='flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-6'>
				<h2 className="text-xl md:text-2xl font-bold whitespace-nowrap">Admin - Manage Poems</h2>
				<h2 className="text-lg md:text-xl font-semibold whitespace-nowrap">Total Poems: {filteredPoems.length}</h2>
			</div>

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
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
				{paginatedPoems.map((poem) => (
					<div key={poem.id} className={`relative p-4 border rounded ${isDarkMode ? 'border-gray-700 bg-gray-950 text-white' : 'border-gray-300 bg-white text-black'}`}>
						<div className='flex flex-col md:flex-row md:justify-between mb-4'>
							<div>
								<h3 className="text-xl font-semibold">{poem.title || "Untitled"}</h3>
								<p className="text-gray-500 text-sm mb-2">Themes: {poem.themes.join(', ') || 'N/A'}</p>
								<p className="text-sm">Created on: {formatFirebaseTimestamp(poem.createdAt)}</p>
							</div>
							<h3 className="text-xl font-semibold">Reads: {poem.reads}</h3>
						</div>
						<div className='flex justify-between'>
							<button
							className="text-blue-500 underline mr-4"
							onClick={() => navigate(`/poems/${poem.id}`)}
							>
							View
							</button>
							<button
							className="text-blue-500 underline mr-4"
							onClick={() => navigate(`/edit/${poem.id}`)}
							>
								<img src={isDarkMode ? edit_icon_dark : edit_icon_light} alt="menu" className="w-6 h-6" />
							</button>
							<button
							className="text-red-500 underline"
							onClick={() => {
								const confirmed = window.confirm(`Are you sure you want to delete "${poem.title || 'Untitled'}"?`);
								if (confirmed) {
									deletePoem(poem.id);
								}
							}}
							>
								<img src={isDarkMode ? bin_icon_dark : bin_icon_light} alt="menu" className="w-6 h-6" />
							{/* Delete */}
							</button>
						</div>
					</div>
				))}
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

export default AdminPage;