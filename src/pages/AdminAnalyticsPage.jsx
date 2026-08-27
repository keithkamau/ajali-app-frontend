import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAdminStats,
  getRecentIncidents,
} from "../api/admin_api";

import {
  // setStats,
  // setIncidents,
} from "../redux/slices/adminSlice";
import "./AdminAnalyticsPage.css"

function AdminAnalyticsPage() {
  const dispatch = useDispatch();

  const stats = useSelector(
    (state) => state.admin.stats
  );

  const incidents = useSelector(
    (state) => state.admin.incidents
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError("");

      const [statsData, recentData] =
        await Promise.all([
          getAdminStats(),
          getRecentIncidents(),
        ]);

      dispatch(setStats(statsData));

      dispatch(
        setIncidents(
          recentData.results || recentData
        )
      );
    } catch (error) {
      console.error(
        "Failed to load analytics:",
        error
      );

      setError(
        error.response?.data?.detail ||
          "Failed to load analytics."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-analytics">
        <h1>Analytics</h1>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-analytics">
        <h1>Analytics</h1>
        <p>{error}</p>

        <button onClick={loadAnalytics}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-analytics">

      <div className="analytics-header">
        <h1>Analytics</h1>

        <p>
          Overview of incident activity and
          statistics.
        </p>
      </div>

      <div className="analytics-stats">

        <div className="stat-card">
          <h3>Total Incidents</h3>
          <strong>{stats.total}</strong>
        </div>

        <div className="stat-card">
          <h3>Resolved</h3>
          <strong>{stats.resolved}</strong>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <strong>{stats.inProgress}</strong>
        </div>

        <div className="stat-card">
          <h3>Critical</h3>
          <strong>{stats.critical}</strong>
        </div>

      </div>

      <div className="recent-incidents">

        <h2>Recent Incidents</h2>

        {incidents.length === 0 ? (
          <p>No recent incidents.</p>
        ) : (
          <div>
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="recent-incident"
              >
                <h3>{incident.title}</h3>

                <p>
                  {incident.location_address}
                </p>

                <span>
                  {incident.status}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

export default AdminAnalyticsPage;

// import AnalyticsChart from "../components/admin/AnalyticsChart";
// import "./AdminAnalyticsPage.css";
// import React from "react";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// // import { setStats } from "../redux/slices/adminSlice";
// import { getIncidentStats } from "../services/adminApi";

// function AdminAnalyticsPage() {
//   const [period, setPeriod] = useState("7");

  

//   const dispatch = useDispatch();

//   const reduxStats = useSelector(
//   (state) => state.admin.stats
// );

// const stats =
//   reduxStats.total > 0
//     ? reduxStats
//     : {
//         total: 248,
//         resolved: 174,
//         inProgress: 52,
//         critical: 22,
//       };

//   const trendData = [
//     { label: "Mon", value: 18 },
//     { label: "Tue", value: 26 },
//     { label: "Wed", value: 21 },
//     { label: "Thu", value: 34 },
//     { label: "Fri", value: 29 },
//     { label: "Sat", value: 41 },
//     { label: "Sun", value: 31 },
//   ];

//   const incidentTypes = [
//     { type: "Road Accident", value: 94 },
//     { type: "Medical Emergency", value: 61 },
//     { type: "Fire", value: 38 },
//     { type: "Crime", value: 29 },
//     { type: "Other", value: 26 },
//   ];

//   const statusData = [
//     { label: "Resolved", value: 174 },
//     { label: "In Progress", value: 52 },
//     { label: "Reported", value: 22 },
//   ];

//   useEffect(() => {
//   async function loadStats() {
//     try {
//       const response = await getIncidentStats();

//       dispatch(setStats(response.data));
//     } catch (error) {
//       console.error(
//         "Failed to load admin statistics:",
//         error
//       );
//     }
//   }

//   loadStats();
// }, [dispatch]);

//   return (
//     <div className="admin-analytics">
//       {/* Header */}
//       <div className="analytics-header">
//         <div>
//           <h1>Analytics</h1>
//           <p>
//             Monitor emergency reports and response activity.
//           </p>
//         </div>

//         <select
//           value={period}
//           onChange={(event) => setPeriod(event.target.value)}
//         >
//           <option value="7">Last 7 days</option>
//           <option value="30">Last 30 days</option>
//           <option value="90">Last 90 days</option>
//         </select>
//       </div>

//       {/* Statistics */}
//       <div className="analytics-stats">
//         <div className="analytics-stat-card">
//           <span>Total Incidents</span>
//           <strong>{stats.total}</strong>
//           <small>All reported incidents</small>
//         </div>

//         <div className="analytics-stat-card">
//           <span>Resolved</span>
//           <strong>{stats.resolved}</strong>
//           <small>
//             {Math.round((stats.resolved / stats.total) * 100)}%
//             resolution rate
//           </small>
//         </div>

//         <div className="analytics-stat-card">
//           <span>In Progress</span>
//           <strong>{stats.inProgress}</strong>
//           <small>Currently being handled</small>
//         </div>

//         <div className="analytics-stat-card critical">
//           <span>Critical</span>
//           <strong>{stats.critical}</strong>
//           <small>Require immediate attention</small>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="analytics-main-grid">
//         <AnalyticsChart
//           title="Incident Reports"
//           data={trendData}
//         />

//         <AnalyticsChart
//           title="Incidents by Status"
//           data={statusData}
//         />
//       </div>

//       {/* Incident types */}
//       <div className="incident-types-card">
//         <div className="analytics-section-header">
//           <div>
//             <h2>Incidents by Type</h2>
//             <p>
//               Distribution of emergency reports by category.
//             </p>
//           </div>
//         </div>

//         <div className="incident-type-list">
//           {incidentTypes.map((item) => {
//             const percentage = Math.round(
//               (item.value / stats.total) * 100
//             );

//             return (
//               <div
//                 className="incident-type-row"
//                 key={item.type}
//               >
//                 <div className="incident-type-info">
//                   <strong>{item.type}</strong>
//                   <span>
//                     {item.value} incidents ({percentage}%)
//                   </span>
//                 </div>

//                 <div className="progress-container">
//                   <div
//                     className="progress-bar"
//                     style={{
//                       width: `${percentage}%`,
//                     }}
//                   ></div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Summary */}
//       <div className="analytics-summary">
//         <div>
//           <h2>Response Summary</h2>
//           <p>
//             Overview of the current emergency response
//             performance.
//           </p>
//         </div>

//         <div className="summary-items">
//           <div>
//             <span>Resolution Rate</span>
//             <strong>
//               {Math.round(
//                 (stats.resolved / stats.total) * 100
//               )}
//               %
//             </strong>
//           </div>

//           <div>
//             <span>Active Incidents</span>
//             <strong>
//               {stats.inProgress + stats.critical}
//             </strong>
//           </div>

//           <div>
//             <span>Most Common</span>
//             <strong>Road Accident</strong>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminAnalyticsPage;