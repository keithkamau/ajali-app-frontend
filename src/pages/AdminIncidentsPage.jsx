import { useState } from "react";
import "./AdminIncidentsPage.css";
import React from "react";
function AdminIncidentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const incidents = [
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
  ];

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.id.toLowerCase().includes(search.toLowerCase()) ||
      incident.title.toLowerCase().includes(search.toLowerCase()) ||
      incident.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || incident.status === statusFilter;

    const matchesType =
      typeFilter === "All" || incident.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="admin-incidents-page">
      <div className="admin-incidents-header">
        <div>
          <h1>Incident Reports</h1>
          <p>View and manage all emergency reports.</p>
        </div>
      </div>

      <div className="incident-filters">
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Reported">Reported</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Accident">Accident</option>
          <option value="Fire">Fire</option>
          <option value="Medical">Medical</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="admin-incidents-table-container">
        <table className="admin-incidents-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Incident</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Reported</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredIncidents.map((incident) => (
              <tr key={incident.id}>
                <td>{incident.id}</td>

                <td>
                  <strong>{incident.title}</strong>
                </td>

                <td>{incident.location}</td>

                <td>{incident.type}</td>

                <td>
                  <span
                    className={`admin-status ${incident.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {incident.status}
                  </span>
                </td>

                <td>
                  <span
                    className={`admin-priority ${incident.priority.toLowerCase()}`}
                  >
                    {incident.priority}
                  </span>
                </td>

                <td>{incident.reportedAt}</td>

                <td>
                  <button className="view-incident-btn">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredIncidents.length === 0 && (
          <div className="no-incidents">
            <p>No incidents found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminIncidentsPage;