import React, { useEffect, useState, useContext } from 'react';
import SearchInput from '../components/SearchInput';
import MultiselectDropdown from '../components/MultiselectDropdown';
import { PoemsContext } from '../context/PoemsContext';
import { ThemeContext } from '../context/ThemeContext';
import PoemShortBox from '../components/PoemShortBox';

const SearchPage = () => {
	const { isDarkMode } = useContext(ThemeContext);

	const {poems, favorites} = useContext(PoemsContext);
  const [title, setTitle] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState([]);
	const [inFavorites, setInFavorites] = useState(false);
	const [filteredPoems, setFilteredPoems] = useState([]);
	
	useEffect(() => {
		handleSearch();
	}, [title, selectedThemes, isFeatured, inFavorites]);

	const handleSearch = () => {
		const filteredPoems = poems.filter(poem => {
			const titleMatch = poem.title.toLowerCase().includes(title.toLowerCase());
			const themeMatch = selectedThemes.length === 0 || selectedThemes.every(theme => poem.themes.includes(theme.label));
			const featuredMatch = !isFeatured || poem.isFeatured;

			return titleMatch && themeMatch && featuredMatch;
		});

		if (inFavorites) {
			const favoritePoems = filteredPoems.filter(poem => favorites.includes(poem.id));
			setFilteredPoems(favoritePoems);
			return;
		}
		setFilteredPoems(filteredPoems);
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} min-h-screen transition-all duration-300`}>
      <h2 className="text-2xl font-bold mb-4">Search Poems</h2>
      
			<SearchInput value={title} onChange={setTitle} />
			
			<div className="mt-2">
        <MultiselectDropdown selectedThemes={selectedThemes} setSelectedThemes={setSelectedThemes} />
      </div>
			<div className='md:flex'>
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
				{filteredPoems.map((poem, index) => <PoemShortBox key={index} poem={poem}/>)}
      		</div>
    </div>
  );
};

export default SearchPage;