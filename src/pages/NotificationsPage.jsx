import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationFilter from "../components/notifications/NotificationFilter";
import NotificationItem from "../components/notifications/NotificationItem";
import {
  clearAllNotifications,
  fetchNotifications,
  markAllAsRead,
} from "../redux/slices/notificationSlice";

// Mock notifications fallback
const mockNotifications = [
  {
    id: 1,
    title: "Status Updated",
    message: "Your incident has been resolved",
    read: false,
    created_at: "2024-01-15T10:30:00",
  },
  {
    id: 2,
    title: "New Response",
    message: "Responder has been dispatched",
    read: false,
    created_at: "2024-01-14T14:20:00",
  },
  {
    id: 3,
    title: "Incident Created",
    message: "Your incident has been submitted",
    read: true,
    created_at: "2024-01-13T09:15:00",
  },
];

export const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, unread_count, loading } = useSelector(
    (s) =>
      s.notifications || { notifications: [], unread_count: 0, loading: false },
  );
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const notificationList =
    notifications && notifications.length > 0
      ? notifications
      : mockNotifications;
  const unreadCount = notifications?.filter((n) => !n.read)?.length || 0;

  const filtered = notificationList.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };

  return (
    <div className='notifications-page'>
      <div className='notifications-page-header'>
        <div>
          <h1 className='heading-2'>Notifications</h1>
          {unreadCount > 0 && (
            <p className='body-small text-muted'>{unreadCount} unread</p>
          )}
        </div>
        <div className='notifications-page-actions'>
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className={`btn btn-sm ${unreadCount > 0 ? "btn-danger" : "btn-secondary"}`}
          >
            Mark all read
          </button>
          <button
            onClick={handleClearAll}
            disabled={notificationList.length === 0}
            className='btn btn-sm btn-secondary'
          >
            Clear all
          </button>
        </div>
      </div>

      <div className='notifications-page-list'>
        <div className='notification-filter-wrapper'>
          <NotificationFilter active={filter} onChange={setFilter} />
        </div>

        {loading && (
          <div className='notification-empty-state'>
            <span className='spinner spinner-sm'></span>
            <p className='body-small text-muted'>Loading...</p>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className='notification-empty-state'>
            <p className='body-small text-muted'>
              {filter === "unread"
                ? "No unread notifications"
                : "You have no notifications yet"}
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

export default NotificationsPage;
