import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllIncidents } from "../../redux/slices/adminSlice";
import "./AdminPages.css";

export const AdminStats = () => {
  const dispatch = useDispatch();
  const { incidents, isLoading, error, stats } = useSelector(
    (state) => state.admin,
  );

  useEffect(() => {
    dispatch(fetchAllIncidents());
  }, [dispatch]);

  const statsData = stats || {
    total: incidents?.length || 0,
    pending: incidents?.filter((i) => i.status === "pending").length || 0,
    under_investigation:
      incidents?.filter((i) => i.status === "under_investigation").length || 0,
    resolved: incidents?.filter((i) => i.status === "resolved").length || 0,
    rejected: incidents?.filter((i) => i.status === "rejected").length || 0,
  };

  if (isLoading) {
    return (
      <div className='admin-loading'>
        <div className='spinner'></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className='admin-page'>
      <div className='admin-header'>
        <h1 className='page-title'>Statistics</h1>
        <p className='page-subtitle'>Overview of all incident reports</p>
      </div>

      {error && (
        <div className='alert alert-error'>
          {typeof error === "string"
            ? error
            : error?.message || "An error occurred"}
        </div>
      )}

      <div className='admin-stats-grid'>
        <div className='stat-card'>
          <span className='stat-value'>{statsData.total}</span>
          <span className='stat-label'>Total Incidents</span>
        </div>
        <div className='stat-card stat-pending'>
          <span className='stat-value'>{statsData.pending}</span>
          <span className='stat-label'>Pending</span>
        </div>
        <div className='stat-card stat-investigating'>
          <span className='stat-value'>{statsData.under_investigation}</span>
          <span className='stat-label'>Under Investigation</span>
        </div>
        <div className='stat-card stat-resolved'>
          <span className='stat-value'>{statsData.resolved}</span>
          <span className='stat-label'>Resolved</span>
        </div>
        <div className='stat-card stat-rejected'>
          <span className='stat-value'>{statsData.rejected}</span>
          <span className='stat-label'>Rejected</span>
        </div>
      </div>

      <div className='admin-stats-chart'>
        <h3>Status Distribution</h3>
        <div className='stats-bars'>
          <div className='stats-bar-item'>
            <span className='stats-bar-label'>Pending</span>
            <div className='stats-bar-track'>
              <div
                className='stats-bar-fill pending-fill'
                style={{
                  width: statsData.total
                    ? `${(statsData.pending / statsData.total) * 100}%`
                    : "0%",
                }}
              />
            </div>
            <span className='stats-bar-value'>{statsData.pending}</span>
          </div>
          <div className='stats-bar-item'>
            <span className='stats-bar-label'>Under Investigation</span>
            <div className='stats-bar-track'>
              <div
                className='stats-bar-fill investigating-fill'
                style={{
                  width: statsData.total
                    ? `${(statsData.under_investigation / statsData.total) * 100}%`
                    : "0%",
                }}
              />
            </div>
            <span className='stats-bar-value'>
              {statsData.under_investigation}
            </span>
          </div>
          <div className='stats-bar-item'>
            <span className='stats-bar-label'>Resolved</span>
            <div className='stats-bar-track'>
              <div
                className='stats-bar-fill resolved-fill'
                style={{
                  width: statsData.total
                    ? `${(statsData.resolved / statsData.total) * 100}%`
                    : "0%",
                }}
              />
            </div>
            <span className='stats-bar-value'>{statsData.resolved}</span>
          </div>
          <div className='stats-bar-item'>
            <span className='stats-bar-label'>Rejected</span>
            <div className='stats-bar-track'>
              <div
                className='stats-bar-fill rejected-fill'
                style={{
                  width: statsData.total
                    ? `${(statsData.rejected / statsData.total) * 100}%`
                    : "0%",
                }}
              />
            </div>
            <span className='stats-bar-value'>{statsData.rejected}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
