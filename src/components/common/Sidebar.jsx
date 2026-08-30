import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/incidents/create", label: "Report Incident", icon: "➕" },
    { path: "/notifications", label: "Notifications", icon: "🔔" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  if (user?.role === "admin") {
    menuItems.push({ path: "/admin", label: "Admin Panel", icon: "⚙️" });
  }

  return (
    <aside className='sidebar'>
      <nav className='sidebar-nav'>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${isActive(item.path)}`}
          >
            <span className='sidebar-icon'>{item.icon}</span>
            <span className='sidebar-label'>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
