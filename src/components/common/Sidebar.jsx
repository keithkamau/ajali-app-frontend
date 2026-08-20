// src/components/common/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { path: "/home", icon: "🏠", label: "Dashboard" },
    { path: "/incidents/create", icon: "📝", label: "Report Incident" },
    { path: "/activity", icon: "📋", label: "Activity" },
    { path: "/notifications", icon: "🔔", label: "Alerts" },
  ];

  return (
    <aside className='sidebar'>
      <div className='sidebar-logo'>
        <span>🚨</span>
        <span>Ajali</span>
      </div>

      <nav className='sidebar-nav'>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? "active" : ""}`}
            >
              <span className='nav-icon'>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className='sidebar-bottom'>
        <div className='sidebar-user'>
          <div className='avatar avatar-sm'>
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", fontWeight: "500" }}>
              {user?.full_name || "User"}
            </div>
            <div
              style={{ fontSize: "0.75rem", color: "var(--color-ink-muted)" }}
            >
              {user?.email || "user@email.com"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
