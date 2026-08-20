import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchIncidentById,
  deleteIncident,
  updateIncidentStatus,
  fetchStatusHistory,
  clearError,
  clearSuccess,
  clearStatusHistory,
} from "../redux/slices/incidentSlice";
import { MapPinIcon } from "../components/icons";

export const IncidentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentIncident, statusHistory, loading, error, success } =
    useSelector((state) => state.incidents);
  const { user } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusComment, setStatusComment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const isAdmin = user?.role === "admin";
  const isOwner = currentIncident?.user_id === user?.id;

  useEffect(() => {
    dispatch(fetchIncidentById(id));
    if (isAdmin) {
      dispatch(fetchStatusHistory(id));
    }
    return () => {
      dispatch(clearStatusHistory());
    };
  }, [dispatch, id, isAdmin]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleDelete = async () => {
    await dispatch(deleteIncident(id));
    setShowDeleteModal(false);
    navigate("/dashboard");
  };

  const handleStatusUpdate = async () => {
    await dispatch(
      updateIncidentStatus({
        id,
        status: selectedStatus,
        comment: statusComment,
      }),
    );
    setShowStatusModal(false);
    setStatusComment("");
    setSelectedStatus("");
    dispatch(fetchStatusHistory(id));
  };

  const handleEdit = () => {
    navigate(`/incidents/${id}/edit`);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (loading && !currentIncident) {
    return (
      <div className='loading-state'>
        <span className='spinner'></span>
        <p>Loading incident details...</p>
      </div>
    );
  }

  if (error && !currentIncident) {
    return (
      <div className='alert alert-error'>
        {error}
        <Link
          to='/dashboard'
          className='btn btn-secondary'
          style={{ marginTop: "1rem" }}
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!currentIncident) {
    return (
      <div className='empty-state'>
        <p className='body-text text-muted'>Incident not found</p>
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

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "under_investigation", label: "Under Investigation" },
    { value: "resolved", label: "Resolved" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className='incident-detail-page'>
      {success && (
        <div className='alert alert-success' style={{ marginBottom: "1rem" }}>
          {success}
        </div>
      )}

      <div className='incident-detail-header'>
        <div>
          <Link to='/dashboard' className='back-link'>
            ← Back to Dashboard
          </Link>
          <h1 className='heading-2'>{currentIncident.title}</h1>
          <div className='incident-detail-meta'>
            <span className='body-small text-muted'>
              Reported on {formatDate(currentIncident.created_at)}
            </span>
            <span
              className={`status-badge ${getStatusBadgeClass(currentIncident.status)}`}
            >
              {currentIncident.status?.replace("_", " ") || "pending"}
            </span>
            {currentIncident.reference && (
              <span className='body-small text-muted'>
                Reference: {currentIncident.reference}
              </span>
            )}
          </div>
        </div>
        <div className='incident-detail-actions'>
          {(isOwner || isAdmin) && (
            <>
              <button onClick={handleEdit} className='btn btn-secondary'>
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className='btn btn-danger'
              >
                Delete
              </button>
            </>
          )}
          {isAdmin && (
            <button
              onClick={() => setShowStatusModal(true)}
              className='btn btn-primary'
            >
              Update Status
            </button>
          )}
        </div>
      </div>

      <div className='incident-detail-content'>
        <div className='card incident-detail-card'>
          <h3 className='heading-4' style={{ marginBottom: "0.5rem" }}>
            Description
          </h3>
          <p className='body-text'>{currentIncident.description}</p>
        </div>

        {currentIncident.location_lat && currentIncident.location_lng && (
          <div className='card incident-detail-card'>
            <h3 className='heading-4' style={{ marginBottom: "0.5rem" }}>
              Location
            </h3>
            <div className='incident-detail-location'>
              <MapPinIcon color='var(--color-red)' size={24} />
              <span className='body-text'>
                {currentIncident.location_address ||
                  `${currentIncident.location_lat}, ${currentIncident.location_lng}`}
              </span>
            </div>
          </div>
        )}

        {currentIncident.images && currentIncident.images.length > 0 && (
          <div className='card incident-detail-card'>
            <h3 className='heading-4' style={{ marginBottom: "0.5rem" }}>
              Images
            </h3>
            <div className='incident-detail-media'>
              {currentIncident.images.map((img, index) => (
                <img key={index} src={img} alt={`Incident ${index + 1}`} />
              ))}
            </div>
          </div>
        )}

        {currentIncident.videos && currentIncident.videos.length > 0 && (
          <div className='card incident-detail-card'>
            <h3 className='heading-4' style={{ marginBottom: "0.5rem" }}>
              Videos
            </h3>
            <div className='incident-detail-media'>
              {currentIncident.videos.map((video, index) => (
                <video key={index} controls src={video} />
              ))}
            </div>
          </div>
        )}

        {isAdmin && statusHistory && statusHistory.length > 0 && (
          <div className='card incident-detail-card'>
            <h3 className='heading-4' style={{ marginBottom: "0.5rem" }}>
              Status History
            </h3>
            <div className='status-timeline'>
              {statusHistory.map((entry, index) => (
                <div key={index} className='status-timeline-item'>
                  <div className='status-timeline-badge'>
                    <span
                      className={`status-badge ${getStatusBadgeClass(entry.new_status)}`}
                    >
                      {entry.new_status?.replace("_", " ")}
                    </span>
                  </div>
                  <div className='status-timeline-content'>
                    <div className='status-timeline-comment'>
                      {entry.comment || "Status updated"}
                    </div>
                    <div className='status-timeline-meta'>
                      <span className='body-small text-muted'>
                        By {entry.changed_by || "Admin"} at{" "}
                        {formatDate(entry.changed_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
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

      {/* Status Update Modal */}
      {showStatusModal && (
        <div
          className='modal-overlay'
          onClick={() => setShowStatusModal(false)}
        >
          <div className='modal' onClick={(e) => e.stopPropagation()}>
            <h3 className='heading-4'>Update Status</h3>
            <div className='form-group'>
              <label className='label label-required'>Status</label>
              <select
                className='input'
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value=''>Select status...</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label className='label'>Comment</label>
              <textarea
                className='input'
                placeholder='Add a comment about this status change...'
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                rows='3'
              />
            </div>
            <div className='modal-actions'>
              <button
                onClick={() => setShowStatusModal(false)}
                className='btn btn-secondary'
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className='btn btn-primary'
                disabled={!selectedStatus}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentDetailPage;
