import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./LocationPicker.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom red marker icon
const redMarkerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultCenter = {
  lat: -1.286389,
  lng: 36.817223,
};

const LocationMarker = ({
  onLocationSelect,
  marker,
  setMarker,
  setLocationAddress,
}) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarker({ lat, lng });
      setLocationAddress("");

      // Reverse geocode using Nominatim (free, no API key needed)
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      )
        .then((res) => res.json())
        .then((data) => {
          const address = data.display_name || "";
          setLocationAddress(address);
          if (onLocationSelect) {
            onLocationSelect({ lat, lng, address });
          }
        })
        .catch(() => {
          if (onLocationSelect) {
            onLocationSelect({ lat, lng, address: "" });
          }
        });
    },
    dragend(e) {
      // Handle marker drag end
    },
  });

  return marker ? (
    <Marker
      position={[marker.lat, marker.lng]}
      icon={redMarkerIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          setMarker({ lat, lng });
          setLocationAddress("");

          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          )
            .then((res) => res.json())
            .then((data) => {
              const address = data.display_name || "";
              setLocationAddress(address);
              if (onLocationSelect) {
                onLocationSelect({ lat, lng, address });
              }
            })
            .catch(() => {
              if (onLocationSelect) {
                onLocationSelect({ lat, lng, address: "" });
              }
            });
        },
      }}
    >
      <Popup>
        <strong>Selected Location</strong>
        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#666" }}>
          Lat: {marker.lat.toFixed(6)}
          <br />
          Lng: {marker.lng.toFixed(6)}
        </p>
      </Popup>
    </Marker>
  ) : null;
};

export const LocationPicker = ({
  onLocationSelect,
  initialLat = null,
  initialLng = null,
  address = "",
}) => {
  const [marker, setMarker] = useState(
    initialLat && initialLng
      ? { lat: parseFloat(initialLat), lng: parseFloat(initialLng) }
      : null,
  );
  const [center, setCenter] = useState(
    initialLat && initialLng
      ? { lat: parseFloat(initialLat), lng: parseFloat(initialLng) }
      : defaultCenter,
  );
  const [locationAddress, setLocationAddress] = useState(address);
  const [searchQuery, setSearchQuery] = useState(address);
  const mapRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const { lat, lon, display_name } = data[0];
          const newLat = parseFloat(lat);
          const newLng = parseFloat(lon);

          setCenter({ lat: newLat, lng: newLng });
          setMarker({ lat: newLat, lng: newLng });
          setLocationAddress(display_name);

          if (mapRef.current) {
            mapRef.current.flyTo([newLat, newLng], 15);
          }

          if (onLocationSelect) {
            onLocationSelect({
              lat: newLat,
              lng: newLng,
              address: display_name,
            });
          }
        }
      })
      .catch((err) => console.error("Search error:", err));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLat = latitude;
        const newLng = longitude;

        setCenter({ lat: newLat, lng: newLng });
        setMarker({ lat: newLat, lng: newLng });

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=18&addressdetails=1`,
        )
          .then((res) => res.json())
          .then((data) => {
            const address = data.display_name || "";
            setLocationAddress(address);
            if (onLocationSelect) {
              onLocationSelect({ lat: newLat, lng: newLng, address });
            }
          })
          .catch(() => {
            if (onLocationSelect) {
              onLocationSelect({ lat: newLat, lng: newLng, address: "" });
            }
          });

        if (mapRef.current) {
          mapRef.current.flyTo([newLat, newLng], 15);
        }
      },
      (error) => {
        alert("Unable to get your location: " + error.message);
      },
    );
  };

  useEffect(() => {
    if (initialLat && initialLng && !marker) {
      setMarker({ lat: parseFloat(initialLat), lng: parseFloat(initialLng) });
    }
  }, [initialLat, initialLng]);

  return (
    <div className='location-picker'>
      <div className='search-container'>
        <form onSubmit={handleSearch} className='search-form'>
          <input
            type='text'
            className='input'
            placeholder='Search for a location...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type='submit' className='btn btn-primary btn-sm'>
            Search
          </button>
        </form>
        <button
          onClick={handleUseCurrentLocation}
          className='btn btn-secondary btn-sm'
        >
          📍 Current Location
        </button>
      </div>

      <div className='map-container'>
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={14}
          style={{ height: "400px", width: "100%", borderRadius: "0.75rem" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <LocationMarker
            onLocationSelect={onLocationSelect}
            marker={marker}
            setMarker={setMarker}
            setLocationAddress={setLocationAddress}
          />
        </MapContainer>
      </div>

      <div className='selected-location-info'>
        <div className='location-coords'>
          <div className='coord-group'>
            <label className='label'>Latitude</label>
            <input
              type='text'
              className='input coord-input'
              value={marker ? marker.lat.toFixed(6) : ""}
              readOnly
              disabled
              placeholder='Click on map to select'
            />
          </div>
          <div className='coord-group'>
            <label className='label'>Longitude</label>
            <input
              type='text'
              className='input coord-input'
              value={marker ? marker.lng.toFixed(6) : ""}
              readOnly
              disabled
              placeholder='Click on map to select'
            />
          </div>
        </div>
        {locationAddress && (
          <div className='selected-address'>
            <label className='label'>Address</label>
            <p className='address-text'>{locationAddress}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
