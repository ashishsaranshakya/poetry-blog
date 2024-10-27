import React, { useRef, useContext, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { ThemeContext } from "../context/ThemeContext";

const PoemExport = ({ title, content }) => {
	const poemRef = useRef(null);
	const hiddenRef = useRef(null);
	const { isDarkMode } = useContext(ThemeContext);
	const [maxWidth, setMaxWidth] = useState("auto");
	const [scale, setScale] = useState(1);

	useEffect(() => {
		if (hiddenRef.current) {
			const lines = content.join("\n").split("\n");
			let longestWidth = 0;

			lines.forEach((line) => {
				hiddenRef.current.textContent = line;
				longestWidth = Math.max(longestWidth, hiddenRef.current.offsetWidth);
			});

			const widthWithPadding = longestWidth + 50;
			setMaxWidth(widthWithPadding);

			const poemHeight = poemRef.current ? poemRef.current.offsetHeight : 0;

			const screenWidth = window.innerWidth - 64;
			const screenHeight = window.innerHeight - 128;
			const widthScale = screenWidth < widthWithPadding ? (screenWidth) / widthWithPadding : 1;
			const heightScale = screenHeight < poemHeight ? (screenHeight) / poemHeight : 1;
			
			setScale(Math.min(widthScale, heightScale));
			handleExport();
		}
	}, [content]);

	const handleExport = () => {
		if (poemRef.current) {
			html2canvas(poemRef.current, {
				scale: 2,
				width: maxWidth,
				backgroundColor: null,
			}).then((canvas) => {
				const link = document.createElement("a");
				link.download = `${title || "poem"}.png`;
				link.href = canvas.toDataURL("image/png");
				link.click();
			});
		}
	};

	return (
		<div className="flex flex-col items-center">
			<pre ref={hiddenRef} className="invisible absolute whitespace-pre" />
			<div
				ref={poemRef}
				className={`inline-block p-6 m-0 ${
				isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
				} overflow-hidden rounded-lg`}
				style={{
				width: maxWidth,
				transform: `scale(${scale})`,
				border: "1px solid transparent",
				}}
			>
				<h2 className="text-2xl font-bold text-center mb-1">{title || "Untitled"}</h2>
				<p className="text-center mb-4 italic">by Ashish Saran Shakya</p>
				<pre className="whitespace-pre-wrap text-left mb-2">{content.join("\n")}</pre>
			</div>
		</div>
	);
};

export default PoemExport;
