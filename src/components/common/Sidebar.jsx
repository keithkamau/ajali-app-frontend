import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { HomeIcon, CreateIcon, ActivityIcon, BellIcon } from "../icons";

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { path: "/home", icon: HomeIcon, label: "Dashboard" },
    { path: "/incidents/create", icon: CreateIcon, label: "Report Incident" },
    { path: "/activity", icon: ActivityIcon, label: "Activity" },
    { path: "/notifications", icon: BellIcon, label: "Alerts" },
  ];

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const displayName = user?.full_name || "User";
  const displayEmail = user?.email || "user@ajali.com";
  const initials = getInitials(displayName);

  return (
    <aside className='sidebar'>
      <div className='sidebar-logo'>
        <span>Ajali</span>
      </div>

      <nav className='sidebar-nav'>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const color = isActive
            ? "var(--color-navy)"
            : "var(--color-ink-muted)";

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? "active" : ""}`}
            >
              <span className='nav-icon'>
                <Icon color={color} size={20} />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className='sidebar-bottom'>
        <div className='sidebar-user'>
          <div className='sidebar-avatar'>{initials}</div>
          <div className='sidebar-user-info'>
            <div className='sidebar-user-name'>{displayName}</div>
            <div className='sidebar-user-email'>{displayEmail}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
