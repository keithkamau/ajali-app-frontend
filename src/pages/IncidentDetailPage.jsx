// src/pages/IncidentDetailPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchIncident, removeIncident } from "../redux/slices/incidentSlice";
import { mockIncidents } from "../utils/mockData";
import { formatDateTime } from "../utils/formatters";
import { MapPinIcon, ArrowIcon, CloseIcon } from "../components/icons";

export const IncidentDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Try to get from Redux first, fallback to mock
  const reduxIncident = useSelector((state) => state.incidents?.current);
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    // Try to fetch from Redux
    dispatch(fetchIncident(id));

    // Also find in mock data as fallback
    const found = mockIncidents.find((i) => i.id === parseInt(id));
    if (found) {
      setIncident(found);
      setLoading(false);
    }
  }, [dispatch, id]);

  // Use Redux incident if available, otherwise mock
  useEffect(() => {
    if (reduxIncident) {
      setIncident(reduxIncident);
      setLoading(false);
    }
  }, [reduxIncident]);

  // Get status badge class
  const getStatusClass = (status) => {
    const statusMap = {
      pending: "status-badge-pending",
      under_investigation: "status-badge-under-investigation",
      resolved: "status-badge-resolved",
      rejected: "status-badge-rejected",
    };
    return statusMap[status] || "status-badge-pending";
  };

  // Get status display label
  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "Pending",
      under_investigation: "Under Investigation",
      resolved: "Resolved",
      rejected: "Rejected",
    };
    return statusMap[status] || status;
  };

  // Handle delete
  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this incident report? This action cannot be undone.",
      )
    ) {
      await dispatch(removeIncident(id));
      navigate("/dashboard");
    }
  };

  // Handle share location
  const handleShareLocation = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Incident Location",
          text: `Incident at: ${incident.location.address || "Unknown location"}`,
          url: `https://maps.google.com/maps?q=${incident.location.lat},${incident.location.lng}`,
        })
        .catch(() => {});
    } else {
      // Fallback - copy to clipboard
      const url = `https://maps.google.com/maps?q=${incident.location.lat},${incident.location.lng}`;
      navigator.clipboard.writeText(url);
      alert("Location link copied to clipboard!");
    }
  };

  // Handle get directions
  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${incident.location.lat},${incident.location.lng}`;
    window.open(url, "_blank");
  };

  // Handle emergency contact
  const handleEmergencyContact = () => {
    // In production, this would open phone dialer
    alert(
      "Emergency contacts will be shown here.\n\nIn Kenya, call:\n- Police: 999 or 112\n- Ambulance: 999 or 112\n- Fire: 999 or 112",
    );
  };

  if (loading) {
    return (
      <div className='empty-state'>
        <span className='spinner spinner-lg'></span>
        <p className='body-text text-muted'>Loading incident details...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className='empty-state'>
        <h3 className='heading-4'>Incident Not Found</h3>
        <p className='body-small text-muted'>
          The incident you're looking for doesn't exist.
        </p>
        <Link
          to='/dashboard'
          className='btn btn-primary'
          style={{ marginTop: "1rem" }}
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className='incident-detail-page'>
      {/* Header */}
      <div className='incident-detail-header'>
        <Link to='/dashboard' className='btn btn-secondary btn-sm'>
          ← Back to Dashboard
        </Link>
        <div className='incident-detail-ref'>
          {incident.reference ||
            `A/J-2024-${String(incident.id).padStart(4, "0")}`}
        </div>
      </div>

      {/* Main Card */}
      <div className='incident-detail-card'>
        <div className='incident-detail-top'>
          <div className='incident-detail-status'>
            <span className={`status-badge ${getStatusClass(incident.status)}`}>
              {getStatusLabel(incident.status)}
            </span>
            <span className='incident-detail-type'>{incident.type}</span>
            {incident.isAnonymous && (
              <span className='incident-detail-anonymous'>Anonymous</span>
            )}
          </div>
          <div className='incident-detail-actions'>
            <Link
              to={`/incidents/${incident.id}/edit`}
              className='btn btn-secondary btn-sm'
            >
              Edit
            </Link>
            <button className='btn btn-danger btn-sm' onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        <h1 className='heading-2 incident-detail-title'>{incident.title}</h1>

        <div className='incident-detail-meta'>
          <div>
            <span className='body-small text-muted'>Reported</span>
            <span className='body-text'>
              {formatDateTime(incident.created_at)}
            </span>
          </div>
          <div>
            <span className='body-small text-muted'>Last updated</span>
            <span className='body-text'>
              {formatDateTime(incident.updated_at)}
            </span>
          </div>
        </div>

        <div className='divider'></div>

        <div className='incident-detail-description'>
          <h3 className='heading-4'>Description</h3>
          <p className='body-text'>
            {incident.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Location Section */}
      <div className='incident-detail-card'>
        <h3 className='heading-4'>Location</h3>
        <div className='incident-location'>
          <div className='location-coords'>
            <MapPinIcon color='var(--color-red)' size={24} />
            <div>
              <div className='location-address'>
                {incident.location.address || "Address not specified"}
              </div>
              <div className='location-coord-text'>
                <span>Lat: {incident.location.lat}</span>
                <span>Lng: {incident.location.lng}</span>
              </div>
            </div>
          </div>
          <div className='location-actions'>
            <button
              className='btn btn-secondary btn-sm'
              onClick={handleGetDirections}
            >
              Get Directions
            </button>
            <button
              className='btn btn-secondary btn-sm'
              onClick={handleShareLocation}
            >
              Share Location
            </button>
            <button
              className='btn btn-secondary btn-sm'
              onClick={() => setShowLocationModal(true)}
            >
              View on Map
            </button>
          </div>
        </div>
      </div>

      {/* Tracking & Timeline Section */}
      <div className='incident-detail-card'>
        <h3 className='heading-4'>Status Timeline</h3>
        <div className='timeline'>
          <div className='timeline-item active'>
            <div className='timeline-dot'></div>
            <div className='timeline-content'>
              <div className='timeline-title'>Report Submitted</div>
              <div className='timeline-time'>
                {formatDateTime(incident.created_at)}
              </div>
              <div className='timeline-desc'>
                Incident reported by{" "}
                {incident.isAnonymous ? "anonymous user" : "user"}
              </div>
            </div>
          </div>

          {incident.status !== "pending" && (
            <div
              className={`timeline-item ${incident.status === "resolved" ? "resolved" : incident.status === "rejected" ? "rejected" : "active"}`}
            >
              <div className='timeline-dot'></div>
              <div className='timeline-content'>
                <div className='timeline-title'>
                  {getStatusLabel(incident.status)}
                </div>
                <div className='timeline-time'>
                  {formatDateTime(incident.updated_at)}
                </div>
                <div className='timeline-desc'>
                  Status updated to {getStatusLabel(incident.status)}
                </div>
              </div>
            </div>
          )}

          {incident.status === "under_investigation" && (
            <div className='timeline-item'>
              <div className='timeline-dot'></div>
              <div className='timeline-content'>
                <div className='timeline-title'>Under Investigation</div>
                <div className='timeline-time'>
                  {formatDateTime(incident.updated_at)}
                </div>
                <div className='timeline-desc'>
                  Responders are investigating this incident
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tracking Options */}
      <div className='incident-detail-card'>
        <h3 className='heading-4'>Tracking Options</h3>
        <div className='tracking-options'>
          <button
            className='btn btn-primary btn-block'
            onClick={handleShareLocation}
          >
            Share Location with Responders
          </button>
          <button
            className='btn btn-secondary btn-block'
            onClick={handleGetDirections}
          >
            Get Directions to Incident
          </button>
          <button
            className='btn btn-secondary btn-block'
            onClick={handleEmergencyContact}
          >
            Emergency Contacts
          </button>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div
          className='modal-overlay'
          onClick={() => setShowLocationModal(false)}
        >
          <div
            className='modal-content modal-map'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='modal-header'>
              <h3 className='heading-4'>Incident Location</h3>
              <button
                className='modal-close'
                onClick={() => setShowLocationModal(false)}
              >
                <CloseIcon color='var(--color-ink-muted)' size={20} />
              </button>
            </div>
            <div className='modal-body'>
              <div className='map-placeholder'>
                <div className='map-placeholder-content'>
                  <MapPinIcon color='var(--color-red)' size={48} />
                  <div className='map-placeholder-address'>
                    {incident.location.address || "Unknown location"}
                  </div>
                  <div className='map-placeholder-coords'>
                    {incident.location.lat}, {incident.location.lng}
                  </div>
                  <button
                    className='btn btn-primary'
                    onClick={handleGetDirections}
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentDetailPage;
