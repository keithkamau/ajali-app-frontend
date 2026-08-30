import { useEffect, useRef, useState } from "react";

// Uses OpenStreetMap's free Nominatim geocoding API. No API key, no billing,
// no signup required. Please note Nominatim's usage policy caps public
// requests at ~1/second, which the debounce below respects.
// https://operations.osmfoundation.org/policies/nominatim/
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

export default function LocationSearch({ onSelect, placeholder = "Search for a location..." }) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
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

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);

		if (query.trim().length < 3) {
			setResults([]);
			return;
		}

		debounceRef.current = setTimeout(async () => {
			setIsLoading(true);
			try {
				const params = new URLSearchParams({
					q: query,
					format: "json",
					addressdetails: "1",
					limit: "5",
				});
				const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
					headers: { Accept: "application/json" },
				});
				if (!response.ok) throw new Error("Search failed");
				const data = await response.json();
				setResults(data);
				setIsOpen(true);
			} catch (err) {
				console.error("Location search error:", err);
				setResults([]);
			} finally {
				setIsLoading(false);
			}
		}, 500);

		return () => clearTimeout(debounceRef.current);
	}, [query]);

	const handleSelect = (result) => {
		onSelect?.({
			lat: parseFloat(result.lat),
			lng: parseFloat(result.lon),
			address: result.display_name,
		});
		setQuery(result.display_name);
		setIsOpen(false);
		setResults([]);
	};

	return (
		<div className="location-search" ref={containerRef}>
			<input
				type="text"
				className="input"
				placeholder={placeholder}
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onFocus={() => results.length > 0 && setIsOpen(true)}
			/>
			{isLoading && <div className="location-search-status">Searching...</div>}
			{isOpen && results.length > 0 && (
				<ul className="location-search-results">
					{results.map((result) => (
						<li key={result.place_id} onClick={() => handleSelect(result)}>
							{result.display_name}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}