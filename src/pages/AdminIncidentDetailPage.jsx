import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  fetchAdminIncident,
} from "../redux/slices/adminSlice";

import StatusUpdateForm from "../components/admin/StatusUpdateForm";
import StatusHistory from "../components/admin/StatusHistory";

function AdminIncidentDetailPage() {
  const { id } = useParams();

  const dispatch = useDispatch();

  const {
    currentIncident,
    loading,
    error,
  } = useSelector(
    (state) => state.admin
  );

  const [showStatusForm, setShowStatusForm] =
    useState(false);

  useEffect(() => {
    dispatch(fetchAdminIncident(id));
  }, [dispatch, id]);


  if (loading && !currentIncident) {
    return <p>Loading incident...</p>;
  }


  if (error) {
    return (
      <p className="error-message">
        {error}
      </p>
    );
  }


  if (!currentIncident) {
    return (
      <p>Incident not found.</p>
    );
  }


  return (
    <div className="admin-incident-detail">

      <div className="page-header">

        <div>
          <h1>
            {currentIncident.title}
          </h1>

          <span
            className={`status status-${currentIncident.status}`}
          >
            {currentIncident.status}
          </span>
        </div>


        <button
          onClick={() =>
            setShowStatusForm(true)
          }
        >
          Update Status
        </button>

      </div>


      <div className="incident-details">

        <h2>Incident Information</h2>

        <p>
          <strong>Description:</strong>
        </p>

        <p>
          {currentIncident.description}
        </p>


        <p>
          <strong>Type:</strong>{" "}
          {currentIncident.type}
        </p>


        <p>
          <strong>Location:</strong>{" "}
          {currentIncident.location_address}
        </p>


        <p>
          <strong>Latitude:</strong>{" "}
          {currentIncident.location_lat}
        </p>


        <p>
          <strong>Longitude:</strong>{" "}
          {currentIncident.location_lng}
        </p>


        <p>
          <strong>Reported:</strong>{" "}
          {new Date(
            currentIncident.created_at
          ).toLocaleString()}
        </p>

      </div>


      {/* Media */}

      {currentIncident.media?.length > 0 && (
        <div className="incident-media">

          <h2>Media</h2>

          <div className="media-grid">

            {currentIncident.media.map(
              (media) => (
                <div key={media.id}>

                  {media.media_type ===
                  "image" ? (
                    <img
                      src={media.media_url}
                      alt="Incident"
                    />
                  ) : (
                    <video
                      controls
                      src={media.media_url}
                    />
                  )}

                </div>
              )
            )}

          </div>

        </div>
      )}


      {/* Status History */}

      <StatusHistory
        incidentId={id}
      />


      {/* Status Modal */}

      {showStatusForm && (
        <div className="modal-overlay">

          <div className="modal">

            <StatusUpdateForm
              incident={currentIncident}
              onClose={() =>
                setShowStatusForm(false)
              }
              onUpdated={() => {
                setShowStatusForm(false);

                dispatch(
                  fetchAdminIncident(id)
                );
              }}
            />

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminIncidentDetailPage;