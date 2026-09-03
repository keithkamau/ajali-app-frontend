import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import "./IncidentMap.css";

// Leaflet's default marker icon paths break under bundlers like Vite,
// so point them at the bundled asset URLs directly.
const defaultIcon = L.icon({
	iconUrl: markerIcon,
	iconRetinaUrl: markerIcon2x,
	shadowUrl: markerShadow,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const defaultCenter = { lat: -1.286389, lng: 36.817223 };

function ClickHandler({ onLocationChange }) {
	useMapEvents({
		click(event) {
			onLocationChange?.({ lat: event.latlng.lat, lng: event.latlng.lng });
		},
	});
	return null;
}

// MapContainer only reads `center` once on mount, so this keeps the view in
// sync when `location` changes from outside the map (search box selection,
// "Use my location", etc). It also calls invalidateSize() on mount, since
// Leaflet measures its container's size once at init time; if the container
// was 0x0 at that instant (e.g. during initial layout), Leaflet caches that
// and never re-measures on its own even after CSS gives it real height.
function MapRecenter({ center }) {
	const map = useMap();
	useEffect(() => {
		map.invalidateSize();
		if (center) {
			map.setView([center.lat, center.lng], map.getZoom());
		}
	}, [center?.lat, center?.lng]);
	return null;
}

export default function IncidentMap({ incidents = [], location, onLocationChange }) {
	const center = location || defaultCenter;

	return (
		<MapContainer
			className="leaflet-map"
			center={[center.lat, center.lng]}
			zoom={13}
			scrollWheelZoom={true}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<ClickHandler onLocationChange={onLocationChange} />
			<MapRecenter center={center} />
			{incidents.map((incident) => (
				<Marker
					key={incident.id}
					position={[Number(incident.location_lat), Number(incident.location_lng)]}
				/>
			))}
			{location && <Marker position={[location.lat, location.lng]} />}
		</MapContainer>
	);
}