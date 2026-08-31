import { useEffect, useRef, useState } from "react";
import { forwardGeocode } from "../../api/incidentApi";

// Geocoding is proxied through our own backend (which calls OpenStreetMap's
// Nominatim server-side) rather than hitting Nominatim directly from the
// browser. This keeps us within Nominatim's usage policy and avoids every
// user's browser making calls out to a third party directly.
// Note: the backend's forward-geocode endpoint returns a single best match
// (not a list of live suggestions), so this behaves as "search on submit"
// rather than a multi-result autocomplete dropdown.
export default function LocationSearch({ onSelect, placeholder = "Search for a location..." }) {
	const [query, setQuery] = useState("");
	const [result, setResult] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const debounceRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(event) {
			if (containerRef.current && !containerRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const runSearch = async (searchTerm) => {
		if (searchTerm.trim().length < 3) {
			setResult(null);
			setIsOpen(false);
			return;
		}
		setIsLoading(true);
		setError("");
		try {
			const data = await forwardGeocode(searchTerm);
			setResult(data);
			setIsOpen(true);
		} catch (err) {
			console.error("Location search error:", err);
			setResult(null);
			setError("No matching location found.");
			setIsOpen(true);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => runSearch(query), 600);
		return () => clearTimeout(debounceRef.current);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	const handleSelect = () => {
		if (!result) return;
		onSelect?.({
			lat: parseFloat(result.lat),
			lng: parseFloat(result.lng),
			address: result.address,
		});
		setQuery(result.address);
		setIsOpen(false);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (result) {
				handleSelect();
			} else {
				runSearch(query);
			}
		}
	};

	return (
		<div className="location-search" ref={containerRef}>
			<input
				type="text"
				className="input"
				placeholder={placeholder}
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={handleKeyDown}
				onFocus={() => (result || error) && setIsOpen(true)}
			/>
			{isLoading && <div className="location-search-status">Searching...</div>}
			{isOpen && result && (
				<ul className="location-search-results">
					<li onClick={handleSelect}>{result.address}</li>
				</ul>
			)}
			{isOpen && !result && error && (
				<ul className="location-search-results">
					<li className="location-search-empty">{error}</li>
				</ul>
			)}
		</div>
	);
}