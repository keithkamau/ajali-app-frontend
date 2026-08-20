import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CreateIcon,
  EmergencyIcon,
  ActivityIcon,
  BellIcon,
} from "../components/icons";

export const HomePage = () => {
  const { user } = useSelector((state) => state.auth);
  const { incidents } = useSelector(
    (state) => state.incidents || { incidents: [] },
  );

  // Mock stats
  const stats = {
    total: 128,
    inProgress: 34,
    resolved: 94,
    sosAlerts: 12,
  };

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      title: "Road accident reported",
      status: "pending",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Emergency response dispatched",
      status: "resolved",
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "Medical emergency reported",
      status: "under_investigation",
      time: "1 day ago",
    },
  ];

  return (
    <div className='home-page'>
      <div className='home-welcome'>
        <h1 className='heading-2'>
          Welcome back, {user?.full_name || "User"}!
        </h1>
        <p className='body-small text-muted'>
          What would you like to do today?
        </p>
      </div>

      {/* Quick Actions */}
      <div className='home-quick-actions'>
        <Link to='/incidents/create' className='quick-action-btn primary'>
          <span className='action-icon'>
            <CreateIcon color='#ffffff' size={28} />
          </span>
          <span>Report Incident</span>
        </Link>
        <Link to='/dashboard' className='quick-action-btn'>
          <span className='action-icon'>
            <ActivityIcon color='var(--color-ink)' size={28} />
          </span>
          <span>My Reports</span>
        </Link>
        <Link to='/activity' className='quick-action-btn'>
          <span className='action-icon'>
            <BellIcon color='var(--color-ink)' size={28} />
          </span>
          <span>Resolved</span>
        </Link>
        <button className='quick-action-btn danger'>
          <span className='action-icon'>
            <EmergencyIcon color='#ffffff' size={28} />
          </span>
          <span>Emergency</span>
        </button>
      </div>

      {/* Stats Section */}
      <div className='home-stats'>
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

      {/* Recent Activity */}
      <div className='home-recent'>
        <div className='card'>
          <h2 className='heading-4' style={{ marginBottom: "0.5rem" }}>
            Recent Activity
          </h2>
          <p
            className='body-small text-muted'
            style={{ marginBottom: "1.5rem" }}
          >
            Your recent incident reports
          </p>

          {recentActivity.length > 0 ? (
            <div className='activity-list'>
              {recentActivity.map((item) => (
                <div key={item.id} className='activity-item'>
                  <div className='activity-item-header'>
                    <span className='activity-item-title'>{item.title}</span>
                    <span
                      className={`status-badge status-badge-${item.status}`}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </div>
                  <span className='activity-item-date'>{item.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className='empty-state'>
              <p className='body-text text-muted'>
                No recent activity to display
              </p>
              <Link
                to='/incidents/create'
                className='btn btn-primary'
                style={{ marginTop: "1rem" }}
              >
                Create your first report
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
