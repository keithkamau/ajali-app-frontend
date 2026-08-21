import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { HomeIcon, ActivityIcon, BellIcon, ProfileIcon } from "../icons";

export const BottomNav = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  // User navigation items
  const userNavItems = [
    { path: "/home", icon: HomeIcon, label: "Home" },
    { path: "/activity", icon: ActivityIcon, label: "Activity" },
    { path: "/notifications", icon: BellIcon, label: "Alerts" },
    { path: "/profile", icon: ProfileIcon, label: "Profile" },
  ];

  // Admin navigation items
  const adminNavItems = [
    { path: "/admin", icon: HomeIcon, label: "Dashboard" },
    { path: "/admin/incidents", icon: ActivityIcon, label: "Incidents" },
    { path: "/admin/users", icon: ProfileIcon, label: "Users" },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const isActivePath = (path) => {
    if (path === "/admin") {
      return (
        location.pathname === "/admin" ||
        location.pathname.startsWith("/admin/incidents") ||
        location.pathname.startsWith("/admin/users")
      );
    }
    return location.pathname === path;
  };

  return (
    <nav className='bottom-nav'>
      {navItems.map((item) => {
        const isActive = isActivePath(item.path);
        const Icon = item.icon;
        const color = isActive ? "var(--color-navy)" : "var(--color-ink-muted)";

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
          >
            <span className='nav-icon'>
              <Icon color={color} size={24} />
            </span>
            <span className='nav-label'>{item.label}</span>
            {item.path === "/notifications" && (
              <span className='badge-dot'></span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
