function AdminDashboard() {
  const stats = {
    total: 124,
    critical: 32,
    pending: 18,
    resolved: 74,
  };

  const recentIncidents = [
    {
      id: 1,
      title: "Road Accident",
      location: "Thika Road",
      status: "Reported",
      priority: "Critical",
    },
    {
      id: 2,
      title: "Fire",
      location: "Kasarani",
      status: "Responding",
      priority: "High",
    },
    {
      id: 3,
      title: "Medical Emergency",
      location: "Westlands",
      status: "Resolved",
      priority: "Medium",
    },
  ];

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div>
        <div>
          <h3>Total Incidents</h3>
          <p>{stats.total}</p>
        </div>

        <div>
          <h3>Critical</h3>
          <p>{stats.critical}</p>
        </div>

        <div>
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </div>

        <div>
          <h3>Resolved</h3>
          <p>{stats.resolved}</p>
        </div>
      </div>

      <h2>Recent Incidents</h2>

      <div>
        {recentIncidents.map((incident) => (
          <div key={incident.id}>
            <h3>{incident.title}</h3>
            <p>Location: {incident.location}</p>
            <p>Status: {incident.status}</p>
            <p>Priority: {incident.priority}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;