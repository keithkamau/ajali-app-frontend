import React from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const stats = [
    {
      title: "Total Reports",
      value: 128,
      icon: "▣",
    },
    {
      title: "In Progress",
      value: 34,
      icon: "◷",
    },
    {
      title: "Resolved",
      value: 94,
      icon: "✓",
    },
    {
      title: "SOS Alerts",
      value: 12,
      icon: "!",
    },
  ];

  const recentReports = [
    {
      id: "AJ-2025-001234",
      location: "Ngong Road",
      status: "In Progress",
      reportedAt: "Today, 10:24 AM",
    },
    {
      id: "AJ-2025-001233",
      location: "Waiyaki Way",
      status: "Resolved",
      reportedAt: "12 May 2025",
    },
    {
      id: "AJ-2026-001232",
      location: "Thika Road",
      status: "Resolved",
      reportedAt: "03 May 2026",
    },
    {
      id: "AJ-2026-001231",
      location: "Mombasa Road",
      status: "In Progress",
      reportedAt: "02 May 2026",
    },
  ];

  return (
      
        <div className="admin-content">
          {/* Statistics */}
          <section className="admin-stats">
            {stats.map((stat) => (
              <div className="admin-stat-card" key={stat.title}>
                <div className="stat-icon">{stat.icon}</div>

                <div>
                  <p>{stat.title}</p>
                  <h2>{stat.value}</h2>
                </div>
              </div>
            ))}
          </section>

          {/* Main Dashboard Grid */}
          <section className="dashboard-grid">
            {/* Recent Reports */}
            <div className="dashboard-panel reports-panel">
              <div className="panel-header">
                <div>
                  <h2>Recent Reports</h2>
                  <p>Latest emergency reports submitted</p>
                </div>

                <button className="view-all-btn">View All</button>
              </div>

              <div className="table-wrapper">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Report ID</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Reported At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentReports.map((report) => (
                      <tr key={report.id}>
                        <td>{report.id}</td>
                        <td>{report.location}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              report.status === "Resolved"
                                ? "resolved"
                                : "progress"
                            }`}
                          >
                            {report.status}
                          </span>
                        </td>
                        <td>{report.reportedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status Chart */}
            <div className="dashboard-panel chart-panel">
              <div className="panel-header">
                <div>
                  <h2>Reports by Status</h2>
                  <p>Current report distribution</p>
                </div>
              </div>

              <div className="donut-container">
                <div className="donut-chart">
                  <div className="donut-center">
                    <strong>128</strong>
                    <span>Total</span>
                  </div>
                </div>
              </div>

              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-dot progress-dot"></span>
                  <span>In Progress</span>
                  <strong>34</strong>
                </div>

                <div className="legend-item">
                  <span className="legend-dot resolved-dot"></span>
                  <span>Resolved</span>
                  <strong>94</strong>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Overview */}
          <section className="dashboard-panel overview-panel">
            <div className="panel-header">
              <div>
                <h2>Emergency Overview</h2>
                <p>Quick summary of today's activity</p>
              </div>
            </div>

            <div className="overview-items">
              <div className="overview-item">
                <span className="overview-icon accident">!</span>
                <div>
                  <strong>Road Accidents</strong>
                  <span>42 reports</span>
                </div>
              </div>

              <div className="overview-item">
                <span className="overview-icon medical">+</span>
                <div>
                  <strong>Medical Emergencies</strong>
                  <span>27 reports</span>
                </div>
              </div>

              <div className="overview-item">
                <span className="overview-icon fire">♨</span>
                <div>
                  <strong>Fire Incidents</strong>
                  <span>18 reports</span>
                </div>
              </div>

              <div className="overview-item">
                <span className="overview-icon other">◉</span>
                <div>
                  <strong>Other Emergencies</strong>
                  <span>41 reports</span>
                </div>
              </div>
            </div>
          </section>
        </div>
  );
}

export default AdminDashboard;