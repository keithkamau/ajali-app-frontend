import { useState } from "react";
import AnalyticsChart from "../components/admin/AnalyticsChart";
import "./AdminAnalyticsPage.css";
import React from "react";
function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("7");

  // This will eventually come from:
  // GET /api/admin/incidents/stats
  const stats = {
    total: 248,
    resolved: 174,
    inProgress: 52,
    critical: 22,
  };

  const trendData = [
    { label: "Mon", value: 18 },
    { label: "Tue", value: 26 },
    { label: "Wed", value: 21 },
    { label: "Thu", value: 34 },
    { label: "Fri", value: 29 },
    { label: "Sat", value: 41 },
    { label: "Sun", value: 31 },
  ];

  const incidentTypes = [
    { type: "Road Accident", value: 94 },
    { type: "Medical Emergency", value: 61 },
    { type: "Fire", value: 38 },
    { type: "Crime", value: 29 },
    { type: "Other", value: 26 },
  ];

  const statusData = [
    { label: "Resolved", value: 174 },
    { label: "In Progress", value: 52 },
    { label: "Reported", value: 22 },
  ];

  return (
    <div className="admin-analytics">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p>
            Monitor emergency reports and response activity.
          </p>
        </div>

        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Statistics */}
      <div className="analytics-stats">
        <div className="analytics-stat-card">
          <span>Total Incidents</span>
          <strong>{stats.total}</strong>
          <small>All reported incidents</small>
        </div>

        <div className="analytics-stat-card">
          <span>Resolved</span>
          <strong>{stats.resolved}</strong>
          <small>
            {Math.round((stats.resolved / stats.total) * 100)}%
            resolution rate
          </small>
        </div>

        <div className="analytics-stat-card">
          <span>In Progress</span>
          <strong>{stats.inProgress}</strong>
          <small>Currently being handled</small>
        </div>

        <div className="analytics-stat-card critical">
          <span>Critical</span>
          <strong>{stats.critical}</strong>
          <small>Require immediate attention</small>
        </div>
      </div>

      {/* Charts */}
      <div className="analytics-main-grid">
        <AnalyticsChart
          title="Incident Reports"
          data={trendData}
        />

        <AnalyticsChart
          title="Incidents by Status"
          data={statusData}
        />
      </div>

      {/* Incident types */}
      <div className="incident-types-card">
        <div className="analytics-section-header">
          <div>
            <h2>Incidents by Type</h2>
            <p>
              Distribution of emergency reports by category.
            </p>
          </div>
        </div>

        <div className="incident-type-list">
          {incidentTypes.map((item) => {
            const percentage = Math.round(
              (item.value / stats.total) * 100
            );

            return (
              <div
                className="incident-type-row"
                key={item.type}
              >
                <div className="incident-type-info">
                  <strong>{item.type}</strong>
                  <span>
                    {item.value} incidents ({percentage}%)
                  </span>
                </div>

                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${percentage}%`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="analytics-summary">
        <div>
          <h2>Response Summary</h2>
          <p>
            Overview of the current emergency response
            performance.
          </p>
        </div>

        <div className="summary-items">
          <div>
            <span>Resolution Rate</span>
            <strong>
              {Math.round(
                (stats.resolved / stats.total) * 100
              )}
              %
            </strong>
          </div>

          <div>
            <span>Active Incidents</span>
            <strong>
              {stats.inProgress + stats.critical}
            </strong>
          </div>

          <div>
            <span>Most Common</span>
            <strong>Road Accident</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalyticsPage;