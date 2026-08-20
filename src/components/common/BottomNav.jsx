// src/components/common/BottomNav.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/home", icon: "🏠", label: "Home" },
    { path: "/activity", icon: "📋", label: "Activity" },
    { path: "/notifications", icon: "🔔", label: "Alerts" },
    { path: "/profile", icon: "👤", label: "Profile" },
  ];

  return (
    <nav className='bottom-nav'>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
          >
            <span className='nav-icon'>{item.icon}</span>
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
