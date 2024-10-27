import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import PoemEditForm from '../components/PoemEditForm';
import { ThemeContext } from '../context/ThemeContext';
import { formatFirebaseTimestamp } from '../utils/dateUtils.js';

const AdminPage = () => {
	const [poems, setPoems] = useState([]);
	const [selectedPoem, setSelectedPoem] = useState(null);
	const { isDarkMode } = useContext(ThemeContext);
	
	useEffect(() => {
		const fetchPoems = async () => {
			const snapshot = await getDocs(collection(db, 'poems'));
			const fetchedPoems = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setPoems(fetchedPoems);
		};
		fetchPoems();
	}, []);

	const handleSave = async (updatedPoem) => {
		const poemRef = doc(db, 'poems', updatedPoem.id);
		await updateDoc(poemRef, updatedPoem);
		const updatedDoc = await getDoc(poemRef);
		setPoems((prevPoems) =>
			prevPoems.map((poem) => (poem.id === updatedPoem.id ? updatedDoc.data() : poem))
		);
		setSelectedPoem(null);
	};

  return (
    <div className={`relative p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} transition-all duration-300`}>
		<h2 className="text-2xl font-bold mb-6">Admin - Manage Poems</h2>

		{selectedPoem ? (
			<PoemEditForm poem={selectedPoem} onSave={handleSave} onCancel={() => setSelectedPoem(null)} />
		) : (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{poems.map((poem) => (
				<div key={poem.id} className={`relative p-4 border rounded ${isDarkMode ? 'border-gray-700 bg-gray-950 text-white' : 'border-gray-300 bg-white text-black'}`}>
					<h3 className="text-xl font-semibold">{poem.title || "Untitled"}</h3>
					<p className="text-gray-500 text-sm mb-2">Themes: {poem.themes.join(', ') || 'N/A'}</p>
					<p className="text-sm mb-4">Created on: {formatFirebaseTimestamp(poem.createdAt)}</p>
					<button
						className="text-blue-500 underline"
						onClick={() => setSelectedPoem(poem)}
					>
						Edit
					</button>
				</div>
			))}
			</div>
		)}
    </div>
  );
};

export default AdminPage;