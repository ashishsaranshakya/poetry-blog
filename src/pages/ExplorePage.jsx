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

const ExplorePage = () => {
	const { isDarkMode } = useContext(ThemeContext);
	const { poems, favorites, loading, setTitle: setPageTitle } = useContext(PoemsContext);
	const [title, setTitle] = useState('');
	const [isFeatured, setIsFeatured] = useState(false);
	const [selectedThemes, setSelectedThemes] = useState([]);
	const [inFavorites, setInFavorites] = useState(false);
	const [searchUntitled, setSearchUntitled] = useState(false);
	const [filteredPoems, setFilteredPoems] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortOrder, setSortOrder] = useState(sortOptions[0]);
	const [filtersEnabled, setFiltersEnabled] = useState(false);
	const [suggestions, setSuggestions] = useState([]);

	useEffect(() => {
		handleSearch();
		setPageTitle("My Writing Palace | Explore");
	}, [poems, title, selectedThemes, isFeatured, inFavorites, searchUntitled, sortOrder]);

	useEffect(() => {
		const fetchSuggestionsTimeout = setTimeout(() => {
			if (title.trim() === '') {
				setSuggestions([]);
				return;
			}

			const searchTermLower = title.toLowerCase().trim();
			const uniqueTitles = [...new Set(poems.map(poem => poem.title).filter(Boolean))];
			const matchingTitles = uniqueTitles.filter(poemTitle => {
				const wordsInTitle = poemTitle.toLowerCase().split(/\s+/);
				return wordsInTitle.some(word => word.startsWith(searchTermLower));
			});

			matchingTitles.sort((a, b) => {
				const aLower = a.toLowerCase();
				const bLower = b.toLowerCase();

				const aStartsWithSearchTerm = aLower.startsWith(searchTermLower);
				const bStartsWithSearchTerm = bLower.startsWith(searchTermLower);

				if (aStartsWithSearchTerm && !bStartsWithSearchTerm) return -1;
				if (!aStartsWithSearchTerm && bStartsWithSearchTerm) return 1;

				const aHasExactWordMatch = aLower.split(/\s+/).some(word => word === searchTermLower);
				const bHasExactWordMatch = bLower.split(/\s+/).some(word => word === searchTermLower);

				if (aHasExactWordMatch && !bHasExactWordMatch) return -1;
				if (!aHasExactWordMatch && bHasExactWordMatch) return 1;

				return aLower.localeCompare(bLower);
			});

			setSuggestions(matchingTitles.slice(0, 7));
		}, 200);

		return () => clearTimeout(fetchSuggestionsTimeout);
	}, [title, poems]);

	const countOccurrences = (text, term) => {
		if (!text || !term) return 0;
		const regex = new RegExp(term, 'gi');
		const matches = text.match(regex);
		return matches ? matches.length : 0;
	};

	const handleSearch = () => {
		const searchTerm = title.toLowerCase().trim();

		let results = poems.map(poem => {
			const poemTitle = poem.title ? poem.title.toLowerCase() : '';
			const poemContent = poem.content ? poem.content.join(' ').toLowerCase() : '';

			let relevanceScore = 0;
			const titleMatchesSearchTerm = searchTerm && poemTitle.includes(searchTerm);
			const contentOccurrences = searchTerm ? countOccurrences(poemContent, searchTerm) : 0;

			if (searchTerm) {
				if (titleMatchesSearchTerm) {
					relevanceScore += 1000;
				}
				relevanceScore += contentOccurrences;
			}

			return { ...poem, relevanceScore, titleMatchesSearchTerm };
		});

		let filtered = results.filter(poem => {
			const titleMatch = searchUntitled
				? !poem.title || poem.title.trim() === ""
				: poem.titleMatchesSearchTerm || (searchTerm && poem.content && poem.content.join(' ').toLowerCase().includes(searchTerm)) || !searchTerm;
			const themeMatch = selectedThemes.length === 0 || selectedThemes.every(theme => poem.themes.includes(theme.label));
			const featuredMatch = !isFeatured || poem.isFeatured;
			return titleMatch && themeMatch && featuredMatch;
		});

		if (inFavorites) {
			filtered = filtered.filter(poem => favorites.includes(poem.id));
		}

		filtered.sort((a, b) => {
			switch (sortOrder.value) {
				case '':
					return b.relevanceScore - a.relevanceScore;
				case 'dateAsc':
					return a.createdAt - b.createdAt;
				case 'dateDesc':
					return b.createdAt - a.createdAt;
				case 'alphaAsc':
					return (a.title || '').localeCompare(b.title || '');
				case 'alphaDesc':
					return b.title.localeCompare(a.title);
				default:
					return 0;
			}
		});

		setFilteredPoems(filtered);
		setCurrentPage(1);
	};

	const handleSelectSuggestion = (selectedSuggestion) => {
		setTitle(selectedSuggestion);
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
		<div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} transition-all duration-300`}>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-2xl font-bold">Explore Poems</h2>
				<button onClick={() => setFiltersEnabled(!filtersEnabled)} className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'}`}>
					{filtersEnabled ? 'Hide ' : 'Show '}
					Filters
				</button>
			</div>

			{filtersEnabled && (
				<>
					<SearchInput
						value={title}
						onChange={setTitle}
						isDisabled={searchUntitled}
						suggestions={suggestions}
						onSelectSuggestion={handleSelectSuggestion}
					/>

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
				</>
			)}

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

export default ExplorePage;