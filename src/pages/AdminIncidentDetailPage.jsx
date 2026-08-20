import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminIncidentDetailPage.css";
import React from "react";
function AdminIncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("In Progress");

  // Temporary mock data.
  // Later this will come from the Flask API.
  const incident = {
    id: id,
    title: "Road Accident",
    type: "Accident",
    description:
      "A road accident has been reported involving two vehicles. Emergency assistance is required.",
    location: "Ngong Road, Nairobi",
    latitude: -1.2921,
    longitude: 36.8219,
    priority: "Critical",
    reportedBy: "Anonymous",
    reportedAt: "Today, 10:24 AM",
  };

  const statusHistory = [
    {
      status: "In Progress",
      date: "Today, 10:31 AM",
      by: "Admin",
      comment: "Emergency response team dispatched.",
    },
    {
      status: "Reported",
      date: "Today, 10:24 AM",
      by: "System",
      comment: "Incident report submitted.",
    },
  ];

  function handleStatusChange(event) {
    setStatus(event.target.value);
  }

  function handleUpdateStatus() {
    console.log("Updating incident:", id);
    console.log("New status:", status);

    // Later:
    // PUT /api/admin/incidents/{id}/status
  }

  return (
    <div className="admin-incident-detail">
      {/* Header */}
      <div className="incident-detail-header">
        <div>
          <button
            className="back-btn"
            onClick={() => navigate("/admin/incidents")}
          >
            ← Back to Reports
          </button>

          <h1>Incident Details</h1>
          <p>Report ID: {incident.id}</p>
        </div>

        <span
          className={`detail-status ${status
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {status}
        </span>
      </div>

      <div className="incident-detail-grid">
        {/* Main information */}
        <div className="incident-main-card">
          <div className="card-title">
            <h2>{incident.title}</h2>

            <span className="priority-badge">
              {incident.priority}
            </span>
          </div>

          <div className="incident-info-grid">
            <div>
              <label>Incident Type</label>
              <strong>{incident.type}</strong>
            </div>

            <div>
              <label>Reported By</label>
              <strong>{incident.reportedBy}</strong>
            </div>

            <div>
              <label>Reported At</label>
              <strong>{incident.reportedAt}</strong>
            </div>

            <div>
              <label>Location</label>
              <strong>{incident.location}</strong>
            </div>
          </div>

          <div className="incident-description">
            <h3>Description</h3>
            <p>{incident.description}</p>
          </div>

          {/* Location */}
          <div className="incident-location">
            <h3>Location</h3>

            <div className="location-placeholder">
              <div className="location-pin">📍</div>

              <div>
                <strong>{incident.location}</strong>

                <p>
                  Coordinates: {incident.latitude},{" "}
                  {incident.longitude}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin controls */}
        <div className="incident-side-column">
          <div className="admin-control-card">
            <h2>Update Status</h2>

            <p>
              Change the current status of this incident.
            </p>

            <select
              value={status}
              onChange={handleStatusChange}
            >
              <option value="Reported">Reported</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <button
              className="update-status-btn"
              onClick={handleUpdateStatus}
            >
              Update Status
            </button>
          </div>

          <div className="admin-control-card">
            <h2>Incident Priority</h2>

            <div className="priority-display">
              <span className="priority-dot"></span>

              <div>
                <strong>{incident.priority}</strong>
                <p>Requires immediate attention</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status history */}
      <div className="status-history-card">
        <div className="history-header">
          <h2>Status History</h2>
          <span>{statusHistory.length} updates</span>
        </div>

        <div className="timeline">
          {statusHistory.map((item, index) => (
            <div className="timeline-item" key={index}>
              <div className="timeline-marker"></div>

              <div className="timeline-content">
                <div className="timeline-top">
                  <strong>{item.status}</strong>
                  <span>{item.date}</span>
                </div>

                <p>{item.comment}</p>

                <small>
                  Changed by: {item.by}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminIncidentDetailPage;