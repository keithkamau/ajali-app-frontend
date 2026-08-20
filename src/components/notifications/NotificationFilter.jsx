// src/components/notifications/NotificationFilter.jsx
import React from "react";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

export const NotificationFilter = ({ active, onChange }) => {
  return (
    <div role='tablist' className='notification-filter'>
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          role='tab'
          aria-selected={active === value}
          onClick={() => onChange(value)}
          className={`notification-filter-btn ${active === value ? "active" : ""}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default NotificationFilter;
