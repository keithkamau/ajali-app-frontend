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

    const matchesType =
      typeFilter === "All" || incident.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'Reported': 'status-badge-pending',
      'In Progress': 'status-badge-under-investigation',
      'Resolved': 'status-badge-resolved',
      'Rejected': 'status-badge-rejected',
    };
    return statusMap[status] || 'status-badge-pending';
  };

  const getPriorityClass = (priority) => {
    const priorityMap = {
      'Critical': 'priority-critical',
      'High': 'priority-high',
      'Medium': 'priority-medium',
      'Low': 'priority-low',
    };
    return priorityMap[priority] || 'priority-medium';
  };

  const handleRowClick = (incidentId) => {
    navigate(`/admin/incidents/${incidentId}`);
  };

  return (
    <div className="admin-incidents-page">
      <div className="page-header">
        <h1 className="heading-2">Incident Reports</h1>
        <p className="body-small text-muted">View and manage all emergency reports.</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <input
            type="text"
            className="input"
            placeholder="Search reports..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="admin-toolbar-right">
          <select
            className="input"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            style={{ maxWidth: '150px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            className="input"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            style={{ maxWidth: '150px' }}
          >
            <option value="All">All Types</option>
            <option value="Accident">Accident</option>
            <option value="Fire">Fire</option>
            <option value="Medical">Medical</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <div className="card" style={{ overflow: 'auto' }}>
          {filteredIncidents.length === 0 ? (
            <div className="empty-state">
              <p className="body-text text-muted">No incidents found.</p>
            </div>
          ) : (
            <table className="admin-table">
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
                  <tr 
                    key={incident.id} 
                    className="clickable-row"
                    onClick={() => handleRowClick(incident.id)}
                  >
                    <td className="admin-table-reference">{incident.id}</td>
                    <td><strong>{incident.title}</strong></td>
                    <td>{incident.location}</td>
                    <td>{incident.type}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(incident.status)}`}>
                        {incident.status}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-badge ${getPriorityClass(incident.priority)}`}>
                        {incident.priority}
                      </span>
                    </td>
                    <td>{incident.reportedAt}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/incidents/${incident.id}`);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminIncidentsPage;