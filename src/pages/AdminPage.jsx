// src/pages/AdminPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { mockIncidents, mockStats } from "../utils/mockData";
import { formatDateTime } from "../utils/formatters";
import { ArrowIcon, CloseIcon } from "../components/icons";

export const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(mockStats);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusComment, setStatusComment] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/home");
    }
  }, [user, navigate]);

  useEffect(() => {
    setIncidents(mockIncidents);
  }, []);

  // Get status badge class
  const getStatusClass = (status) => {
    const statusMap = {
      pending: "status-badge-pending",
      under_investigation: "status-badge-under-investigation",
      resolved: "status-badge-resolved",
      rejected: "status-badge-rejected",
    };
    return statusMap[status] || "status-badge-pending";
  };

  // Get status display label
  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "Pending",
      under_investigation: "Under Investigation",
      resolved: "Resolved",
      rejected: "Rejected",
    };
    return statusMap[status] || status;
  };

  // Filter incidents
  const filteredIncidents = incidents.filter((incident) => {
    const matchesFilter = filter === "all" || incident.status === filter;
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle status update
  const handleStatusUpdate = (status) => {
    if (selectedIncident) {
      const updated = incidents.map((inc) => {
        if (inc.id === selectedIncident.id) {
          return { ...inc, status, updated_at: new Date().toISOString() };
        }
        return inc;
      });
      setIncidents(updated);
      setShowStatusModal(false);
      setSelectedIncident(null);
      setStatusComment("");

      // Update stats
      const newStats = { ...stats };
      // Recalculate stats
      const pending = updated.filter((i) => i.status === "pending").length;
      const inProgress = updated.filter(
        (i) => i.status === "under_investigation",
      ).length;
      const resolved = updated.filter((i) => i.status === "resolved").length;
      const rejected = updated.filter((i) => i.status === "rejected").length;
      newStats.inProgress = inProgress;
      newStats.resolved = resolved;
      setStats(newStats);
    }
  };

  // Open status modal
  const openStatusModal = (incident) => {
    setSelectedIncident(incident);
    setShowStatusModal(true);
  };

  // Get status options
  const getStatusOptions = (currentStatus) => {
    const options = [];
    if (currentStatus !== "pending")
      options.push({ value: "pending", label: "Pending" });
    if (currentStatus !== "under_investigation")
      options.push({
        value: "under_investigation",
        label: "Under Investigation",
      });
    if (currentStatus !== "resolved")
      options.push({ value: "resolved", label: "Resolved" });
    if (currentStatus !== "rejected")
      options.push({ value: "rejected", label: "Rejected" });
    return options;
  };

  return (
    <div className='admin-page'>
      <div className='admin-header'>
        <div>
          <h1 className='heading-2'>Admin Dashboard</h1>
          <p className='body-small text-muted'>
            Manage incidents and monitor system activity
          </p>
        </div>
        <div className='admin-header-actions'>
          <span className='admin-role-badge'>Administrator</span>
        </div>
      </div>

      {/* Stats */}
      <div className='admin-stats'>
        <div className='stat-card'>
          <div className='stat-number'>{stats.total || incidents.length}</div>
          <div className='stat-label'>Total Reports</div>
        </div>
        <div className='stat-card'>
          <div className='stat-number'>
            {stats.inProgress ||
              incidents.filter((i) => i.status === "under_investigation")
                .length}
          </div>
          <div className='stat-label'>In Progress</div>
        </div>
        <div className='stat-card'>
          <div className='stat-number'>
            {stats.resolved ||
              incidents.filter((i) => i.status === "resolved").length}
          </div>
          <div className='stat-label'>Resolved</div>
        </div>
        <div className='stat-card'>
          <div className='stat-number'>
            {incidents.filter((i) => i.status === "pending").length}
          </div>
          <div className='stat-label'>Pending</div>
        </div>
      </div>

      {/* Filters */}
      <div className='admin-filters'>
        <div className='admin-search'>
          <input
            type='text'
            className='input'
            placeholder='Search by title or reference...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='admin-filter-buttons'>
          <button
            className={`admin-filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`admin-filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`admin-filter-btn ${filter === "under_investigation" ? "active" : ""}`}
            onClick={() => setFilter("under_investigation")}
          >
            Investigation
          </button>
          <button
            className={`admin-filter-btn ${filter === "resolved" ? "active" : ""}`}
            onClick={() => setFilter("resolved")}
          >
            Resolved
          </button>
          <button
            className={`admin-filter-btn ${filter === "rejected" ? "active" : ""}`}
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Incidents Table */}
      <div className='admin-table-wrapper'>
        <div className='admin-table-card'>
          <div className='admin-table-header'>
            <span className='admin-table-title'>All Incidents</span>
            <span className='admin-table-count'>
              {filteredIncidents.length} records
            </span>
          </div>
          <div className='admin-table-scroll'>
            <table className='admin-table'>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Reported</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.map((incident) => (
                    <tr key={incident.id}>
                      <td className='admin-table-ref'>{incident.reference}</td>
                      <td className='admin-table-title'>{incident.title}</td>
                      <td className='admin-table-type'>{incident.type}</td>
                      <td>
                        <span
                          className={`status-badge ${getStatusClass(incident.status)}`}
                        >
                          {getStatusLabel(incident.status)}
                        </span>
                      </td>
                      <td className='admin-table-date'>
                        {formatDateTime(incident.created_at)}
                      </td>
                      <td>
                        <div className='admin-table-actions'>
                          <button
                            className='btn btn-sm btn-secondary'
                            onClick={() => openStatusModal(incident)}
                          >
                            Update Status
                          </button>
                          <Link
                            to={`/incidents/${incident.id}`}
                            className='btn btn-sm btn-secondary'
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='6' className='admin-table-empty'>
                      No incidents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedIncident && (
        <div
          className='modal-overlay'
          onClick={() => setShowStatusModal(false)}
        >
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h3 className='heading-4'>Update Status</h3>
              <button
                className='modal-close'
                onClick={() => setShowStatusModal(false)}
              >
                <CloseIcon color='var(--color-ink-muted)' size={20} />
              </button>
            </div>
            <div className='modal-body'>
              <div className='admin-status-info'>
                <div className='admin-status-ref'>
                  Reference: {selectedIncident.reference}
                </div>
                <div className='admin-status-title'>
                  {selectedIncident.title}
                </div>
                <div className='admin-status-current'>
                  Current Status:{" "}
                  <span
                    className={`status-badge ${getStatusClass(selectedIncident.status)}`}
                  >
                    {getStatusLabel(selectedIncident.status)}
                  </span>
                </div>
              </div>
              <div className='form-group'>
                <label className='label label-required'>New Status</label>
                <select
                  className='input'
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  defaultValue=''
                >
                  <option value='' disabled>
                    Select new status...
                  </option>
                  {getStatusOptions(selectedIncident.status).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='form-group'>
                <label className='label'>Comment (Optional)</label>
                <textarea
                  className='input'
                  rows='3'
                  placeholder='Add a comment about this status change...'
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                />
              </div>
              <div className='modal-actions'>
                <button
                  className='btn btn-secondary'
                  onClick={() => setShowStatusModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
