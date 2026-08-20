import { useState } from "react";
import "./AdminIncidentsPage.css";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useDispatch } from "react-redux";
import {
  bulkUpdateIncidentStatus,
} from "../redux/slices/adminSlice";

function AdminIncidentsPage() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  dispatch(
  bulkUpdateIncidentStatus({
    ids: selectedIds,
    status: bulkStatus,
  })
  );
  const [incidents, setIncidents] = useState([
    {
      id: "AJ-2026-001234",
      title: "Road Accident",
      type: "Accident",
      location: "Ngong Road",
      status: "In Progress",
      priority: "Critical",
      reportedAt: "Today, 10:24 AM",
    },
    {
      id: "AJ-2026-001233",
      title: "Building Fire",
      type: "Fire",
      location: "Waiyaki Way",
      status: "Resolved",
      priority: "High",
      reportedAt: "12 May 2024",
    },
    {
      id: "AJ-2026-001232",
      title: "Medical Emergency",
      type: "Medical",
      location: "Westlands",
      status: "In Progress",
      priority: "Critical",
      reportedAt: "11 May 2024",
    },
    {
      id: "AJ-2025-001231",
      title: "Road Accident",
      type: "Accident",
      location: "Mombasa Road",
      status: "Reported",
      priority: "High",
      reportedAt: "10 May 2025",
    },
    {
      id: "AJ-2025-001230",
      title: "Flooding",
      type: "Other",
      location: "Kasarani",
      status: "Resolved",
      priority: "Medium",
      reportedAt: "09 May 2024",
    },
  ]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredIncidents = incidents.filter((incident) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      incident.id.toLowerCase().includes(searchValue) ||
      incident.title.toLowerCase().includes(searchValue) ||
      incident.location.toLowerCase().includes(searchValue);

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
        ...new Set([...current, ...visibleIds]),
      ]);
    }
  }

  function handleBulkUpdate() {
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

    setIncidents((currentIncidents) =>
      currentIncidents.map((incident) =>
        selectedIds.includes(incident.id)
          ? {
              ...incident,
              status: bulkStatus,
            }
          : incident
      )
    );

    setSelectedIds([]);
    setBulkStatus("");
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
          <option value="Reported">Reported</option>
          <option value="In Progress">
            In Progress
          </option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Bulk action bar */}

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

                    <span>{incident.id}</span>
                  </div>
                </td>

                <td>{incident.type}</td>

                <td>{incident.location}</td>

                <td>
                  <span
                    className={`priority-badge ${incident.priority.toLowerCase()}`}
                  >
                    {incident.priority}
                  </span>
                </td>

                <td>
                  <span
                    className={`incident-status ${incident.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {incident.status}
                  </span>
                </td>

                <td>{incident.date}</td>

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

        {filteredIncidents.length === 0 && (
          <div className="no-incidents">
            No incidents found.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminIncidentsPage;