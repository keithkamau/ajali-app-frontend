import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./BottomNav.css";

const BottomNav = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  // User navigation items
  const userNavItems = [
    { path: "/dashboard", label: "Home" },
    { path: "/incidents/create", label: "Report" },
    { path: "/notifications", label: "Alerts" },
    { path: "/profile", label: "Profile" },
  ];

  // Admin navigation items
  const adminNavItems = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/incidents", label: "Incidents" },
    { path: "/admin/users", label: "Users" },
    { path: "/profile", label: "Profile" },
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
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = isActivePath(item.path);
        const color = isActive ? "var(--color-navy)" : "var(--color-ink-muted)";

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;