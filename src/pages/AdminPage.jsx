import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchAllIncidents,
  updateIncidentStatus,
} from "../redux/slices/adminSlice";
import "./AdminPage.css";

const AdminPage = () => {
  const dispatch = useDispatch();
  const { incidents, isLoading, error, stats } = useSelector(
    (state) => state.admin,
  );
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: "", comment: "" });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAllIncidents());
  }, [dispatch]);

  const handleStatusUpdate = async (incidentId) => {
    await dispatch(
      updateIncidentStatus({
        id: incidentId,
        status: statusUpdate.status,
        comment: statusUpdate.comment,
      }),
    );
    setSelectedIncident(null);
    setStatusUpdate({ status: "", comment: "" });
  };

  const filteredIncidents = incidents.filter((incident) => {
    if (filter === "all") return true;
    return incident.status === filter;
  });

  if (isLoading) {
    return (
      <div className='admin-loading'>
        <div className='spinner'></div>
        <p>Loading incidents...</p>
      </div>
    );
  }

  return (
    <div className='admin-page'>
      <div className='page-header'>
        <h1 className='page-title'>Admin Dashboard</h1>
        <p className='page-subtitle'>Manage all incident reports</p>
      </div>

      {/* Stats */}
      <div className='admin-stats'>
        <div className='stat-card'>
          <span className='stat-value'>{stats.total || incidents.length}</span>
          <span className='stat-label'>Total Incidents</span>
        </div>
        <div className='stat-card'>
          <span className='stat-value'>
            {stats.pending ||
              incidents.filter((i) => i.status === "pending").length}
          </span>
          <span className='stat-label'>Pending</span>
        </div>
        <div className='stat-card'>
          <span className='stat-value'>
            {stats.resolved ||
              incidents.filter((i) => i.status === "resolved").length}
          </span>
          <span className='stat-label'>Resolved</span>
        </div>
        <div className='stat-card'>
          <span className='stat-value'>
            {stats.rejected ||
              incidents.filter((i) => i.status === "rejected").length}
          </span>
          <span className='stat-label'>Rejected</span>
        </div>
      </div>

      {/* Filters */}
      <div className='admin-filters'>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className='input'
        >
          <option value='all'>All Incidents</option>
          <option value='pending'>Pending</option>
          <option value='under_investigation'>Under Investigation</option>
          <option value='resolved'>Resolved</option>
          <option value='rejected'>Rejected</option>
        </select>
      </div>

      {error && (
        <div className='alert alert-error'>
          {typeof error === "string"
            ? error
            : error?.message || "An error occurred"}
        </div>
      )}

      <div className='admin-incident-list'>
        {filteredIncidents.length === 0 ? (
          <div className='empty-state'>
            <p>No incidents found</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <div key={incident.id} className='admin-incident-card'>
              <div className='admin-incident-header'>
                <h3>{incident.title}</h3>
                <span
                  className={`badge badge-${incident.status?.replace("_", "-") || "pending"}`}
                >
                  {incident.status?.replace("_", " ") || "Pending"}
                </span>
              </div>
              <p className='admin-incident-description'>
                {incident.description}
              </p>
              <div className='admin-incident-meta'>
                <span>By: {incident.user?.full_name || "Anonymous"}</span>
                <span>•</span>
                <span>
                  {new Date(incident.created_at).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{incident.type}</span>
              </div>
              <div className='admin-incident-actions'>
                <button
                  className='btn btn-primary btn-sm'
                  onClick={() => setSelectedIncident(incident.id)}
                >
                  Update Status
                </button>
                <Link
                  to={`/incidents/${incident.id}`}
                  className='btn btn-secondary btn-sm'
                >
                  View Details
                </Link>
              </div>

              {selectedIncident === incident.id && (
                <div className='status-update-form'>
                  <select
                    className='input'
                    value={statusUpdate.status}
                    onChange={(e) =>
                      setStatusUpdate({
                        ...statusUpdate,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value=''>Select Status</option>
                    <option value='pending'>Pending</option>
                    <option value='under_investigation'>
                      Under Investigation
                    </option>
                    <option value='resolved'>Resolved</option>
                    <option value='rejected'>Rejected</option>
                  </select>
                  <input
                    type='text'
                    className='input'
                    placeholder='Comment (optional)'
                    value={statusUpdate.comment}
                    onChange={(e) =>
                      setStatusUpdate({
                        ...statusUpdate,
                        comment: e.target.value,
                      })
                    }
                  />
                  <button
                    className='btn btn-primary btn-sm'
                    onClick={() => handleStatusUpdate(incident.id)}
                    disabled={!statusUpdate.status}
                  >
                    Update
                  </button>
                  <button
                    className='btn btn-secondary btn-sm'
                    onClick={() => setSelectedIncident(null)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPage;
