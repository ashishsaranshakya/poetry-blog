import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { PoemsContext } from '../context/PoemsContext';
import { formatFirebaseTimestamp } from '../utils/dateUtils.js';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const AdminPage = () => {
	const { isDarkMode } = useContext(ThemeContext);
	const { poems, loading, deletePoem } = useContext(PoemsContext);
	const navigate = useNavigate();

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div className={`relative p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} transition-all duration-300`}>
			<h2 className="text-2xl font-bold mb-6">Admin - Manage Poems</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{poems.map((poem) => (
					<div key={poem.id} className={`relative p-4 border rounded ${isDarkMode ? 'border-gray-700 bg-gray-950 text-white' : 'border-gray-300 bg-white text-black'}`}>
						<h3 className="text-xl font-semibold">{poem.title || "Untitled"}</h3>
						<p className="text-gray-500 text-sm mb-2">Themes: {poem.themes.join(', ') || 'N/A'}</p>
						<p className="text-sm mb-4">Created on: {formatFirebaseTimestamp(poem.createdAt)}</p>
						<div className='flex justify-between'>
							<button
							className="text-blue-500 underline mr-4"
							onClick={() => navigate(`/edit/${poem.id}`)}
							>
							Edit
							</button>
							<button
							className="text-red-500 underline"
							onClick={() => deletePoem(poem.id)}
							>
							Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default AdminPage;