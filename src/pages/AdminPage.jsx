import React from "react";
import { useNavigate } from "react-router-dom";

export const AdminPage = () => {
  const navigate = useNavigate();

  const stats = {
    total: 128,
    inProgress: 34,
    resolved: 94,
    sosAlerts: 12,
  };

  const recentIncidents = [
    {
      id: "AJ-2026-001234",
      title: "Road Accident on Ngong Road",
      status: "In Progress",
      priority: "Critical",
      reportedAt: "Today, 10:24 AM",
      user: "John Doe",
    },
    {
      id: "AJ-2026-001233",
      title: "Building Fire at Waiyaki Way",
      status: "Resolved",
      priority: "High",
      reportedAt: "12 May 2024",
      user: "Jane Smith",
    },
    {
      id: "AJ-2026-001232",
      title: "Medical Emergency in Westlands",
      status: "In Progress",
      priority: "Critical",
      reportedAt: "11 May 2024",
      user: "Bob Johnson",
    },
    {
      id: "AJ-2025-001231",
      title: "Road Accident on Mombasa Road",
      status: "Reported",
      priority: "High",
      reportedAt: "10 May 2025",
      user: "Alice Brown",
    },
    {
      id: "AJ-2025-001230",
      title: "Flooding in Kasarani",
      status: "Resolved",
      priority: "Medium",
      reportedAt: "09 May 2024",
      user: "Charlie Wilson",
    },
  ];

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

  const handleRowClick = (id) => {
    navigate(`/admin/incidents/${id}`);
  };

  return (
    <div className='admin-page'>
      <div className='page-header'>
        <h1 className='heading-2'>Admin Dashboard</h1>
        <p className='body-small text-muted'>
          Overview of all incidents and system activity
        </p>
      </div>

      <div className='admin-stats'>
        <div className='stat-card'>
          <div className='stat-number'>{stats.total}</div>
          <div className='stat-label'>Total Reports</div>
        </div>
        <div className='stat-card'>
          <div className='stat-number'>{stats.inProgress}</div>
          <div className='stat-label'>In Progress</div>
        </div>
        <div className='stat-card'>
          <div className='stat-number'>{stats.resolved}</div>
          <div className='stat-label'>Resolved</div>
        </div>
        <div className='stat-card'>
          <div className='stat-number'>{stats.sosAlerts}</div>
          <div className='stat-label'>SOS Alerts</div>
        </div>
      </div>

      <div className='admin-recent-section'>
        <div className='card'>
          <div className='admin-section-header'>
            <h2 className='heading-4'>Recent Incidents</h2>
            <button
              className='btn btn-sm btn-secondary'
              onClick={() => navigate("/admin/incidents")}
            >
              View All
            </button>
          </div>

          <div className='admin-table-wrapper'>
            <table className='admin-table'>
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Incident</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Reported</th>
                </tr>
              </thead>
              <tbody>
                {recentIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    className='clickable-row'
                    onClick={() => handleRowClick(incident.id)}
                  >
                    <td className='admin-table-reference'>{incident.id}</td>
                    <td>
                      <strong>{incident.title}</strong>
                    </td>
                    <td>{incident.user}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusBadgeClass(incident.status)}`}
                      >
                        {incident.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`priority-badge ${getPriorityClass(incident.priority)}`}
                      >
                        {incident.priority}
                      </span>
                    </td>
                    <td>{incident.reportedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
