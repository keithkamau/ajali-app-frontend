import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAdminStats,
  fetchRecentIncidents,
} from "../../redux/slices/adminSlice";

import "./AdminDashboard.css";

function AdminDashboard() {
  const dispatch = useDispatch();

  const {
    stats,
    recentIncidents,
    loading,
    error,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchRecentIncidents());
  }, [dispatch]);

  // Convert Django status values into readable text
  // Example: "under_review" -> "Under Review"
  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Format the incident time
  const formatTime = (date) => {
    if (!date) return "—";

    const incidentDate = new Date(date);

    if (Number.isNaN(incidentDate.getTime())) {
      return date;
    }

    return incidentDate.toLocaleString("en-KE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
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

      {/* LOADING / ERROR */}
      {loading && (
        <div className="dashboard-message">
          Loading dashboard data...
        </div>
      )}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* STATISTICS */}
      <div className="admin-stats-grid">

        {/* Total Incidents */}
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
            {stats?.total ?? 0}
          </div>

          <div className="stat-description">
            All reported incidents
          </div>
        </div>

        {/* Resolved */}
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
            {stats?.resolved ?? 0}
          </div>

          <div className="stat-description">
            Successfully resolved
          </div>
        </div>

        {/* In Progress */}
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
            {stats?.inProgress ?? stats?.in_progress ?? 0}
          </div>

          <div className="stat-description">
            Currently being handled
          </div>
        </div>

        {/* Critical */}
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
            {stats?.critical ?? 0}
          </div>

          <div className="stat-description">
            Require immediate attention
          </div>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="admin-dashboard-content">

        {/* RECENT INCIDENTS */}
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

            {recentIncidents && recentIncidents.length > 0 ? (
              recentIncidents.map((incident) => (
                <div
                  className="recent-incident"
                  key={incident.id}
                >

                  <div className="incident-main">

                    <div className="incident-title">
                      {incident.title || "Untitled Incident"}
                    </div>

                    <div className="incident-location">
                      {incident.location_address ||
                        "Unknown location"}
                    </div>

                  </div>

                  <div className="incident-meta">

                    {/* Priority */}
                    <span
                      className={`priority-badge ${String(
                        incident.priority || "Medium"
                      ).toLowerCase()}`}
                    >
                      {incident.priority || "Medium"}
                    </span>

                    {/* Status */}
                    <span
                      className={`incident-status ${String(
                        incident.status || ""
                      )
                        .toLowerCase()
                        .replace(/_/g, "-")}`}
                    >
                      {formatStatus(incident.status)}
                    </span>

                    {/* Time */}
                    <span className="incident-time">
                      {formatTime(
                        incident.created_at
                      )}
                    </span>

                  </div>

                </div>
              ))
            ) : (
              !loading && (
                <div className="no-recent-incidents">
                  No recent incidents found.
                </div>
              )
            )}

          </div>

        </div>

        {/* QUICK OVERVIEW */}
        <div className="dashboard-panel overview-panel">

          <div className="panel-header">
            <div>
              <h2>Incident Overview</h2>

              <p>
                Current incident distribution
              </p>
            </div>
          </div>

          {/* Resolved */}
          <div className="overview-item">
            <div className="overview-info">
              <span>Resolved</span>

              <strong>
                {stats?.resolved ?? 0}
              </strong>
            </div>

            <div className="overview-bar">
              <div
                className="overview-bar-fill resolved-bar"
                style={{
                  width: `${
                    stats?.total
                      ? ((stats.resolved ?? 0) /
                          stats.total) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* In Progress */}
          <div className="overview-item">
            <div className="overview-info">
              <span>In Progress</span>

              <strong>
                {stats?.inProgress ??
                  stats?.in_progress ??
                  0}
              </strong>
            </div>

            <div className="overview-bar">
              <div
                className="overview-bar-fill progress-bar"
                style={{
                  width: `${
                    stats?.total
                      ? ((stats?.inProgress ??
                          stats?.in_progress ??
                          0) /
                          stats.total) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Critical */}
          <div className="overview-item">
            <div className="overview-info">
              <span>Critical</span>

              <strong>
                {stats?.critical ?? 0}
              </strong>
            </div>

            <div className="overview-bar">
              <div
                className="overview-bar-fill critical-bar"
                style={{
                  width: `${
                    stats?.total
                      ? ((stats.critical ?? 0) /
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