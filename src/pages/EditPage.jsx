import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PoemsContext } from '../context/PoemsContext';
import { ThemeContext } from '../context/ThemeContext';
import MultiselectDropdown from '../components/MultiselectDropdown';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import poem_themes from '../assets/poem_themes.json';
import LoadingSpinner from '../components/LoadingSpinner';

const EditPage = () => {
    const { id } = useParams();
    const { poems, setPoems, loading, setTitle: setPageTitle } = useContext(PoemsContext);
	const { isDarkMode } = useContext(ThemeContext);
	const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [themes, setThemes] = useState([]);
    const [dateCreated, setDateCreated] = useState(new Date());

	useEffect(() => {
        if (!loading) {
			const poem = poems.find((p) => p.id === id);
            if (poem) {
                setTitle(poem.title || '');
                setContent((poem.content || []).join('\n'));
                setIsFeatured(poem.isFeatured || false);
                setThemes((poem.themes || []).map(theme => ({ label: theme, value: theme })));
                setDateCreated(poem.createdAt?.toDate() || new Date());
            }
        }
    }, [id, poems, loading]);
	
	useEffect(() => {
		  setPageTitle("My Writing Palace | Edit Poem");
	}, []);

    if (loading) {
        return <LoadingSpinner/>;
    }

    if (!poems.find((p) => p.id === id)) {
        return <div className={`relative p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} transition-all duration-300`}>Poem not found.</div>;
    }

    const handleSave = async () => {
        const splitContent = content.split('\n');
        const updatedPoem = {
            id,
            title,
            content: splitContent,
            isFeatured,
            themes: themes.map(theme => theme.label),
            createdAt: dateCreated
        };

        const poemRef = doc(db, 'poems', id);
		await updateDoc(poemRef, updatedPoem);
		const updatedDoc = await getDoc(poemRef);

        setPoems((prevPoems) =>
            prevPoems.map((p) => (p.id === id ? { ...updatedDoc.data() } : p))
		);
		navigate('/admin')
    };

	return (
		<div className={`relative p-4 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} transition-all duration-300`}>
			<h3 className="text-xl md:text-2xl font-bold whitespace-nowrap mb-2 md:mb-6">Edit Poem</h3>

			<div className="flex justify-between gap-10 mb-4">
				<div className="flex-1">
					<label className="block text-lg mb-4 font-medium">Poem Title</label>
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
				<div className="flex-1">
					<label className="block text-lg mb-4 font-medium">Featured</label>
					<input
						type="checkbox"
						checked={isFeatured}
						onChange={(e) => setIsFeatured(e.target.checked)}
						className={`w-10 h-10 cursor-pointer ${isDarkMode ? 'bg-gray-500 border-gray-600' : 'bg-white border-gray-300'} rounded`}
					/>
				</div>
			</div>

			<label className="block mb-2 font-medium">Content</label>
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				rows="5"
				className={`mb-4 textarea-field w-full p-2 border rounded ${
					isDarkMode
					  ? 'border-gray-700 bg-gray-950 text-white'
					  : 'border-gray-300 bg-white text-black'
				  }`}
			></textarea>

			<label className="block mb-2 font-medium">Themes</label>
			<MultiselectDropdown
				options={poem_themes}
				isMulti
				selectedOptions={themes}
				setSelectedOptions={setThemes}
			/>

			<label className="block mt-4 mb-2 font-medium">Date Created</label>
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

			<div className="flex justify-end gap-4 mt-4">
				<button className={`px-4 py-2 border rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`} onClick={()=>navigate('/admin')}>
					Cancel
				</button>
				<button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
					Save
				</button>
			</div>
		</div>
	);
};

export default EditPage;