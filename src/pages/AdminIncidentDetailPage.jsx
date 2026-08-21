// src/pages/AdminIncidentDetailPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPinIcon } from "../components/icons";

function AdminIncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("In Progress");

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

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      Reported: "status-badge-pending",
      "In Progress": "status-badge-under-investigation",
      Resolved: "status-badge-resolved",
      Rejected: "status-badge-rejected",
    };
    return statusMap[status] || "status-badge-pending";
  };

  const getPriorityClass = (priority) => {
    const priorityMap = {
      Critical: "priority-critical",
      High: "priority-high",
      Medium: "priority-medium",
      Low: "priority-low",
    };
    return priorityMap[priority] || "priority-medium";
  };

  function handleStatusChange(event) {
    setStatus(event.target.value);
  }

  function handleUpdateStatus() {
    console.log("Updating incident:", id);
    console.log("New status:", status);
  }

  const statusOptions = [
    { value: "Reported", label: "Reported" },
    { value: "In Progress", label: "In Progress" },
    { value: "Resolved", label: "Resolved" },
    { value: "Rejected", label: "Rejected" },
  ];

  return (
    <div className='incident-detail-page'>
      <div className='incident-detail-header'>
        <div>
          <button
            className='back-link'
            onClick={() => navigate("/admin/incidents")}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            ← Back to Reports
          </button>
          <h1 className='heading-2'>Incident Details</h1>
          <div className='incident-detail-meta'>
            <span className='body-small text-muted'>
              Report ID: {incident.id}
            </span>
            <span className={`status-badge ${getStatusBadgeClass(status)}`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      <div className='incident-detail-grid'>
        <div className='incident-detail-content'>
          <div className='card incident-detail-card'>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2 className='heading-4'>{incident.title}</h2>
              <span
                className={`priority-badge ${getPriorityClass(incident.priority)}`}
              >
                {incident.priority}
              </span>
            </div>

            <div className='incident-info-grid'>
              <div>
                <label className='body-small text-muted'>Incident Type</label>
                <strong className='body-text'>{incident.type}</strong>
              </div>
              <div>
                <label className='body-small text-muted'>Reported By</label>
                <strong className='body-text'>{incident.reportedBy}</strong>
              </div>
              <div>
                <label className='body-small text-muted'>Reported At</label>
                <strong className='body-text'>{incident.reportedAt}</strong>
              </div>
              <div>
                <label className='body-small text-muted'>Location</label>
                <strong className='body-text'>{incident.location}</strong>
              </div>
            </div>

            <div
              className='incident-description'
              style={{ marginTop: "1.5rem" }}
            >
              <h3 className='heading-5' style={{ marginBottom: "0.5rem" }}>
                Description
              </h3>
              <p className='body-text'>{incident.description}</p>
            </div>

            <div className='incident-location' style={{ marginTop: "1.5rem" }}>
              <h3 className='heading-5' style={{ marginBottom: "0.5rem" }}>
                Location
              </h3>
              <div className='incident-detail-location'>
                <MapPinIcon color='var(--color-red)' size={24} />
                <div>
                  <strong className='body-text'>{incident.location}</strong>
                  <p className='body-small text-muted'>
                    Coordinates: {incident.latitude}, {incident.longitude}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='incident-side-column'>
          <div className='card' style={{ marginBottom: "1rem" }}>
            <h3 className='heading-4' style={{ marginBottom: "0.5rem" }}>
              Update Status
            </h3>
            <p
              className='body-small text-muted'
              style={{ marginBottom: "1rem" }}
            >
              Change the current status of this incident.
            </p>
            <div className='form-group'>
              <select
                className='input'
                value={status}
                onChange={handleStatusChange}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              className='btn btn-primary btn-block'
              onClick={handleUpdateStatus}
            >
              Update Status
            </button>
          </div>

          <div className='card'>
            <h3 className='heading-4' style={{ marginBottom: "0.5rem" }}>
              Incident Priority
            </h3>
            <div className='incident-detail-location'>
              <span
                className={`priority-badge ${getPriorityClass(incident.priority)}`}
              >
                {incident.priority}
              </span>
              <div>
                <strong className='body-text'>{incident.priority}</strong>
                <p className='body-small text-muted'>
                  Requires immediate attention
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status History */}
      <div className='card' style={{ marginTop: "1.5rem" }}>
        <div
          className='history-header'
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3 className='heading-4'>Status History</h3>
          <span className='body-small text-muted'>
            {statusHistory.length} updates
          </span>
        </div>

        <div className='status-timeline'>
          {statusHistory.map((item, index) => (
            <div className='status-timeline-item' key={index}>
              <div className='status-timeline-badge'>
                <span
                  className={`status-badge ${getStatusBadgeClass(item.status)}`}
                >
                  {item.status}
                </span>
              </div>
              <div className='status-timeline-content'>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <strong className='body-text'>{item.status}</strong>
                  <span className='body-small text-muted'>{item.date}</span>
                </div>
                <p className='body-small'>{item.comment}</p>
                <span className='body-small text-muted'>
                  Changed by: {item.by}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminIncidentDetailPage;
