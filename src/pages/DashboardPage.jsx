import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchIncidents } from "../redux/slices/incidentSlice";

// Mock data for fallback
const mockIncidents = [
  {
    id: 1,
    title: "Road accident on Mombasa Road",
    status: "pending",
    description: "Multi-vehicle collision",
    created_at: "2024-01-15T10:30:00",
  },
  {
    id: 2,
    title: "Emergency medical response",
    status: "resolved",
    description: "Medical emergency at Nairobi CBD",
    created_at: "2024-01-14T14:20:00",
  },
  {
    id: 3,
    title: "Fire incident reported",
    status: "under_investigation",
    description: "Fire at industrial area",
    created_at: "2024-01-13T09:15:00",
  },
];

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.incidents);

  useEffect(() => {
    dispatch(fetchIncidents());
  }, [dispatch]);

  const incidents = items && items.length > 0 ? items : mockIncidents;

  return (
    <div className='dashboard-page'>
      <div className='page-heading'>
        <div>
          <p className='eyebrow'>My reports</p>
          <h1 className='heading-2'>Keep an eye on what you reported.</h1>
          <p className='body-small text-muted'>
            Track updates and add detail when responders need it.
          </p>
        </div>
        <Link className='btn btn-primary' to='/incidents/create'>
          New report
        </Link>
      </div>
      {error && <div className='alert alert-error'>{error}</div>}

      <div className='incident-list'>
        {loading ? (
          <div className='loading-state'>
            <span className='spinner'></span>
            <p>Loading your reports...</p>
          </div>
        ) : (
          incidents.map((incident) => (
            <div key={incident.id} className='incident-card'>
              <div className='incident-card-header'>
                <span className='incident-card-title'>{incident.title}</span>
                <span
                  className={`status-badge status-badge-${incident.status}`}
                >
                  {incident.status?.replace("_", " ") || "pending"}
                </span>
              </div>
              <p className='incident-card-description'>
                {incident.description}
              </p>
              <div className='incident-card-footer'>
                <span className='incident-card-meta'>
                  {incident.created_at
                    ? new Date(incident.created_at).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
