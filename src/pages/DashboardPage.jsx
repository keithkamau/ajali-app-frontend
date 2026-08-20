import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchIncidents,
  deleteIncident,
  clearSuccess,
} from "../redux/slices/incidentSlice";

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error, success } = useSelector(
    (state) => state.incidents,
  );
  const { user } = useSelector((state) => state.auth);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDelete = async () => {
    await dispatch(deleteIncident(deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    navigate(`/incidents/${id}/edit`);
  };

  const handleViewIncident = (id) => {
    // Explicit check - user is regular user by default
    if (user && user.role === "admin") {
      navigate(`/admin/incidents/${id}`);
    } else {
      // Regular user navigation
      navigate(`/incidents/${id}`);
    }
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "status-badge-pending";
      case "under_investigation":
        return "status-badge-under-investigation";
      case "resolved":
        return "status-badge-resolved";
      case "rejected":
        return "status-badge-rejected";
      default:
        return "status-badge-pending";
    }
  };

  // Get incidents for this user - fallback to mock data if items empty
  const userIncidents =
    items && items.length > 0
      ? items.filter((item) => item.user_id === user?.id || !item.user_id)
      : [
          {
            id: 1,
            title: "Road accident on Mombasa Road",
            status: "pending",
            description: "Multi-vehicle collision",
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            title: "Emergency medical response",
            status: "resolved",
            description: "Medical emergency at Nairobi CBD",
            created_at: new Date().toISOString(),
          },
          {
            id: 3,
            title: "Fire incident reported",
            status: "under_investigation",
            description: "Fire at industrial area",
            created_at: new Date().toISOString(),
          },
        ];

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
      {success && <div className='alert alert-success'>{success}</div>}

      <div className='incident-list'>
        {loading ? (
          <div className='loading-state'>
            <span className='spinner'></span>
            <p>Loading your reports...</p>
          </div>
        ) : userIncidents.length === 0 ? (
          <div className='empty-state'>
            <p className='body-text text-muted'>
              You haven't reported any incidents yet
            </p>
            <Link
              to='/incidents/create'
              className='btn btn-primary'
              style={{ marginTop: "1rem" }}
            >
              Report your first incident
            </Link>
          </div>
        ) : (
          userIncidents.map((incident) => (
            <div
              key={incident.id}
              className='incident-card clickable'
              onClick={() => handleViewIncident(incident.id)}
            >
              <div className='incident-card-header'>
                <span className='incident-card-title'>{incident.title}</span>
                <span
                  className={`status-badge ${getStatusBadgeClass(incident.status)}`}
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
                  {incident.reference && ` • ${incident.reference}`}
                </span>
                <div
                  className='incident-card-actions'
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => handleEdit(incident.id, e)}
                    className='btn btn-sm btn-secondary'
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(incident.id, e)}
                    className='btn btn-sm btn-danger'
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showDeleteModal && (
        <div
          className='modal-overlay'
          onClick={() => setShowDeleteModal(false)}
        >
          <div className='modal' onClick={(e) => e.stopPropagation()}>
            <h3 className='heading-4'>Delete Incident</h3>
            <p className='body-text text-muted'>
              Are you sure you want to delete this incident? This action cannot
              be undone.
            </p>
            <div className='modal-actions'>
              <button
                onClick={() => setShowDeleteModal(false)}
                className='btn btn-secondary'
              >
                Cancel
              </button>
              <button onClick={handleDelete} className='btn btn-danger'>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
