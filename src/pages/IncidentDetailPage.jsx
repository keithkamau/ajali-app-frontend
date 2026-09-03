import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  fetchIncidentById,
  deleteIncident,
  clearError,
  clearSuccess,
} from "../redux/slices/incidentSlice";
import "./IncidentDetailPage.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export const IncidentDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentIncident, isLoading, error, success } = useSelector(
    (state) => state.incidents,
  );
  const { user } = useSelector((state) => state.auth);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      console.log("Fetching incident with id:", id);
      dispatch(fetchIncidentById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this incident?")) {
      setIsDeleting(true);
      await dispatch(deleteIncident(id));
      setIsDeleting(false);
      navigate("/dashboard");
    }
  };

  const isOwner = currentIncident?.user?.id === user?.id;
  const isAdmin = user?.role === "admin";

  if (isLoading) {
    return (
      <div className='loading-container'>
        <div className='spinner'></div>
        <p>Loading incident details...</p>
      </div>
    );
  }

  if (!currentIncident) {
    return (
      <div className='error-container'>
        <h2>Incident Not Found</h2>
        <p>
          The incident you're looking for doesn't exist or you don't have
          permission to view it.
        </p>
        <Link to='/dashboard' className='btn btn-primary'>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className='incident-detail-page'>
      <div className='incident-detail-header'>
        <Link to='/dashboard' className='btn btn-secondary btn-sm'>
          ← Back
        </Link>
        <h1 className='page-title'>{currentIncident.title}</h1>
        <span
          className={`badge badge-${currentIncident.status?.replace("_", "-") || "pending"}`}
        >
          {currentIncident.status?.replace("_", " ") || "Pending"}
        </span>
      </div>

      {error && (
        <div className='alert alert-error'>
          {typeof error === "string"
            ? error
            : error?.message || "An error occurred"}
        </div>
      )}
      {success && <div className='alert alert-success'>{success}</div>}

      <div className='incident-detail-grid'>
        <div className='incident-detail-main'>
          <div className='detail-card'>
            <h3>Description</h3>
            <p>{currentIncident.description}</p>
          </div>

          <div className='detail-card'>
            <h3>Details</h3>
            <div className='detail-row'>
              <span className='detail-label'>Type:</span>
              <span className='detail-value'>
                {currentIncident.type || "Unknown"}
              </span>
            </div>
            <div className='detail-row'>
              <span className='detail-label'>Reported by:</span>
              <span className='detail-value'>
                {currentIncident.is_anonymous
                  ? "Anonymous"
                  : currentIncident.user?.full_name || "Unknown"}
              </span>
            </div>
            <div className='detail-row'>
              <span className='detail-label'>Date:</span>
              <span className='detail-value'>
                {new Date(currentIncident.created_at).toLocaleString()}
              </span>
            </div>
            {currentIncident.location_address && (
              <div className='detail-row'>
                <span className='detail-label'>Address:</span>
                <span className='detail-value'>
                  {currentIncident.location_address}
                </span>
              </div>
            )}
          </div>

          {(isOwner || isAdmin) && (
            <div className='detail-card'>
              <h3>Actions</h3>
              <div className='action-buttons'>
                <Link
                  to={`/incidents/${currentIncident.id}/edit`}
                  className='btn btn-primary'
                >
                  Edit Incident
                </Link>
                <button
                  onClick={handleDelete}
                  className='btn btn-danger'
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Incident"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className='incident-detail-sidebar'>
          {/* Location Map */}
          <div className='detail-card'>
            <h3>Location</h3>
            {currentIncident.location_lat && currentIncident.location_lng ? (
              <div className='detail-map-container'>
                <MapContainer
                  center={[
                    parseFloat(currentIncident.location_lat),
                    parseFloat(currentIncident.location_lng),
                  ]}
                  zoom={14}
                  style={{
                    height: "250px",
                    width: "100%",
                    borderRadius: "0.5rem",
                  }}
                  zoomControl={true}
                  attributionControl={false}
                >
                  <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker
                    position={[
                      parseFloat(currentIncident.location_lat),
                      parseFloat(currentIncident.location_lng),
                    ]}
                  >
                    <Popup>
                      <strong>{currentIncident.title}</strong>
                      <p style={{ margin: "4px 0 0", fontSize: "12px" }}>
                        Lat: {currentIncident.location_lat}
                        <br />
                        Lng: {currentIncident.location_lng}
                      </p>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            ) : (
              <p className='no-location'>No location provided</p>
            )}
            <div className='coords-display'>
              <span>Lat: {currentIncident.location_lat || "N/A"}</span>
              <span>Lng: {currentIncident.location_lng || "N/A"}</span>
            </div>
          </div>

          {/* Status History */}
          <div className='detail-card'>
            <h3>Status History</h3>
            {currentIncident.status_history &&
            currentIncident.status_history.length > 0 ? (
              <div className='status-history'>
                {currentIncident.status_history.map((history, index) => (
                  <div key={index} className='status-history-item'>
                    <span
                      className={`status-dot status-${history.new_status?.replace("_", "-")}`}
                    ></span>
                    <div>
                      <p className='status-change'>
                        {history.old_status ? `${history.old_status} → ` : ""}
                        {history.new_status}
                      </p>
                      {history.comment && (
                        <p className='status-comment'>{history.comment}</p>
                      )}
                      <span className='status-date'>
                        {new Date(
                          history.changed_at || history.created_at,
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='no-history'>No status changes yet</p>
            )}
          </div>

          {/* Media */}
          {currentIncident.media && currentIncident.media.length > 0 && (
            <div className='detail-card'>
              <h3>Media</h3>
              <div className='media-grid'>
                {currentIncident.media.map((item, index) => (
                  <div key={index} className='media-item'>
                    {item.media_type === "image" ? (
                      <img
                        src={item.media_url}
                        alt={`Media ${index + 1}`}
                        onClick={() => window.open(item.media_url, "_blank")}
                      />
                    ) : (
                      <video
                        src={item.media_url}
                        controls
                        onClick={() => window.open(item.media_url, "_blank")}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailPage;
