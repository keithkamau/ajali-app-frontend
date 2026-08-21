import React from "react";

// Mock admin data
const mockIncidents = [
  {
    id: "A/J-2024-001234",
    title: "Road accident on Mombasa Road",
    status: "pending",
    user: "John Doe",
    created_at: "2024-01-15T10:30:00",
  },
  {
    id: "A/J-2024-001233",
    title: "Emergency medical response",
    status: "resolved",
    user: "Jane Smith",
    created_at: "2024-01-14T14:20:00",
  },
  {
    id: "A/J-2024-001231",
    title: "Fire incident reported",
    status: "under_investigation",
    user: "Bob Johnson",
    created_at: "2024-01-13T09:15:00",
  },
  {
    id: "A/J-2024-001232",
    title: "Accident on Thika Road",
    status: "pending",
    user: "Alice Brown",
    created_at: "2024-01-12T16:45:00",
  },
  {
    id: "A/J-2024-001230",
    title: "Medical emergency",
    status: "resolved",
    user: "Charlie Wilson",
    created_at: "2024-01-11T11:00:00",
  },
];

export const AdminPage = () => {
  return (
    <div className='admin-page'>
      <div className='page-header'>
        <h1 className='heading-2'>Admin Dashboard</h1>
        <p className='body-small text-muted'>Manage incidents and users</p>
      </div>

      <div className='admin-stats'>
        <div className='stat-card'>
          <div className='stat-number'>128</div>
          <div className='stat-label'>Total Reports</div>
        </div>
        <div className='stat-card'>
          <div className='stat-number'>34</div>
          <div className='stat-label'>In Progress</div>
        </div>
        <div className='stat-card'>
          <div className='stat-number'>94</div>
          <div className='stat-label'>Resolved</div>
        </div>
        <div className='stat-card'>
          <div className='stat-number'>12</div>
          <div className='stat-label'>SOS Alerts</div>
        </div>
      </div>

      <div className='admin-table-wrapper'>
        <div className='card'>
          <h3 className='heading-4' style={{ marginBottom: "1rem" }}>
            All Incidents
          </h3>
          <div className='admin-table'>
            <div className='admin-table-header'>
              <span>Reference</span>
              <span>Title</span>
              <span>User</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {mockIncidents.map((incident) => (
              <div key={incident.id} className='admin-table-row'>
                <span className='admin-table-reference'>{incident.id}</span>
                <span>{incident.title}</span>
                <span>{incident.user}</span>
                <span
                  className={`status-badge status-badge-${incident.status}`}
                >
                  {incident.status.replace("_", " ")}
                </span>
                <span>
                  {new Date(incident.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
