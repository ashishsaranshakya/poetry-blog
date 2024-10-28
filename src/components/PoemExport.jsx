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
			const widthScale = screenWidth < widthWithPadding ? screenWidth / widthWithPadding : 1;
			const heightScale = screenHeight < poemHeight ? screenHeight / poemHeight : 1;

			setScale(Math.min(widthScale, heightScale));
		}
	}, [content]);

	const handleExport = () => {
		if (poemRef.current) {
			const rect = poemRef.current.getBoundingClientRect();
			const exportWidth = rect.width;
			const exportHeight = rect.height;
	
			html2canvas(poemRef.current, {
				scale: 2,
				width: exportWidth,
				height: exportHeight,
				backgroundColor: null,
				x: 0,
				y: 0,
				scrollX: window.scrollX,
				scrollY: window.scrollY,
			}).then((canvas) => {
				const link = document.createElement("a");
				link.download = `${title || "poem"}.png`;
				link.href = canvas.toDataURL("image/png");
				link.click();
			});
		}
	};

	const handleShare = () => {
		if (poemRef.current) {
			const rect = poemRef.current.getBoundingClientRect();
			const exportWidth = rect.width;
			const exportHeight = rect.height;

			html2canvas(poemRef.current, {
				scale: 2,
				width: exportWidth,
				height: exportHeight,
				backgroundColor: null,
				x: 0,
				y: 0,
				scrollX: window.scrollX,
				scrollY: window.scrollY,
			}).then((canvas) => {
				canvas.toBlob((blob) => {
					if (blob) {
						const shareData = {
							text: `Here's a poem titled "${title || "Untitled"}" by Ashish Saran Shakya:\n\n${content.join("\n")}`,
							files: [new File([blob], `${title || "poem"}.png`, { type: 'image/png' })],
						};
	
						if (navigator.share) {
							navigator
								.share(shareData)
								.then(() => console.log("Poem shared successfully"))
								.catch((error) => console.error("Error sharing the poem:", error));
						} else {
							alert("Sharing is not supported on this device.");
						}
					} else {
						console.error("Failed to create image blob");
					}
				}, 'image/png');
			});
		}
	};

	return (
		<div className="flex flex-col items-center">
			<pre ref={hiddenRef} className="invisible absolute whitespace-pre" />
			<div
				ref={poemRef}
				className={`inline-block pt-2 pb-6 px-6 m-0 ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"} overflow-hidden`}
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
			<div
				className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center space-x-4"
			>
				<button
					onClick={handleExport}
					className="w-32 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
				>
					Download
				</button>
				<button
					onClick={handleShare}
					className="w-32 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
				>
					Share
				</button>
			</div>
		</div>
	);
};

export default PoemExport;