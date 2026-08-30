import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createIncident, updateIncident } from "../../redux/slices/incidentSlice";
import "./IncidentForm.css";

export const IncidentForm = ({ incident, isEditing }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.incidents);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: incident?.title || "",
        description: incident?.description || "",
        type: incident?.type || "accident",
        location_lat: incident?.location_lat || "",
        location_lng: incident?.location_lng || "",
        location_address: incident?.location_address || "",
        is_anonymous: incident?.is_anonymous || false,
    });

    const [files, setFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [videoPreviews, setVideoPreviews] = useState([]);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
        setErrors({ ...errors, [name]: "" });
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newImages = [];
        const newVideos = [];

        selectedFiles.forEach((file) => {
            if (file.type.startsWith("image/")) {
                newImages.push(file);
            } else if (file.type.startsWith("video/")) {
                newVideos.push(file);
            }
        });

        setFiles([...files, ...selectedFiles]);

        // Create previews
        const newImagePreviews = newImages.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            type: "image",
        }));

        const newVideoPreviews = newVideos.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            type: "video",
        }));

        setImagePreviews([...imagePreviews, ...newImagePreviews]);
        setVideoPreviews([...videoPreviews, ...newVideoPreviews]);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeFile = (index, type) => {
        if (type === "image") {
            const newPreviews = imagePreviews.filter((_, i) => i !== index);
            setImagePreviews(newPreviews);
            // Also remove from files
            const fileIndex = files.findIndex((f) => f === imagePreviews[index].file);
            if (fileIndex !== -1) {
                const newFiles = [...files];
                newFiles.splice(fileIndex, 1);
                setFiles(newFiles);
            }
        } else {
            const newPreviews = videoPreviews.filter((_, i) => i !== index);
            setVideoPreviews(newPreviews);
            const fileIndex = files.findIndex((f) => f === videoPreviews[index].file);
            if (fileIndex !== -1) {
                const newFiles = [...files];
                newFiles.splice(fileIndex, 1);
                setFiles(newFiles);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.type) newErrors.type = "Incident type is required";
        if (!formData.location_lat || !formData.location_lng) {
            newErrors.location = "Location coordinates are required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const submitData = {
            ...formData,
            location_lat: parseFloat(formData.location_lat),
            location_lng: parseFloat(formData.location_lng),
        };

        if (isEditing) {
            await dispatch(updateIncident({ id: incident.id, data: submitData }));
        } else {
            await dispatch(createIncident(submitData));
        }

        navigate("/dashboard");
    };

    return (
        <div className="incident-form-container">
            <form onSubmit={handleSubmit} className="incident-form">
                <div className="incident-form-header">
                    <h2>{isEditing ? "Edit Incident" : "Report New Incident"}</h2>
                    <p className="body-small">Fill in the details below to submit a report</p>
                </div>

                {/* Basic Information */}
                <div className="form-section">
                    <h3 className="form-section-title">Basic Information</h3>
                    
                    <div className="form-group">
                        <label className="label label-required">Title</label>
                        <input
                            type="text"
                            name="title"
                            className={`input ${errors.title ? "input-error" : ""}`}
                            placeholder="Enter incident title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                        {errors.title && <span className="form-error">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label className="label label-required">Description</label>
                        <textarea
                            name="description"
                            className={`input ${errors.description ? "input-error" : ""}`}
                            rows="4"
                            placeholder="Describe the incident in detail"
                            value={formData.description}
                            onChange={handleChange}
                        />
                        {errors.description && <span className="form-error">{errors.description}</span>}
                    </div>

                    <div className="form-group">
                        <label className="label label-required">Incident Type</label>
                        <select
                            name="type"
                            className={`input ${errors.type ? "input-error" : ""}`}
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="accident">Accident</option>
                            <option value="emergency">Emergency</option>
                        </select>
                        {errors.type && <span className="form-error">{errors.type}</span>}
                    </div>
                </div>

                {/* Location Section */}
                <div className="form-section">
                    <h3 className="form-section-title">Location</h3>
                    
                    <div className="form-group">
                        <label className="label">Address</label>
                        <input
                            type="text"
                            name="location_address"
                            className="input"
                            placeholder="Enter location address"
                            value={formData.location_address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label className="label label-required">Latitude</label>
                            <input
                                type="number"
                                name="location_lat"
                                className={`input ${errors.location ? "input-error" : ""}`}
                                placeholder="e.g., -1.286389"
                                step="any"
                                value={formData.location_lat}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group half">
                            <label className="label label-required">Longitude</label>
                            <input
                                type="number"
                                name="location_lng"
                                className={`input ${errors.location ? "input-error" : ""}`}
                                placeholder="e.g., 36.817223"
                                step="any"
                                value={formData.location_lng}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    {errors.location && <span className="form-error">{errors.location}</span>}
                    
                    <div className="map-placeholder">
                        <div className="map-placeholder-content">
                            <span>🗺️</span>
                            <p>Map will be displayed here</p>
                            <span className="body-small">Click on the map to select location</span>
                        </div>
                    </div>
                </div>

                {/* Media Upload Section - FIXED STYLING */}
                <div className="form-section">
                    <h3 className="form-section-title">Upload Photos & Videos</h3>
                    <p className="body-small" style={{ marginBottom: "1rem" }}>
                        Upload images or videos to support your report
                    </p>

                    <div className="upload-area">
                        <div 
                            className="upload-dropzone"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="upload-icon">📸</div>
                            <p className="upload-text">Click to upload or drag and drop</p>
                            <span className="upload-hint">Images (JPG, PNG, GIF) or Videos (MP4, MOV)</span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*,video/*"
                                multiple
                                style={{ display: "none" }}
                            />
                        </div>
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                        <div className="previews-section">
                            <h4 className="previews-title">Images ({imagePreviews.length})</h4>
                            <div className="previews-grid">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="preview-item image-preview">
                                        <img src={preview.url} alt={`Upload ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="preview-remove"
                                            onClick={() => removeFile(index, "image")}
                                        >
                                            ×
                                        </button>
                                        <span className="preview-label">Image</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Video Previews */}
                    {videoPreviews.length > 0 && (
                        <div className="previews-section">
                            <h4 className="previews-title">Videos ({videoPreviews.length})</h4>
                            <div className="previews-grid">
                                {videoPreviews.map((preview, index) => (
                                    <div key={index} className="preview-item video-preview">
                                        <video src={preview.url} controls />
                                        <button
                                            type="button"
                                            className="preview-remove"
                                            onClick={() => removeFile(index, "video")}
                                        >
                                            ×
                                        </button>
                                        <span className="preview-label">Video</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Anonymous Option */}
                <div className="form-section">
                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="is_anonymous"
                                checked={formData.is_anonymous}
                                onChange={handleChange}
                            />
                            <span>Report anonymously</span>
                        </label>
                        <span className="body-small">Your name will not be shown</span>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/dashboard")}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading 
                            ? (isEditing ? "Updating..." : "Submitting...") 
                            : (isEditing ? "Update Report" : "Submit Report")
                        }
                    </button>
                </div>
            </form>
        </div>
    );
};