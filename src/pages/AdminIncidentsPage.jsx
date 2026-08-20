// src/pages/AdminIncidentsPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminIncidentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const navigate = useNavigate();

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

    const matchesType = typeFilter === "All" || incident.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      Reported: "status-badge-pending",
      "In Progress": "status-badge-under-investigation",
      Resolved: "status-badge-resolved",
      Rejected: "status-badge-rejected",
    };
    return statusMap[status] || "status-badge-pending";
  };

  const getPriorityClass = (priority) => {
    const priorityMap = {
      Critical: "priority-critical",
      High: "priority-high",
      Medium: "priority-medium",
      Low: "priority-low",
    };
    return priorityMap[priority] || "priority-medium";
  };

  return (
    <div className='admin-incidents-page'>
      <div className='page-header'>
        <h1 className='heading-2'>Incident Reports</h1>
        <p className='body-small text-muted'>
          View and manage all emergency reports.
        </p>
      </div>

      <div className='admin-toolbar'>
        <div className='admin-toolbar-left'>
          <input
            type='text'
            className='input'
            placeholder='Search reports...'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className='admin-toolbar-right'>
          <select
            className='input'
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            style={{ maxWidth: "150px" }}
          >
            <option value='All'>All Statuses</option>
            <option value='Reported'>Reported</option>
            <option value='In Progress'>In Progress</option>
            <option value='Resolved'>Resolved</option>
          </select>

          <select
            className='input'
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            style={{ maxWidth: "150px" }}
          >
            <option value='All'>All Types</option>
            <option value='Accident'>Accident</option>
            <option value='Fire'>Fire</option>
            <option value='Medical'>Medical</option>
            <option value='Other'>Other</option>
          </select>
        </div>
      </div>

      <div className='admin-table-wrapper'>
        <div className='card'>
          {filteredIncidents.length === 0 ? (
            <div className='empty-state'>
              <p className='body-text text-muted'>No incidents found.</p>
            </div>
          ) : (
            <div className='admin-table'>
              <div className='admin-table-header'>
                <span>Report ID</span>
                <span>Incident</span>
                <span>Location</span>
                <span>Type</span>
                <span>Status</span>
                <span>Priority</span>
                <span>Reported</span>
                <span>Action</span>
              </div>

              {filteredIncidents.map((incident) => (
                <div key={incident.id} className='admin-table-row'>
                  <span
                    className='admin-table-reference'
                    data-label='Report ID'
                  >
                    {incident.id}
                  </span>
                  <span data-label='Incident'>
                    <strong>{incident.title}</strong>
                  </span>
                  <span data-label='Location'>{incident.location}</span>
                  <span data-label='Type'>{incident.type}</span>
                  <span data-label='Status'>
                    <span
                      className={`status-badge ${getStatusBadgeClass(incident.status)}`}
                    >
                      {incident.status}
                    </span>
                  </span>
                  <span data-label='Priority'>
                    <span
                      className={`priority-badge ${getPriorityClass(incident.priority)}`}
                    >
                      {incident.priority}
                    </span>
                  </span>
                  <span data-label='Reported'>{incident.reportedAt}</span>
                  <span data-label='Action'>
                    <button
                      className='btn btn-sm btn-secondary'
                      onClick={() =>
                        navigate(`/admin/incidents/${incident.id}`)
                      }
                    >
                      View
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminIncidentsPage;
