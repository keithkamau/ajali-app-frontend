import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPinIcon, CameraIcon, VideoIcon, CloseIcon } from "../icons";
import IncidentMap from "./IncidentMap";
import LocationSearch from "./LocationSearch";
import { reverseGeocode as apiReverseGeocode } from "../../api/incidentApi";

// Reverse-geocoding is proxied through our own authenticated backend
// endpoint (which itself uses OpenStreetMap/Nominatim server-side), rather
// than calling Nominatim directly from the browser.
async function reverseGeocode(lat, lng) {
  try {
    const data = await apiReverseGeocode(lat, lng);
    return data?.address || "";
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return "";
  }
}

export const IncidentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "accident",
    location: {
      lat: -1.286389,
      lng: 36.817223,
      address: "",
    },
    isAnonymous: false,
    images: [],
    videos: [],
  });
  const [errors, setErrors] = useState({});
  const [isLocating, setIsLocating] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  // Called when the user clicks on the map to drop a pin.
  const handleMapLocationChange = async ({ lat, lng }) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, lat, lng },
    }));
    const address = await reverseGeocode(lat, lng);
    if (address) {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, address },
      }));
    }
  };

  // Called when the user picks a result from the location search box.
  const handleLocationSearchSelect = ({ lat, lng, address }) => {
    setFormData((prev) => ({
      ...prev,
      location: { lat, lng, address },
    }));
  };

  // Uses the browser's built-in Geolocation API (free, no key required).
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErrors((prev) => ({
        ...prev,
        location: "Your browser doesn't support geolocation",
      }));
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          location: { ...prev.location, lat: latitude, lng: longitude },
        }));
        const address = await reverseGeocode(latitude, longitude);
        if (address) {
          setFormData((prev) => ({
            ...prev,
            location: { ...prev.location, address },
          }));
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setErrors((prev) => ({
          ...prev,
          location: "Couldn't detect your location. Please allow location access or enter it manually.",
        }));
        setIsLocating(false);
      }
    );
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Array.from(files),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Submit logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className='incident-form-container'>
      <div className='incident-form-header'>
        <h1 className='heading-2'>Report an Incident</h1>
        <p className='body-small text-muted'>
          Tell us what happened. Share the details responders need to act
          quickly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='incident-form'>
        <div className='incident-form-card'>
          <h2 className='heading-4' style={{ marginBottom: "1.5rem" }}>
            Incident Details
          </h2>

          <div className='form-group'>
            <label className='label label-required' htmlFor='title'>Title</label>
            <input
              id='title'
              type='text'
              name='title'
              className={`input ${errors.title ? "input-error" : ""}`}
              placeholder='e.g., Two-car collision on Thika Road'
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <div className='form-error'>{errors.title}</div>}
            <div className='form-hint'>
              Give a clear description of what you saw
            </div>
          </div>

          <div className='form-group'>
            <label className='label label-required' htmlFor='description'>What happened?</label>
            <textarea
              id='description'
              name='description'
              className={`input ${errors.description ? "input-error" : ""}`}
              placeholder='Describe the incident in detail...'
              rows='4'
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && (
              <div className='form-error'>{errors.description}</div>
            )}
          </div>

          <div className='form-group'>
            <label className='label label-required' htmlFor='type'>Incident Type</label>
            <select
              id='type'
              name='type'
              className='input'
              value={formData.type}
              onChange={handleChange}
            >
              <option value='accident'>Accident</option>
              <option value='emergency'>Emergency</option>
              <option value='fire'>Fire</option>
              <option value='crime'>Crime</option>
              <option value='other'>Other</option>
            </select>
          </div>
        </div>

        <div className='incident-form-card'>
          <h2 className='heading-4' style={{ marginBottom: "1.5rem" }}>
            Location
          </h2>

          <div className='form-group'>
            <label className='label'>Where is it happening?</label>
            <LocationSearch onSelect={handleLocationSearchSelect} />
            <button
              type='button'
              className='btn btn-secondary btn-block'
              onClick={handleUseMyLocation}
              disabled={isLocating}
              style={{ marginTop: "0.75rem" }}
            >
              {isLocating ? "Detecting..." : "Use my location"}
            </button>
            <div className='form-hint' style={{ marginTop: "0.5rem" }}>
              We'll detect your current location, or search / click on the
              map below
            </div>
            {errors.location && (
              <div className='form-error'>{errors.location}</div>
            )}
          </div>

          <div className='form-group'>
            <IncidentMap
              location={{
                lat: Number(formData.location.lat),
                lng: Number(formData.location.lng),
              }}
              onLocationChange={handleMapLocationChange}
            />
          </div>

          <div className='location-grid'>
            <div className='form-group'>
              <label className='label' htmlFor='lat'>Latitude</label>
              <input
                id='lat'
                type='text'
                name='lat'
                className='input'
                value={formData.location.lat}
                onChange={handleLocationChange}
              />
            </div>
            <div className='form-group'>
              <label className='label' htmlFor='lng'>Longitude</label>
              <input
                id='lng'
                type='text'
                name='lng'
                className='input'
                value={formData.location.lng}
                onChange={handleLocationChange}
              />
            </div>
          </div>

          <div className='form-group'>
            <label className='label' htmlFor='address'>Address or Landmark</label>
            <input
              id='address'
              type='text'
              name='address'
              className='input'
              placeholder='e.g., Near Kenyatta Avenue'
              value={formData.location.address}
              onChange={handleLocationChange}
            />
          </div>
        </div>

        <div className='incident-form-card'>
          <h2 className='heading-4' style={{ marginBottom: "1rem" }}>
            Evidence
          </h2>
          <p
            className='body-small text-muted'
            style={{ marginBottom: "1.5rem" }}
          >
            Images and videos help responders verify the report.
          </p>

          <div className='evidence-grid'>
            <div className='evidence-upload'>
              <label className='evidence-upload-label'>
                <CameraIcon color='var(--color-ink-muted)' size={24} />
                <span>Upload Images</span>
                <input
                  type='file'
                  name='images'
                  accept='image/*'
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
              {formData.images.length > 0 && (
                <div className='evidence-files'>
                  {formData.images.map((file, index) => (
                    <span key={index} className='evidence-file'>
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className='evidence-upload'>
              <label className='evidence-upload-label'>
                <VideoIcon color='var(--color-ink-muted)' size={24} />
                <span>Upload Videos</span>
                <input
                  type='file'
                  name='videos'
                  accept='video/*'
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
              {formData.videos.length > 0 && (
                <div className='evidence-files'>
                  {formData.videos.map((file, index) => (
                    <span key={index} className='evidence-file'>
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='incident-form-card'>
          <div className='form-group'>
            <label className='checkbox-label'>
              <input
                type='checkbox'
                name='isAnonymous'
                checked={formData.isAnonymous}
                onChange={handleChange}
              />
              <span>Submit anonymously</span>
            </label>
            <div className='form-hint'>
              Your identity will be hidden from the public report
            </div>
          </div>
        </div>

        <div className='incident-form-actions'>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button type='submit' className='btn btn-primary'>
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncidentForm;