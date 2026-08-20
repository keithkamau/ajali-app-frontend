import { NavLink } from "react-router-dom";
import React from "react";
import "./AdminLayout.css";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <div className="logo-mark">
          A<span>J</span>ALI
        </div>
        <p>Smart. Fast. Verified.</p>
      </div>

      <nav className="admin-nav">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `admin-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">⌂</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/incidents"
          className={({ isActive }) =>
            `admin-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">▤</span>
          Reports
        </NavLink>

        <NavLink
          to="/admin/responders"
          className={({ isActive }) =>
            `admin-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">♙</span>
          Responders
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `admin-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">♙</span>
          Users
        </NavLink>

        <NavLink
          to="/admin/alerts"
          className={({ isActive }) =>
            `admin-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">!</span>
          Alerts
        </NavLink>

        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            `admin-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">◔</span>
          Analytics
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `admin-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">⚙</span>
          Settings
        </NavLink>
      </nav>

      <button className="admin-logout">
        <span className="nav-icon">↪</span>
        Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;