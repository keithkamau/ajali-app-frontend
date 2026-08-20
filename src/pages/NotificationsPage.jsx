import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationFilter from "../components/notifications/NotificationFilter";
import NotificationItem from "../components/notifications/NotificationItem";
import {
  clearAllNotifications,
  fetchNotifications,
  markAllAsRead,
} from "../redux/slices/notificationSlice";

export const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, unread_count, loading } = useSelector(
    (s) => s.notifications,
  );
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const filtered = notifications.filter((n) => {
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
          {unread_count > 0 && (
            <p className='body-small text-muted'>{unread_count} unread</p>
          )}
        </div>
        <div className='notifications-page-actions'>
          <button
            onClick={handleMarkAllRead}
            disabled={unread_count === 0}
            className={`btn btn-sm ${unread_count > 0 ? "btn-danger" : "btn-secondary"}`}
          >
            Mark all read
          </button>
          <button
            onClick={handleClearAll}
            disabled={notifications.length === 0}
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
