import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchIncidents,
  deleteIncident,
  clearSuccess,
} from "../redux/slices/incidentSlice";
import "./DashboardPage.css";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { incidents, isLoading, error, success } = useSelector(
    (state) => state.incidents,
  );
  const { user } = useSelector((state) => state.auth);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchIncidents());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this incident?")) {
      setDeletingId(id);
      await dispatch(deleteIncident(id));
      setDeletingId(null);
    }
  };

  if (isLoading && incidents.length === 0) {
    return (
      <div className='dashboard-container'>
        <div className='loading-container'>
          <div className='spinner'></div>
          <p>Loading incidents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='dashboard-container'>
      <div className='dashboard-header'>
        <div>
          <h1 className='page-title'>Dashboard</h1>
          <p className='page-subtitle'>
            Welcome back, {user?.full_name || "User"}!
          </p>
        </div>
        <Link to='/incidents/create' className='btn btn-primary'>
          + Report Incident
        </Link>
      </div>

      {error && (
        <div className='alert alert-error'>
          {typeof error === "string"
            ? error
            : error?.message || "An error occurred"}
        </div>
      )}
      {success && <div className='alert alert-success'>{success}</div>}

      {incidents.length === 0 ? (
        <div className='empty-state'>
          <div className='empty-state-icon'>📋</div>
          <h3 className='empty-state-title'>No Incidents Reported</h3>
          <p className='empty-state-description'>
            You haven't reported any incidents yet. Click the button above to
            report your first incident.
          </p>
        </div>
      ) : (
        <div className='incident-grid'>
          {incidents.map((incident) => (
            <div key={incident.id} className='incident-card card card-hover'>
              <div className='incident-card-header'>
                <h3 className='incident-card-title'>{incident.title}</h3>
                <span
                  className={`badge badge-${incident.status?.replace("_", "-") || "pending"}`}
                >
                  {incident.status?.replace("_", " ") || "Pending"}
                </span>
              </div>
              <p className='incident-card-description'>
                {incident.description}
              </p>
              <div className='incident-card-footer'>
                <div className='incident-card-meta'>
                  <span>
                    {new Date(incident.created_at).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>{incident.type || "Unknown"}</span>
                </div>
                <div className='incident-card-actions'>
                  <Link
                    to={`/incidents/${incident.id}`}
                    className='btn btn-secondary btn-sm'
                  >
                    View
                  </Link>
                  <Link
                    to={`/incidents/${incident.id}/edit`}
                    className='btn btn-primary btn-sm'
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(incident.id)}
                    className='btn btn-danger btn-sm'
                    disabled={deletingId === incident.id}
                  >
                    {deletingId === incident.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
