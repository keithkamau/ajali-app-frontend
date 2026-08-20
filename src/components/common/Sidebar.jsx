import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HomeIcon,
  CreateIcon,
  ActivityIcon,
  BellIcon,
  ProfileIcon,
} from "../icons";

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: "/home", icon: HomeIcon, label: "Dashboard" },
    { path: "/incidents/create", icon: CreateIcon, label: "Report Incident" },
    { path: "/activity", icon: ActivityIcon, label: "Activity" },
    { path: "/notifications", icon: BellIcon, label: "Alerts" },
    { path: "/profile", icon: ProfileIcon, label: "Profile" },
  ];

  // Add admin link if user is admin
  if (user?.role === "admin") {
    navItems.push({ path: "/admin", icon: ActivityIcon, label: "Admin Panel" });
  }

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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      <div className='sidebar-header'>
        <div className='sidebar-logo'>
          {!isCollapsed && <span>Ajali</span>}
          {isCollapsed && <span>A</span>}
        </div>
        <button
          className='sidebar-toggle'
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 640 640'
            style={{
              width: 16,
              height: 16,
              fill: "var(--color-ink-muted)",
              transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          >
            <path d='M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z' />
          </svg>
        </button>
      </div>

      <nav className='sidebar-nav'>
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");
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
                <Icon color={isActive ? "#ffffff" : color} size={20} />
              </span>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className='sidebar-bottom'>
        <div className='sidebar-user'>
          <div className='sidebar-avatar'>{initials}</div>
          {!isCollapsed && (
            <div className='sidebar-user-info'>
              <div className='sidebar-user-name'>{displayName}</div>
              <div className='sidebar-user-email'>{displayEmail}</div>
              <div className='sidebar-user-role'>
                {user?.role === "admin" ? "Administrator" : "User"}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
