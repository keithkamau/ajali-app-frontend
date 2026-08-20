import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPinIcon, CameraIcon, VideoIcon, CloseIcon } from "../icons";

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
            <label className='label label-required'>Title</label>
            <input
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
            <label className='label label-required'>What happened?</label>
            <textarea
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
            <label className='label label-required'>Incident Type</label>
            <select
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
            <button type='button' className='btn btn-secondary btn-block'>
              Use my location
            </button>
            <div className='form-hint' style={{ marginTop: "0.5rem" }}>
              We'll detect your current location
            </div>
          </div>

          <div className='location-grid'>
            <div className='form-group'>
              <label className='label'>Latitude</label>
              <input
                type='text'
                name='lat'
                className='input'
                value={formData.location.lat}
                onChange={handleLocationChange}
              />
            </div>
            <div className='form-group'>
              <label className='label'>Longitude</label>
              <input
                type='text'
                name='lng'
                className='input'
                value={formData.location.lng}
                onChange={handleLocationChange}
              />
            </div>
          </div>

          <div className='form-group'>
            <label className='label'>Address or Landmark</label>
            <input
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
