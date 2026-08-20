// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CreateIcon,
  EmergencyIcon,
  ReportsIcon,
  ResolvedIcon,
} from "../components/icons";
import { mockIncidents } from "../utils/mockData";
import { formatDateTime } from "../utils/formatters";

export const HomePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [recentIncidents, setRecentIncidents] = useState([]);

  useEffect(() => {
    // Get 5 most recent incidents
    const sorted = [...mockIncidents]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
    setRecentIncidents(sorted);
  }, []);

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

  // Handle emergency button
  const handleEmergency = () => {
    if (
      window.confirm(
        "This will send an SOS alert to emergency responders. Continue?",
      )
    ) {
      alert("Emergency alert sent! Responders have been notified.");
    }
  };

  return (
    <div className='home-page'>
      <div className='home-welcome'>
        <h1 className='heading-2'>
          Welcome back, {user?.full_name || "User"}!
        </h1>
        <p className='body-small text-muted'>
          What would you like to do today?
        </p>
      </div>

      <div className='home-quick-actions'>
        <Link to='/incidents/create' className='quick-action-btn primary'>
          <span className='action-icon'>
            <CreateIcon color='#ffffff' size={28} />
          </span>
          <span>Report Incident</span>
        </Link>
        <Link to='/dashboard' className='quick-action-btn'>
          <span className='action-icon'>
            <ReportsIcon color='var(--color-navy)' size={28} />
          </span>
          <span>My Reports</span>
        </Link>
        <Link to='/activity' className='quick-action-btn'>
          <span className='action-icon'>
            <ResolvedIcon color='var(--color-green)' size={28} />
          </span>
          <span>Resolved</span>
        </Link>
        <button className='quick-action-btn danger' onClick={handleEmergency}>
          <span className='action-icon'>
            <EmergencyIcon color='#ffffff' size={28} />
          </span>
          <span>Emergency</span>
        </button>
      </div>

      <div className='home-recent'>
        <div className='home-recent-header'>
          <div>
            <h2 className='heading-4'>Recent Activity</h2>
            <p className='body-small text-muted'>
              Your recent incident reports
            </p>
          </div>
          <Link to='/activity' className='btn btn-sm btn-secondary'>
            View All
          </Link>
        </div>

        {recentIncidents.length > 0 ? (
          <div className='recent-incidents'>
            {recentIncidents.map((incident) => (
              <Link
                to={`/incidents/${incident.id}`}
                key={incident.id}
                className='recent-incident-item'
              >
                <div className='recent-incident-header'>
                  <span className='recent-incident-ref'>
                    {incident.reference}
                  </span>
                  <span
                    className={`status-badge ${getStatusClass(incident.status)}`}
                  >
                    {getStatusLabel(incident.status)}
                  </span>
                </div>
                <div className='recent-incident-title'>{incident.title}</div>
                <div className='recent-incident-meta'>
                  <span>{formatDateTime(incident.created_at)}</span>
                  <span>•</span>
                  <span className='recent-incident-type'>{incident.type}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='empty-state'>
            <p className='body-text text-muted'>No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
