import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, ActivityIcon, BellIcon, ProfileIcon } from "../icons";

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/home",
      icon: HomeIcon,
      label: "Home",
      activeColor: "var(--color-navy)",
      inactiveColor: "var(--color-ink-muted)",
    },
    {
      path: "/activity",
      icon: ActivityIcon,
      label: "Activity",
      activeColor: "var(--color-navy)",
      inactiveColor: "var(--color-ink-muted)",
    },
    {
      path: "/notifications",
      icon: BellIcon,
      label: "Alerts",
      activeColor: "var(--color-navy)",
      inactiveColor: "var(--color-ink-muted)",
    },
    {
      path: "/profile",
      icon: ProfileIcon,
      label: "Profile",
      activeColor: "var(--color-navy)",
      inactiveColor: "var(--color-ink-muted)",
    },
  ];

  return (
    <nav className='bottom-nav'>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        const color = isActive ? item.activeColor : item.inactiveColor;

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
