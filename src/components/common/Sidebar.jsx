import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { HomeIcon, CreateIcon, ActivityIcon, BellIcon } from "../icons";

export const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { path: "/home", icon: HomeIcon, label: "Dashboard" },
    { path: "/incidents/create", icon: CreateIcon, label: "Report Incident" },
    { path: "/activity", icon: ActivityIcon, label: "Activity" },
    { path: "/notifications", icon: BellIcon, label: "Alerts" },
  ];

  // Admin routes - only visible to admin users
  const adminItems = [
    { path: "/admin", icon: HomeIcon, label: "Admin Dashboard" },
    { path: "/admin/incidents", icon: ActivityIcon, label: "All Incidents" },
    { path: "/admin/users", icon: CreateIcon, label: "Manage Users" },
  ];

  const isAdmin = user?.role === "admin";

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <nav className='sidebar-nav'>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const iconColor = isActive ? "#0f172a" : "rgba(255,255,255,0.6)";

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? "active" : ""}`}
              title={isOpen ? "" : item.label}
            >
              <span className='nav-icon'>
                <Icon color={iconColor} size={isOpen ? 20 : 28} />
              </span>
              {isOpen && <span className='nav-label'>{item.label}</span>}
            </Link>
          );
        })}

        {/* Admin Section */}
        {isAdmin && isOpen && (
          <div className='sidebar-divider'>
            <span className='sidebar-divider-label'>Admin</span>
          </div>
        )}

        {isAdmin &&
          adminItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const iconColor = isActive ? "#0f172a" : "rgba(255,255,255,0.6)";

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                title={isOpen ? "" : item.label}
              >
                <span className='nav-icon'>
                  <Icon color={iconColor} size={isOpen ? 20 : 28} />
                </span>
                {isOpen && <span className='nav-label'>{item.label}</span>}
              </Link>
            );
          })}
      </nav>

      {isOpen && (
        <div className='sidebar-bottom'>
          <div className='sidebar-user'>
            <div className='avatar avatar-sm'>
              {getInitials(user?.full_name)}
            </div>
            <div className='sidebar-user-info'>
              <div className='sidebar-user-name'>
                {user?.full_name || "User"}
              </div>
              <div className='sidebar-user-email'>
                {user?.email || "user@email.com"}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
