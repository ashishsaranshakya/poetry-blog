import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
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

	const [searchParams, setSearchParams] = useSearchParams();
	const location = useLocation();

	const title = searchParams.get('title') || '';
	const selectedThemes = searchParams.get('themes')
		? searchParams.get('themes').split(',').map(theme => ({ label: theme, value: theme }))
		: [];
	const isFeatured = searchParams.get('featured') === 'true';
	const inFavorites = searchParams.get('favorites') === 'true';
	const searchUntitled = searchParams.get('untitled') === 'true';
	const sortOrderValue = searchParams.get('sort') || '';
	const sortOrder = sortOptions.find(opt => opt.value === sortOrderValue) || sortOptions[0];
	const currentPageFromURL = parseInt(searchParams.get('page') || '1', 10);

	const [filtersEnabled, setFiltersEnabled] = useState(false);
	const [suggestions, setSuggestions] = useState([]);
	const [filteredPoems, setFilteredPoems] = useState([]);

	const updateURLParams = (updates) => {
		const newParams = new URLSearchParams(searchParams.toString());

		const setOrDelete = (key, value) => {
			if (typeof value === 'boolean' && value === false) {
				newParams.delete(key);
			}
			else if (value !== undefined && value !== null && value !== '') {
				newParams.set(key, value.toString());
			} else {
				newParams.delete(key);
			}
		};

		if (updates.title !== undefined) setOrDelete('title', updates.title);
		if (updates.selectedThemes !== undefined) {
			if (updates.selectedThemes.length > 0) {
				setOrDelete('themes', updates.selectedThemes.map(t => t.value).join(','));
			} else {
				newParams.delete('themes');
			}
		}
		if (updates.isFeatured !== undefined) setOrDelete('featured', updates.isFeatured);
		if (updates.inFavorites !== undefined) setOrDelete('favorites', updates.inFavorites);
		if (updates.searchUntitled !== undefined) setOrDelete('untitled', updates.searchUntitled);
		if (updates.sortOrder !== undefined) setOrDelete('sort', updates.sortOrder.value);
		if (updates.page !== undefined) setOrDelete('page', updates.page > 1 ? updates.page : '');

		setSearchParams(newParams, { replace: false });
	};

	const handleTitleChange = (newTitle) => updateURLParams({ title: newTitle, page: 1 });
	const handleThemesChange = (newThemes) => updateURLParams({ selectedThemes: newThemes, page: 1 });
	const handleFeaturedChange = (e) => updateURLParams({ isFeatured: e.target.checked, page: 1 });
	const handleFavoritesChange = (e) => updateURLParams({ inFavorites: e.target.checked, page: 1 });
	const handleUntitledChange = (e) => updateURLParams({ searchUntitled: e.target.checked, page: 1 });
	const handleSortChange = (newSort) => updateURLParams({ sortOrder: newSort, page: 1 });
	const handlePageChange = (newPage) => updateURLParams({ page: newPage });

	useEffect(() => {
		const anyFilterActive =
			title !== '' ||
			selectedThemes.length > 0 ||
			isFeatured ||
			inFavorites ||
			searchUntitled ||
			sortOrder.value !== '';

		setFiltersEnabled(anyFilterActive);
	}, []);

	useEffect(() => {
		setPageTitle("My Writing Palace | Explore");

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
			const isUntitledAndMatches = searchUntitled && (!poem.title || poem.title.trim() === "");
			const isSearchTermPresentInTitleOrContent = searchTerm && (poem.titleMatchesSearchTerm || (poem.content && poem.content.join(' ').toLowerCase().includes(searchTerm)));
			const noSearchTermEntered = !searchTerm;

			const titleContentMatch = isUntitledAndMatches || isSearchTermPresentInTitleOrContent || noSearchTermEntered;

			const themeMatch = selectedThemes.length === 0 || selectedThemes.every(theme => poem.themes && poem.themes.includes(theme.label));
			const featuredMatch = !isFeatured || poem.isFeatured;
			const favoritesMatch = !inFavorites || favorites.includes(poem.id);

			return titleContentMatch && themeMatch && featuredMatch && favoritesMatch;
		});

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
					return (b.title || '').localeCompare(a.title || '');
				default:
					return 0;
			}
		});

		setFilteredPoems(filtered);

	}, [poems, searchParams, favorites, location.search]);


	useEffect(() => {
		const fetchSuggestionsTimeout = setTimeout(() => {
			if (title.trim() === '') {
				setSuggestions([]);
				return;
			}

			const searchTermLower = title.toLowerCase().trim();
			const allSuggestionsMap = new Map();

			const uniqueTitles = [...new Set(poems.map(poem => poem.title).filter(Boolean))];
			uniqueTitles.forEach(poemTitle => {
				const titleLower = poemTitle.toLowerCase();
				const wordsInTitle = titleLower.split(/\W+/).filter(Boolean);

				if (titleLower.startsWith(searchTermLower)) {
					allSuggestionsMap.set(poemTitle, { type: 'title', value: poemTitle });
				}
				else if (wordsInTitle.some(word => word.startsWith(searchTermLower))) {
					allSuggestionsMap.set(poemTitle, { type: 'title', value: poemTitle });
				}
			});

			poems.forEach(poem => {
				if (poem.content && poem.content.length > 0) {
					poem.content.forEach(line => {
						const lineTrimmed = line.trim();
						const lineLower = lineTrimmed.toLowerCase();
						if (lineLower.includes(searchTermLower)) {
							allSuggestionsMap.set(lineTrimmed, { type: 'content', value: lineTrimmed });
						}
					});
				}
			});

			let combinedSuggestions = Array.from(allSuggestionsMap.values());

			combinedSuggestions.sort((a, b) => {
				const aLower = a.value.toLowerCase();
				const bLower = b.value.toLowerCase();

				const aIsContent = a.type === 'content';
				const bIsContent = b.type === 'content';

				if (!aIsContent && bIsContent) return -1;
				if (aIsContent && !bIsContent) return 1;

				if (a.type === 'title' && b.type === 'title') {
					const aStartsWithSearchTerm = aLower.startsWith(searchTermLower);
					const bStartsWithSearchTerm = bLower.startsWith(searchTermLower);

					if (aStartsWithSearchTerm && !bStartsWithSearchTerm) return -1;
					if (!aStartsWithSearchTerm && bStartsWithSearchTerm) return 1;

					const aWords = aLower.split(/\W+/).filter(Boolean);
					const bWords = bLower.split(/\W+/).filter(Boolean);
					const aHasExactWordMatch = aWords.some(word => word === searchTermLower);
					const bHasExactWordMatch = bWords.some(word => word === searchTermLower);

					if (aHasExactWordMatch && !bHasExactWordMatch) return -1;
					if (!aHasExactWordMatch && bHasExactWordMatch) return 1;

					const aHasWordStartingWith = aWords.some(word => word.startsWith(searchTermLower));
					const bHasWordStartingWith = bWords.some(word => word.startsWith(searchTermLower));

					if (aHasWordStartingWith && !bHasWordStartingWith) return -1;
					if (!aHasWordStartingWith && bHasWordStartingWith) return 1;

					return aLower.localeCompare(bLower);

				} else {
					return aLower.localeCompare(bLower);
				}
			});

			setSuggestions(combinedSuggestions.slice(0, 7));
		}, 200);

		return () => clearTimeout(fetchSuggestionsTimeout);
	}, [title, poems]);


	const countOccurrences = (text, term) => {
		if (!text || !term) return 0;
		const regex = new RegExp(term, 'gi');
		const matches = text.match(regex);
		return matches ? matches.length : 0;
	};


	const handleSelectSuggestion = (selectedSuggestionObject) => {
		updateURLParams({ title: selectedSuggestionObject.value, page: 1 });
	};

	const totalPages = Math.ceil(filteredPoems.length / ITEMS_PER_PAGE);
	const paginatedPoems = filteredPoems.slice(
		(currentPageFromURL - 1) * ITEMS_PER_PAGE,
		currentPageFromURL * ITEMS_PER_PAGE
	);

	const handlePrevious = () => {
		if (currentPageFromURL > 1) handlePageChange(currentPageFromURL - 1);
	};

	const handleNext = () => {
		if (currentPageFromURL < totalPages) handlePageChange(currentPageFromURL + 1);
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} transition-all duration-300`}>
			<div className="flex items-center justify-between mb-2 md:mb-6">
				<h2 className="text-xl md:text-2xl font-bold whitespace-nowrap">Explore Poems</h2>
				<button onClick={() => setFiltersEnabled(!filtersEnabled)} className={`px-2 py-1 text-lg md:text-xl rounded ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'}`}>
					{filtersEnabled ? 'Hide ' : 'Show '}
					Filters
				</button>
			</div>

			{filtersEnabled && (
				<>
					<SearchInput
						value={title}
						onChange={handleTitleChange}
						isDisabled={searchUntitled}
						suggestions={suggestions}
						onSelectSuggestion={handleSelectSuggestion}
						isDarkMode={isDarkMode}
					/>

					<div className="my-2">
						<label className="block text-lg font-medium mb-2">Poem Themes</label>
						<MultiselectDropdown isMulti options={themes} selectedOptions={selectedThemes} setSelectedOptions={handleThemesChange} />
					</div>

					<div className="md:flex">
						<div className="md:flex-1 mt-4 flex items-center md:justify-start w-full">
							<label className="block text-lg font-medium mr-4">Sort by:</label>
							<div className="flex-grow md:w-48">
								<MultiselectDropdown options={sortOptions} selectedOptions={sortOrder} setSelectedOptions={handleSortChange} />
							</div>
						</div>

						<div className="md:flex-1 mt-4 flex items-center md:justify-center">
							<input
								type="checkbox"
								id="featured"
								checked={isFeatured}
								onChange={handleFeaturedChange}
								className="mr-2"
							/>
							<label htmlFor="featured" className="text-lg">Only Featured Poems</label>
						</div>

						<div className="md:flex-1 mt-4 flex items-center md:justify-center">
							<input
								type="checkbox"
								id="favorites"
								checked={inFavorites}
								onChange={handleFavoritesChange}
								className="mr-2"
							/>
							<label htmlFor="favorites" className="text-lg">Only Favorites</label>
						</div>

						<div className="md:flex-1 mt-4 flex items-center md:justify-end">
							<input
								type="checkbox"
								id="untitled"
								checked={searchUntitled}
								onChange={handleUntitledChange}
								className="mr-2"
							/>
							<label htmlFor="untitled" className="text-lg">Only Untitled Poems</label>
						</div>
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
							disabled={currentPageFromURL === 1}
							className={`px-4 py-2 rounded ${currentPageFromURL === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-500'} ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'}`}
						>
							Previous
						</button>

						<span className="text-lg">{`${currentPageFromURL}/${totalPages}`}</span>

						<button
							onClick={handleNext}
							disabled={currentPageFromURL === totalPages}
							className={`px-4 py-2 rounded ${currentPageFromURL === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-500'} ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'}`}
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