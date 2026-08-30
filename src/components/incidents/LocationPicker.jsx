import React, { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import "./LocationPicker.css";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.75rem",
};

const defaultCenter = {
  lat: -1.286389,
  lng: 36.817223, // Nairobi, Kenya
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

export const LocationPicker = ({
  onLocationSelect,
  initialLat = null,
  initialLng = null,
  address = "",
}) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [center, setCenter] = useState(
    initialLat && initialLng
      ? { lat: parseFloat(initialLat), lng: parseFloat(initialLng) }
      : defaultCenter,
  );
  const [searchBox, setSearchBox] = useState(null);
  const [locationAddress, setLocationAddress] = useState(address);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onSearchLoad = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name || "";

        setCenter({ lat, lng });
        setMarker({ lat, lng });
        setLocationAddress(address);

        if (onLocationSelect) {
          onLocationSelect({ lat, lng, address });
        }
      }
    }
  };

  const onMapClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      setMarker({ lat, lng });
      setCenter({ lat, lng });

      // Reverse geocode to get address
      if (map) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results[0]) {
            const address = results[0].formatted_address;
            setLocationAddress(address);
            if (onLocationSelect) {
              onLocationSelect({ lat, lng, address });
            }
          } else {
            if (onLocationSelect) {
              onLocationSelect({ lat, lng, address: "" });
            }
          }
        });
      }
    },
    [map, onLocationSelect],
  );

  const onMarkerDragEnd = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      setMarker({ lat, lng });
      setCenter({ lat, lng });

      // Reverse geocode
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          const address = results[0].formatted_address;
          setLocationAddress(address);
          if (onLocationSelect) {
            onLocationSelect({ lat, lng, address });
          }
        } else {
          if (onLocationSelect) {
            onLocationSelect({ lat, lng, address: "" });
          }
        }
      });
    },
    [onLocationSelect],
  );

  const onZoomChanged = useCallback(() => {
    if (map) {
      const newZoom = map.getZoom();
      // Optional: handle zoom changes
    }
  }, [map]);

  const handleSearchInput = (e) => {
    // Pass through
  };

  const inputStyle = {
    position: "absolute",
    top: "12px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "90%",
    maxWidth: "400px",
    padding: "12px 16px",
    border: "1px solid #e4e4e0",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    zIndex: 10,
    outline: "none",
  };

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    return (
      <div className='map-error'>
        <p>Google Maps API key is not configured.</p>
        <p className='body-small'>
          Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className='location-picker'>
      <div className='map-container'>
        <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
          <div className='map-wrapper'>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={14}
              options={options}
              onLoad={onLoad}
              onClick={onMapClick}
              onZoomChanged={onZoomChanged}
            >
              <Autocomplete
                onLoad={onSearchLoad}
                onPlaceChanged={onPlaceChanged}
              >
                <input
                  ref={inputRef}
                  type='text'
                  placeholder='Search for a location...'
                  style={inputStyle}
                  onChange={handleSearchInput}
                  defaultValue={locationAddress}
                />
              </Autocomplete>

              {marker && (
                <Marker
                  position={marker}
                  draggable={true}
                  onDragEnd={onMarkerDragEnd}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                />
              )}
            </GoogleMap>
          </div>
        </LoadScript>
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
