import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CreateIcon, EmergencyIcon, ActivityIcon, BellIcon } from '../components/icons';

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const recentActivity = [
    { id: 1, title: 'Road accident reported', status: 'pending', time: '2 hours ago', description: 'Multi-vehicle collision on Mombasa Road' },
    { id: 2, title: 'Emergency response dispatched', status: 'resolved', time: '5 hours ago', description: 'Medical team dispatched to Nairobi CBD' },
    { id: 3, title: 'Medical emergency reported', status: 'under_investigation', time: '1 day ago', description: 'Emergency medical response at Westlands' },
  ];

  const stats = {
    total: 128,
    inProgress: 34,
    resolved: 94,
    sosAlerts: 12,
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-badge-pending';
      case 'under_investigation': return 'status-badge-under-investigation';
      case 'resolved': return 'status-badge-resolved';
      case 'rejected': return 'status-badge-rejected';
      default: return 'status-badge-pending';
    }
  };

  const handleActivityClick = (id) => {
    if (isAdmin) {
      navigate(`/admin/incidents/${id}`);
    } else {
      navigate(`/incidents/${id}`);
    }
  };

  const handleEmergencyClick = () => {
    // Navigate to create incident with emergency pre-selected
    navigate('/incidents/create?type=emergency');
  };

  return (
    <div className="home-page">
      <div className="home-welcome">
        <h1 className="heading-2">Welcome back, {user?.full_name || 'User'}!</h1>
        <p className="body-small text-muted">What would you like to do today?</p>
      </div>

      <div className="home-quick-actions">
        <Link to="/incidents/create" className="quick-action-btn primary">
          <span className="action-icon">
            <CreateIcon color="#ffffff" size={28} />
          </span>
          <span>Report Incident</span>
        </Link>
        <Link to="/dashboard" className="quick-action-btn">
          <span className="action-icon">
            <ActivityIcon color="var(--color-ink)" size={28} />
          </span>
          <span>My Reports</span>
        </Link>
        <Link to="/activity" className="quick-action-btn">
          <span className="action-icon">
            <BellIcon color="var(--color-ink)" size={28} />
          </span>
          <span>Resolved</span>
        </Link>
        <button className="quick-action-btn danger">
          <span className="action-icon">
            <EmergencyIcon color="#ffffff" size={28} />
          </span>
          <span>Emergency</span>
        </button>
      </div>

      <div className="home-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.sosAlerts}</div>
          <div className="stat-label">SOS Alerts</div>
        </div>
      </div>

      <div className="home-recent">
        <div className="card">
          <h2 className="heading-4" style={{ marginBottom: '0.5rem' }}>Recent Activity</h2>
          <p className="body-small text-muted" style={{ marginBottom: '1.5rem' }}>Your recent incident reports</p>
          
          {recentActivity.length > 0 ? (
            <div className="activity-list">
              {recentActivity.map((item) => (
                <div 
                  key={item.id} 
                  className="activity-item clickable"
                  onClick={() => handleActivityClick(item.id)}
                >
                  <div className="activity-item-header">
                    <span className="activity-item-title">{item.title}</span>
                    <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="activity-item-description">{item.description}</p>
                  <span className="activity-item-date">{item.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="body-text text-muted">No recent activity to display</p>
              <Link to="/incidents/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Create your first report
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button - Emergency */}
      <button 
        className="fab-emergency"
        onClick={handleEmergencyClick}
        aria-label="Emergency"
      >
        <EmergencyIcon color="#ffffff" size={32} />
      </button>
    </div>
  );
};

export default HomePage;
