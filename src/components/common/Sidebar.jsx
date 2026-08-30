import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Sidebar.css";

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
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
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <nav className='sidebar-nav'>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${isActive(item.path) ? "active" : ""}`}
          >
            <span className='sidebar-icon'>{item.icon}</span>
            {!collapsed && <span className='sidebar-label'>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
