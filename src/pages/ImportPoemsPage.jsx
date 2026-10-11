import React, { useContext, useState } from 'react';
import { collection, getDocs, Timestamp, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { SettingsContext } from '../context/SettingsContext';
import { PoemsContext } from '../context/PoemsContext';
import { TITLE } from '../utils/Constants';

const MAX_BATCH_SIZE = 450;

const normalizeLine = (value) => String(value ?? '')
	// Firestore backups can contain a trailing CR in each line. Since each
	// array item is already one line, remove it instead of creating a newline.
	.replace(/\r/g, '')
	.replace(/[ \t]+$/g, '');

const canonicalPoem = (poem) => JSON.stringify({
	title: String(poem.title ?? '').normalize('NFC').trim().toLowerCase(),
	content: Array.isArray(poem.content) ? poem.content.map(normalizeLine) : []
});

const canonicalContent = (poem) => JSON.stringify(
	Array.isArray(poem.content) ? poem.content.map(normalizeLine) : []
);

const fingerprint = async (poem) => {
	const bytes = new TextEncoder().encode(canonicalPoem(poem));
	const digest = await crypto.subtle.digest('SHA-256', bytes);
	return Array.from(new Uint8Array(digest))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
};

const contentFingerprint = async (poem) => {
	const bytes = new TextEncoder().encode(canonicalContent(poem));
	const digest = await crypto.subtle.digest('SHA-256', bytes);
	return Array.from(new Uint8Array(digest))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
};

const validatePoem = (poem, index) => {
	if (!poem || typeof poem !== 'object' || Array.isArray(poem)) {
		return `Poem ${index + 1} is not an object.`;
	}
	if (typeof poem.title !== 'string' || !poem.title.trim()) {
		return `Poem ${index + 1} has no valid title.`;
	}
	if (!Array.isArray(poem.content) || !poem.content.every((line) => typeof line === 'string')) {
		return `Poem ${index + 1} must contain a string content array.`;
	}
	if (poem.created_on && Number.isNaN(Date.parse(poem.created_on))) {
		return `Poem ${index + 1} has an invalid created_on date.`;
	}
	return null;
};

// Titles are the reconciliation key. `_` is how the JSON exporter represents
// an untitled poem, while existing Firestore documents use an empty title.
const titleKey = (value) => {
	const normalized = String(value ?? '')
		.normalize('NFKC')
		.replace(/…/g, '...')
		.trim()
		.toLowerCase();

	return normalized === '_' ? '' : normalized;
};

const firstContentLine = (poem) => {
	const firstLine = Array.isArray(poem.content)
		? poem.content.find((line) => String(line).trim())
		: '';
	return firstLine ? normalizeLine(firstLine).trim() : '(empty content)';
};

const toFirestoreData = (poem) => {
	const tags = Array.isArray(poem.tags) ? poem.tags : [];
	const themes = Array.isArray(poem.theme) ? poem.theme : [];
	const createdAt = poem.created_on ? Timestamp.fromDate(new Date(poem.created_on)) : null;

	return {
		// Preserve source title/content when saving. `_` is the one explicit
		// representation conversion requested for untitled poems.
		title: poem.title === '_' ? '' : poem.title,
		content: poem.content,
		themes,
		isFeatured: tags.some((tag) => String(tag).toLowerCase() === 'favourite'),
		createdAt,
		reads: 0
	};
};

const ImportPoemsPage = () => {
	const { isDarkMode, fontSizeClass, getRelativeFontSizeClass } = useContext(SettingsContext);
	const { setTitle: setPageTitle } = useContext(PoemsContext);
	const [fileName, setFileName] = useState('');
	const [report, setReport] = useState(null);
	const [approved, setApproved] = useState(false);
	const [busy, setBusy] = useState(false);
	const [exporting, setExporting] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	React.useEffect(() => {
		setPageTitle(`${TITLE} | Import Poems`);
	}, [setPageTitle]);

	const serializeFirestoreValue = (value) => {
		if (value && typeof value.toDate === 'function') {
			return value.toDate().toISOString();
		}
		if (Array.isArray(value)) return value.map(serializeFirestoreValue);
		if (value && typeof value === 'object') {
			return Object.fromEntries(
				Object.entries(value).map(([key, nestedValue]) => [
					key,
					serializeFirestoreValue(nestedValue)
				])
			);
		}
		return value;
	};

	const handleExport = async () => {
		setExporting(true);
		setError('');
		setMessage('Reading all poems from Firestore...');

		try {
			const snapshot = await getDocs(collection(db, 'poems'));
			const exportedPoems = snapshot.docs.map((poemDocument) => ({
				id: poemDocument.id,
				...serializeFirestoreValue(poemDocument.data())
			}));
			const blob = new Blob([JSON.stringify(exportedPoems, null, 2)], {
				type: 'application/json'
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			const date = new Date().toISOString().slice(0, 10);

			link.href = url;
			link.download = `poems_firestore_backup_${date}.json`;
			document.body.appendChild(link);
			link.click();
			link.remove();
			URL.revokeObjectURL(url);
			setMessage(`Export complete. Downloaded ${exportedPoems.length} poems.`);
		} catch (exportError) {
			setError(exportError.message || 'Could not export poems from Firestore.');
			setMessage('');
		} finally {
			setExporting(false);
		}
	};

	const handleFileChange = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setBusy(true);
		setError('');
		setMessage('Reading the file and reconciling with Firestore...');
		setReport(null);
		setApproved(false);
		setFileName(file.name);

		try {
			const parsed = JSON.parse(await file.text());
			if (!Array.isArray(parsed)) throw new Error('The JSON root must be an array of poems.');

			const invalid = [];
			const valid = [];
			const reconciliation = [];
			parsed.forEach((poem, index) => {
				const validationError = validatePoem(poem, index);
				if (validationError) {
					invalid.push(validationError);
					reconciliation.push({
						index,
						title: poem?.title || `Entry ${index + 1}`,
						status: 'invalid',
						reason: validationError
					});
				}
				else valid.push({ poem, index });
			});

			const snapshot = await getDocs(collection(db, 'poems'));
			// Keep document IDs in queues so duplicate titles are reconciled
			// one-for-one rather than collapsed into a Set.
			const existingByTitle = new Map();
			const existingUntitledByContent = new Map();
			for (const existingDoc of snapshot.docs) {
				const data = existingDoc.data();
				const key = titleKey(data.title);

				if (key) {
					if (!existingByTitle.has(key)) existingByTitle.set(key, []);
					existingByTitle.get(key).push(existingDoc.id);
				} else {
					const contentHash = await contentFingerprint(data);
					if (!existingUntitledByContent.has(contentHash)) {
						existingUntitledByContent.set(contentHash, []);
					}
					existingUntitledByContent.get(contentHash).push(existingDoc.id);
				}
			}

			const additions = [];
			let alreadyPresent = 0;

			for (const { poem, index } of valid) {
				const hash = await fingerprint(poem);
				const key = titleKey(poem.title);
				const matchingDocuments = key
					? existingByTitle.get(key) || []
					: existingUntitledByContent.get(await contentFingerprint(poem)) || [];
				const matchingDocumentId = matchingDocuments.shift();

				if (matchingDocumentId) {
					alreadyPresent++;
						reconciliation.push({
							index,
							title: poem.title,
							status: 'present',
							firstLine: key ? null : firstContentLine(poem),
							reason: key
							? `Matches existing Firestore document ${matchingDocumentId} by title.`
							: `Matches existing untitled Firestore document ${matchingDocumentId} by normalized content.`
					});
					continue;
				}

				const documentId = `imported-${hash.slice(0, 24)}`;
				additions.push({
					documentId,
					title: poem.title,
					firstLine: key ? null : firstContentLine(poem),
					data: toFirestoreData(poem)
				});
				reconciliation.push({
					index,
					title: poem.title,
					status: 'new',
					firstLine: key ? null : firstContentLine(poem),
					reason: `No matching title/content found. Will create ${documentId}.`
				});
			}

			setReport({
				total: parsed.length,
				invalid,
				alreadyPresent,
				additions,
				reconciliation: reconciliation.sort((a, b) => a.index - b.index),
				imported: 0
			});
			setMessage('Reconciliation complete. Review the results before approving the import.');
		} catch (importError) {
			setError(importError.message || 'Could not process this JSON file.');
			setMessage('');
		} finally {
			setBusy(false);
		}
	};

	const handleImport = async () => {
		if (!report || report.invalid.length || !report.additions.length || !approved) return;

		setBusy(true);
		setError('');
		setMessage('Writing new poems to Firestore...');

		try {
			for (let start = 0; start < report.additions.length; start += MAX_BATCH_SIZE) {
				const batch = writeBatch(db);
				const group = report.additions.slice(start, start + MAX_BATCH_SIZE);
				group.forEach((addition) => {
					// The browser Firestore SDK exposes set/update/delete on batches;
					// create() is an Admin SDK method.
					batch.set(doc(db, 'poems', addition.documentId), addition.data);
				});
				await batch.commit();
			}

			setReport((current) => ({ ...current, imported: current.additions.length }));
			setApproved(false);
			setMessage(`Import complete. Added ${report.additions.length} new poems.`);
		} catch (importError) {
			setError(importError.message || 'Firestore rejected the import.');
			setMessage('');
		} finally {
			setBusy(false);
		}
	};

	const titleClass = getRelativeFontSizeClass(fontSizeClass, 3);
	const textClass = getRelativeFontSizeClass(fontSizeClass, 1);
	const panelClass = isDarkMode ? 'bg-gray-950 border-gray-700' : 'bg-white border-gray-300';

	return (
		<div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} min-h-screen`}>
			<h1 className={`${titleClass} font-bold mb-2`}>Import Poems</h1>
			<p className={`${textClass} mb-6`}>Upload a poems_export.json file to find and review poems that are not currently in Firestore.</p>

			<div className={`p-5 border rounded ${panelClass}`}>
				<label className="block font-medium mb-2" htmlFor="poems-json-file">JSON export file</label>
				<input id="poems-json-file" type="file" accept="application/json,.json" onChange={handleFileChange} disabled={busy} />
				{fileName && <p className="mt-2 text-sm opacity-75">Selected: {fileName}</p>}
				<div className="mt-5 pt-4 border-t border-gray-400">
					<p className="text-sm mb-2">Create a backup of every document in the Firestore <code>poems</code> collection.</p>
					<button type="button" onClick={handleExport} disabled={busy || exporting} className="px-4 py-2 rounded bg-gray-600 text-white disabled:opacity-50">
						{exporting ? 'Exporting...' : 'Export all Firestore poems'}
					</button>
				</div>
			</div>

			{message && <p className="my-4 text-green-600">{message}</p>}
			{error && <p className="my-4 text-red-600">{error}</p>}

			{report && (
				<div className={`mt-6 p-5 border rounded ${panelClass}`}>
					<h2 className="text-xl font-semibold mb-4">Reconciliation results</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
						<div><strong>{report.total}</strong><br />Input poems</div>
						<div><strong>{report.additions.length}</strong><br />New poems</div>
						<div><strong>{report.alreadyPresent}</strong><br />Already present</div>
					</div>

					{report.invalid.length > 0 && (
						<div className="p-3 mb-4 border border-red-400 rounded text-red-600">
							<strong>Fix these validation errors before importing:</strong>
							<ul className="list-disc ml-5 mt-2">{report.invalid.map((item) => <li key={item}>{item}</li>)}</ul>
						</div>
					)}

					{report.additions.length > 0 && (
						<>
							<h3 className="font-semibold mb-2">New poems to add</h3>
							<div className="max-h-72 overflow-y-auto border rounded p-3 mb-4">
								<ul className="list-disc ml-5">{report.additions.map((addition) => (
									<li key={addition.documentId}>
										{addition.title}
										{addition.firstLine && <span className="block text-sm opacity-75">First line: {addition.firstLine}</span>}
									</li>
								))}</ul>
							</div>
							<label className="flex items-center gap-2 mb-4">
								<input type="checkbox" checked={approved} onChange={(event) => setApproved(event.target.checked)} disabled={busy || report.imported > 0} />
								I have reviewed and approve adding these poems.
							</label>
							<button type="button" onClick={handleImport} disabled={busy || !approved || report.invalid.length > 0 || report.imported > 0} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
								{report.imported > 0 ? 'Imported' : busy ? 'Importing...' : `Approve and import ${report.additions.length} poems`}
							</button>
						</>
					)}

					<h3 className="font-semibold mt-6 mb-2">Reconciliation details</h3>
					<div className="max-h-96 overflow-y-auto border rounded divide-y">
						{report.reconciliation.map((item) => {
							const statusStyles = {
								new: 'text-green-600',
								present: 'text-blue-600',
								duplicate: 'text-yellow-600',
								invalid: 'text-red-600'
							};

							return (
								<div key={`${item.index}-${item.status}`} className="p-3">
									<div className="flex justify-between gap-3">
									<strong>{item.title}</strong>
										<span className={`uppercase text-xs font-bold ${statusStyles[item.status] || ''}`}>{item.status}</span>
									</div>
									{item.firstLine && <p className="text-sm mt-1"><strong>First line:</strong> {item.firstLine}</p>}
									<p className="text-sm opacity-80 mt-1">{item.reason}</p>
								</div>
							);
						})}
					</div>
					{!report.additions.length && !report.invalid.length && <p>No new poems need to be imported.</p>}
				</div>
			)}
		</div>
	);
};

export default ImportPoemsPage;
