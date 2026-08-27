import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./AdminIncidentsPage.css"
import {
  fetchAdminIncidents,
} from "../redux/slices/adminSlice";

function AdminIncidentsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    incidents,
    loading,
    error,
  } = useSelector(
    (state) => state.admin
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    dispatch(
      fetchAdminIncidents({
        search,
        status,
        type,
      })
    );
  }, [dispatch, search, status, type]);

  return (
    <div className="admin-incidents-page">

      <div className="page-header">
        <div>
          <h1>All Incidents</h1>
          <p>
            Manage and monitor reported incidents.
          </p>
        </div>
      </div>


      {/* Filters */}

      <div className="incident-filters">

        <input
          type="text"
          placeholder="Search incidents..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
        >
          <option value="">
            All statuses
          </option>

          <option value="reported">
            Reported
          </option>

          <option value="under_review">
            Under Review
          </option>

          <option value="in_progress">
            In Progress
          </option>

          <option value="resolved">
            Resolved
          </option>

          <option value="rejected">
            Rejected
          </option>
        </select>


        <input
          type="text"
          placeholder="Incident type"
          value={type}
          onChange={(event) =>
            setType(event.target.value)
          }
        />

      </div>


      {loading && (
        <p>Loading incidents...</p>
      )}


      {error && (
        <p className="error-message">
          {error}
        </p>
      )}


      {!loading &&
        !error &&
        incidents.length === 0 && (
          <p>No incidents found.</p>
        )}


      <div className="incidents-list">

        {incidents.map((incident) => (

          <div
            className="admin-incident-card"
            key={incident.id}
          >

            <div className="incident-card-info">

              <h3>{incident.title}</h3>

              <p>
                {incident.description}
              </p>

              <p>
                <strong>Type:</strong>{" "}
                {incident.type}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {incident.location_address}
              </p>

              <span
                className={`status status-${incident.status}`}
              >
                {incident.status}
              </span>

            </div>


            <button
              onClick={() =>
                navigate(
                  `/admin/incidents/${incident.id}`
                )
              }
            >
              View
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default AdminIncidentsPage;