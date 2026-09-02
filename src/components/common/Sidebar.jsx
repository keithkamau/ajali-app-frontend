import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Sidebar.css";

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  // Regular user menu items
  const userMenuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <rect x='3' y='3' width='7' height='7' rx='1' />
          <rect x='14' y='3' width='7' height='7' rx='1' />
          <rect x='3' y='14' width='7' height='7' rx='1' />
          <rect x='14' y='14' width='7' height='7' rx='1' />
        </svg>
      ),
    },
    {
      path: "/incidents/create",
      label: "Report Incident",
      icon: (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <circle cx='12' cy='12' r='10' />
          <line x1='12' y1='8' x2='12' y2='16' />
          <line x1='8' y1='12' x2='16' y2='12' />
        </svg>
      ),
    },
    {
      path: "/notifications",
      label: "Notifications",
      icon: (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' />
          <path d='M13.73 21a2 2 0 0 1-3.46 0' />
        </svg>
      ),
    },
    {
      path: "/profile",
      label: "Profile",
      icon: (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
          <circle cx='12' cy='7' r='4' />
        </svg>
      ),
    },
  ];

  // Admin only menu items
  const adminMenuItems = [
    {
      path: "/admin",
      label: "Admin Dashboard",
      icon: (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
          <polyline points='9 12 11 14 15 10' />
        </svg>
      ),
    },
    {
      path: "/admin/incidents",
      label: "All Incidents",
      icon: (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
          <polyline points='14 2 14 8 20 8' />
          <line x1='16' y1='13' x2='8' y2='13' />
          <line x1='16' y1='17' x2='8' y2='17' />
          <polyline points='10 9 9 9 8 9' />
        </svg>
      ),
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
          <circle cx='9' cy='7' r='4' />
          <path d='M23 21v-2a4 4 0 0 0-3-3.87' />
          <path d='M16 3.13a4 4 0 0 1 0 7.75' />
        </svg>
      ),
    },
    {
      path: "/admin/stats",
      label: "Statistics",
      icon: (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <line x1='18' y1='20' x2='18' y2='10' />
          <line x1='12' y1='20' x2='12' y2='4' />
          <line x1='6' y1='20' x2='6' y2='14' />
          <rect x='2' y='2' width='20' height='20' rx='2' />
        </svg>
      ),
    },
    {
      path: "/profile",
      label: "My Profile",
      icon: (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
          <circle cx='12' cy='7' r='4' />
        </svg>
      ),
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <nav className='sidebar-nav'>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${isActive(item.path) ? "active" : ""}`}
            title={collapsed ? item.label : ""}
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
