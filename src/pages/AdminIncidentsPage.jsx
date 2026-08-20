import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  setIncidents,
  bulkUpdateIncidentStatus as updateReduxBulkStatus,
} from "../redux/slices/adminSlice";

import {
  getAdminIncidents,
  bulkUpdateIncidentStatus,
} from "../services/adminApi";

import "./AdminIncidentsPage.css";

const mockIncidents = [
  {
    id: "AJ-001",
    title: "Road Accident",
    type: "Accident",
    location: "Ngong Road",
    priority: "Critical",
    status: "Reported",
    date: "Today, 10:24 AM",
  },
  {
    id: "AJ-002",
    title: "Medical Emergency",
    type: "Medical",
    location: "Kilimani",
    priority: "High",
    status: "In Progress",
    date: "Today, 09:45 AM",
  },
  {
    id: "AJ-003",
    title: "Building Fire",
    type: "Fire",
    location: "Westlands",
    priority: "Critical",
    status: "In Progress",
    date: "Today, 08:30 AM",
  },
  {
    id: "AJ-004",
    title: "Traffic Accident",
    type: "Accident",
    location: "Thika Road",
    priority: "Medium",
    status: "Resolved",
    date: "Yesterday, 17:20 PM",
  },
  {
    id: "AJ-005",
    title: "Medical Emergency",
    type: "Medical",
    location: "Karen",
    priority: "High",
    status: "Reported",
    date: "Yesterday, 15:10 PM",
  },
];

function AdminIncidentsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const incidents = useSelector(
    (state) => state.admin.incidents
  );

  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    async function loadIncidents() {
      setLoading(true);
      setApiError(null);

      try {
        const response = await getAdminIncidents();

        const data =
          response.data.incidents ||
          response.data;

        dispatch(setIncidents(data));
      } catch (error) {
        console.error(
          "Failed to load admin incidents:",
          error
        );

        setApiError(
          "Unable to connect to the server. Showing temporary data."
        );

        dispatch(setIncidents(mockIncidents));
      } finally {
        setLoading(false);
      }
    }

    loadIncidents();
  }, [dispatch]);

  const filteredIncidents = incidents.filter((incident) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      String(incident.id)
        .toLowerCase()
        .includes(searchValue) ||
      String(incident.title || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(
        incident.location ||
          incident.location_address ||
          ""
      )
        .toLowerCase()
        .includes(searchValue);

    const matchesStatus =
      statusFilter === "All" ||
      incident.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function handleSelectIncident(id) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter(
          (selectedId) => selectedId !== id
        );
      }

      return [...current, id];
    });
  }

  function handleSelectAll() {
    const visibleIds = filteredIncidents.map(
      (incident) => incident.id
    );

    const allSelected = visibleIds.every((id) =>
      selectedIds.includes(id)
    );

    if (allSelected) {
      setSelectedIds((current) =>
        current.filter(
          (id) => !visibleIds.includes(id)
        )
      );
    } else {
      setSelectedIds((current) => [
        ...new Set([
          ...current,
          ...visibleIds,
        ]),
      ]);
    }
  }

  /*
   * BULK STATUS UPDATE
   */

  async function handleBulkUpdate() {
    if (!bulkStatus) {
      alert("Please select a status.");
      return;
    }

    if (selectedIds.length === 0) {
      alert("Please select at least one incident.");
      return;
    }

    const confirmed = window.confirm(
      `Update ${selectedIds.length} incident(s) to "${bulkStatus}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      
      await bulkUpdateIncidentStatus(
        selectedIds,
        bulkStatus
      );

      /*
       * Update Redux after successful API request
       */
      dispatch(
        updateReduxBulkStatus({
          ids: selectedIds,
          status: bulkStatus,
        })
      );

      setSelectedIds([]);
      setBulkStatus("");

      alert("Incident statuses updated successfully.");
    } catch (error) {
      console.error(
        "Bulk status update failed:",
        error
      );

      dispatch(
        updateReduxBulkStatus({
          ids: selectedIds,
          status: bulkStatus,
        })
      );

      setSelectedIds([]);
      setBulkStatus("");

      alert(
        "Backend unavailable. The UI was updated temporarily."
      );
    }
  }

  const visibleIds = filteredIncidents.map(
    (incident) => incident.id
  );

  const allVisibleSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id) =>
      selectedIds.includes(id)
    );

  return (
    <div className="admin-incidents">
      {/* Header */}

      <div className="incidents-header">
        <div>
          <h1>Incident Reports</h1>

          <p>
            Manage and monitor all emergency reports.
          </p>
        </div>

        <div className="incident-count">
          {filteredIncidents.length} reports
        </div>
      </div>

      {/* API error */}

      {apiError && (
        <div className="api-warning">
          {apiError}
        </div>
      )}

      {/* Search and filter */}

      <div className="incident-filters">
        <input
          type="text"
          placeholder="Search incident ID, title or location..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="All">All Statuses</option>

          <option value="Reported">
            Reported
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Resolved">
            Resolved
          </option>
        </select>
      </div>

      {/* Bulk actions */}

      {selectedIds.length > 0 && (
        <div className="bulk-action-bar">
          <div>
            <strong>
              {selectedIds.length} selected
            </strong>

            <button
              className="clear-selection"
              onClick={() => setSelectedIds([])}
            >
              Clear
            </button>
          </div>

          <div className="bulk-controls">
            <select
              value={bulkStatus}
              onChange={(event) =>
                setBulkStatus(event.target.value)
              }
            >
              <option value="">
                Change status to...
              </option>

              <option value="Reported">
                Reported
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Resolved">
                Resolved
              </option>
            </select>

            <button
              className="bulk-update-btn"
              onClick={handleBulkUpdate}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Loading */}

      {loading && (
        <div className="loading-message">
          Loading incidents...
        </div>
      )}

      {/* Table */}

      <div className="incidents-table-container">
        <table className="admin-incidents-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={handleSelectAll}
                />
              </th>

              <th>Incident</th>
              <th>Type</th>
              <th>Location</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredIncidents.map((incident) => (
              <tr key={incident.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(
                      incident.id
                    )}
                    onChange={() =>
                      handleSelectIncident(
                        incident.id
                      )
                    }
                  />
                </td>

                <td>
                  <div className="incident-name">
                    <strong>
                      {incident.title}
                    </strong>

                    <span>
                      {incident.id}
                    </span>
                  </div>
                </td>

                <td>
                  {incident.type}
                </td>

                <td>
                  {incident.location ||
                    incident.location_address ||
                    "Unknown"}
                </td>

                <td>
                  <span
                    className={`priority-badge ${String(
                      incident.priority || "Medium"
                    ).toLowerCase()}`}
                  >
                    {incident.priority ||
                      "Medium"}
                  </span>
                </td>

                <td>
                  <span
                    className={`incident-status ${String(
                      incident.status
                    )
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {incident.status}
                  </span>
                </td>

                <td>
                  {incident.date ||
                    incident.created_at ||
                    "—"}
                </td>

                <td>
                  <button
                    className="view-incident-btn"
                    onClick={() =>
                      navigate(
                        `/admin/incidents/${incident.id}`
                      )
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading &&
          filteredIncidents.length === 0 && (
            <div className="no-incidents">
              No incidents found.
            </div>
          )}
      </div>
    </div>
  );
}

export default AdminIncidentsPage;