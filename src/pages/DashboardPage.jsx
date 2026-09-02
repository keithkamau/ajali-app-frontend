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
          <div className='empty-state-icon'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 640 640'
              width='64'
              height='64'
              fill='currentColor'
              opacity='0.5'
            >
              <path d='M439.4 96L448 96C483.3 96 512 124.7 512 160L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 160C128 124.7 156.7 96 192 96L200.6 96C211.6 76.9 232.3 64 256 64L384 64C407.7 64 428.4 76.9 439.4 96zM376 176C389.3 176 400 165.3 400 152C400 138.7 389.3 128 376 128L264 128C250.7 128 240 138.7 240 152C240 165.3 250.7 176 264 176L376 176zM256 320C256 302.3 241.7 288 224 288C206.3 288 192 302.3 192 320C192 337.7 206.3 352 224 352C241.7 352 256 337.7 256 320zM288 320C288 333.3 298.7 344 312 344L424 344C437.3 344 448 333.3 448 320C448 306.7 437.3 296 424 296L312 296C298.7 296 288 306.7 288 320zM288 448C288 461.3 298.7 472 312 472L424 472C437.3 472 448 461.3 448 448C448 434.7 437.3 424 424 424L312 424C298.7 424 288 434.7 288 448zM224 480C241.7 480 256 465.7 256 448C256 430.3 241.7 416 224 416C206.3 416 192 430.3 192 448C192 465.7 206.3 480 224 480z' />
            </svg>
          </div>
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
