import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAllNotifications,
  fetchNotifications,
  markAllAsRead,
} from "../../redux/slices/notificationSlice";
import NotificationFilter from "./NotificationFilter";
import NotificationItem from "./NotificationItem";

export const NotificationList = ({ onClose }) => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((s) => s.notifications);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  return (
    <div
      role='dialog'
      aria-label='Notifications panel'
      className='notification-panel'
    >
      <div className='notification-panel-header'>
        <span className='heading-5'>Notifications</span>
        <div className='notification-panel-actions'>
          <button
            onClick={() => dispatch(markAllAsRead())}
            className='btn btn-sm btn-secondary'
          >
            Mark all read
          </button>
          <button
            onClick={() => dispatch(clearAllNotifications())}
            className='btn btn-sm btn-secondary'
            style={{ color: "var(--color-ink-muted)" }}
          >
            Clear all
          </button>
        </div>
      </div>

      <div className='notification-panel-filter'>
        <NotificationFilter active={filter} onChange={setFilter} />
      </div>

      <div className='notification-panel-list'>
        {loading && (
          <div className='notification-empty-state'>
            <span className='spinner spinner-sm'></span>
            <p className='body-small text-muted'>Loading…</p>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className='notification-empty-state'>
            <p className='body-small text-muted'>
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </p>
          </div>
        )}
        {filtered.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
