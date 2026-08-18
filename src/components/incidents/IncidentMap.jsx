import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const defaultCenter = { lat: -1.286389, lng: 36.817223 };

export default function IncidentMap({ incidents = [], location, onLocationChange }) {
	const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
	const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey || "" });
	const center = location || defaultCenter;
	if (!apiKey || !isLoaded) return <div className="map-preview" role="img" aria-label="Incident location map"><div className="map-pin">+</div><strong>{apiKey ? "Loading map..." : "Map preview"}</strong><span>{center.lat}, {center.lng}</span></div>;
	return <GoogleMap mapContainerClassName="google-map" center={center} zoom={13} onClick={(event) => onLocationChange?.({ lat: event.latLng.lat(), lng: event.latLng.lng() })}>{incidents.map((incident) => <Marker key={incident.id} position={{ lat: Number(incident.location_lat), lng: Number(incident.location_lng) }} />)}{location && <Marker position={location} />}</GoogleMap>;
}
