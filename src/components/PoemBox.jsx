import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

export const PoemBox = ({ poem }) => {
	const { isDarkMode } = useContext(ThemeContext);

	return (
		<div key={poem.id} className={`p-4 border rounded ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'}`}>
			<h3 className="text-xl font-medium">{poem.title}</h3>
			{poem.content.slice(0, 10).map((line, index) =>
				line ? (<p key={index}>{line}</p>) : (<br key={index} />)
			)}
			<Link to={`/poems/${poem.id}`} className={`text-blue-500 underline mt-2 block`}>
				Show More
			</Link>
		</div>);
}