import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setStats,
  setIncidents,
} from "../../redux//slices/adminSlice";

import "./AdminDashboard.css";

const mockStats = {
  total: 248,
  resolved: 174,
  inProgress: 52,
  critical: 22,
};

const mockRecentIncidents = [
  {
    id: "AJ-001",
    title: "Road Accident",
    location: "Ngong Road",
    status: "Reported",
    priority: "Critical",
    time: "10:24 AM",
  },
  {
    id: "AJ-002",
    title: "Medical Emergency",
    location: "Kilimani",
    status: "In Progress",
    priority: "High",
    time: "09:45 AM",
  },
  {
    id: "AJ-003",
    title: "Building Fire",
    location: "Westlands",
    status: "In Progress",
    priority: "Critical",
    time: "08:30 AM",
  },
  {
    id: "AJ-004",
    title: "Traffic Accident",
    location: "Thika Road",
    status: "Resolved",
    priority: "Medium",
    time: "Yesterday",
  },
];

function AdminDashboard() {
  const dispatch = useDispatch();

  const stats = useSelector(
    (state) => state.admin.stats
  );

  const incidents = useSelector(
    (state) => state.admin.incidents
  );

  useEffect(() => {
    dispatch(setStats(mockStats));

    dispatch(setIncidents(mockRecentIncidents));
  }, [dispatch]);

  const recentIncidents =
    incidents.length > 0
      ? incidents.slice(0, 4)
      : mockRecentIncidents;

  return (
    <div className="admin-dashboard">

      {/*
          HEADER
     */}

      <div className="admin-dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Monitor and manage emergency incidents
            across Ajali!
          </p>
        </div>

        <div className="dashboard-date">
          <span>Today</span>
        </div>
      </div>

      {/*
          STATISTICS
     */}

      <div className="admin-stats-grid">

        <div className="admin-stat-card">
          <div className="stat-card-top">
            <span className="stat-label">
              Total Incidents
            </span>

            <div className="stat-icon total">
              #
            </div>
          </div>

          <div className="stat-value">
            {stats.total}
          </div>

          <div className="stat-description">
            All reported incidents
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-top">
            <span className="stat-label">
              Resolved
            </span>

            <div className="stat-icon resolved">
              ✓
            </div>
          </div>

          <div className="stat-value">
            {stats.resolved}
          </div>

          <div className="stat-description">
            Successfully resolved
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-top">
            <span className="stat-label">
              In Progress
            </span>

            <div className="stat-icon progress">
              ↻
            </div>
          </div>

          <div className="stat-value">
            {stats.inProgress}
          </div>

          <div className="stat-description">
            Currently being handled
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-top">
            <span className="stat-label">
              Critical
            </span>

            <div className="stat-icon critical">
              !
            </div>
          </div>

          <div className="stat-value">
            {stats.critical}
          </div>

          <div className="stat-description">
            Require immediate attention
          </div>
        </div>

      </div>

      {/*
          MAIN CONTENT
     */}

      <div className="admin-dashboard-content">

        {/* Recent Incidents */}

        <div className="dashboard-panel recent-panel">

          <div className="panel-header">
            <div>
              <h2>Recent Incidents</h2>

              <p>
                Latest emergency reports
              </p>
            </div>

            <a href="/admin/incidents">
              View All
            </a>
          </div>

          <div className="recent-incidents">

            {recentIncidents.map((incident) => (
              <div
                className="recent-incident"
                key={incident.id}
              >

                <div className="incident-main">

                  <div className="incident-title">
                    {incident.title}
                  </div>

                  <div className="incident-location">
                    {incident.location ||
                      incident.location_address ||
                      "Unknown location"}
                  </div>

                </div>

                <div className="incident-meta">

                  <span
                    className={`priority-badge ${String(
                      incident.priority ||
                        "Medium"
                    ).toLowerCase()}`}
                  >
                    {incident.priority ||
                      "Medium"}
                  </span>

                  <span
                    className={`incident-status ${String(
                      incident.status
                    )
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {incident.status}
                  </span>

                  <span className="incident-time">
                    {incident.time ||
                      incident.created_at ||
                      "—"}
                  </span>

                </div>

              </div>
            ))}

          </div>

        </div>

        {/* Quick Overview */}

        <div className="dashboard-panel overview-panel">

          <div className="panel-header">
            <div>
              <h2>Incident Overview</h2>

              <p>
                Current incident distribution
              </p>
            </div>
          </div>

          <div className="overview-item">

            <div className="overview-info">
              <span>Resolved</span>
              <strong>{stats.resolved}</strong>
            </div>

            <div className="overview-bar">
              <div
                className="overview-bar-fill resolved-bar"
                style={{
                  width: `${
                    stats.total
                      ? (stats.resolved /
                          stats.total) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>

          </div>

          <div className="overview-item">

            <div className="overview-info">
              <span>In Progress</span>
              <strong>{stats.inProgress}</strong>
            </div>

            <div className="overview-bar">
              <div
                className="overview-bar-fill progress-bar"
                style={{
                  width: `${
                    stats.total
                      ? (stats.inProgress /
                          stats.total) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>

          </div>

          <div className="overview-item">

            <div className="overview-info">
              <span>Critical</span>
              <strong>{stats.critical}</strong>
            </div>

            <div className="overview-bar">
              <div
                className="overview-bar-fill critical-bar"
                style={{
                  width: `${
                    stats.total
                      ? (stats.critical /
                          stats.total) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;