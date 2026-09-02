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
  const { notifications, unreadCount, isLoading } = useSelector(
    (state) => state.notifications,
  );
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const filtered = (notifications || []).filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const unread = notifications?.filter((n) => !n.read)?.length || 0;

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
          {unread > 0 && (
            <p className='body-small text-muted'>{unread} unread</p>
          )}
        </div>
        <div className='notifications-page-actions'>
          <button
            onClick={handleMarkAllRead}
            disabled={unread === 0}
            className={`btn btn-sm ${unread > 0 ? "btn-primary" : "btn-secondary"}`}
          >
            Mark all read
          </button>
          <button
            onClick={handleClearAll}
            disabled={notifications?.length === 0}
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

        {isLoading && (
          <div className='notification-empty-state'>
            <span className='spinner spinner-sm'></span>
            <p className='body-small text-muted'>Loading...</p>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className='notification-empty-state'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 640 640'
              width='64'
              height='64'
              fill='currentColor'
              opacity='0.5'
            >
              <path d='M576 480C576 515.3 547.5 544 512.1 544L128 544C92.6 544 64 515.3 64 480L64 228C64.1 212.5 71.8 198 84.5 189.2L270 61.3C300.1 40.6 339.8 40.6 369.9 61.3L555.5 189.2C568.3 198 575.9 212.5 576 228L576 480zM128 496L512.1 496C520.9 496 528 488.9 528 480L528 288.3L373.2 405.7C341.8 429.6 298.3 429.6 266.8 405.7L112 288.3L112 480C112 488.9 119.2 496 128 496zM527.6 228.4L342.7 100.8C329 91.4 311 91.4 297.3 100.8L112.4 228.4L295.8 367.5C310.1 378.3 329.9 378.3 344.2 367.5L527.6 228.4z' />
            </svg>
            <p className='body-small text-muted'>
              {filter === "unread"
                ? "No unread notifications"
                : "You have no notifications yet"}
            </p>
          </div>
        )}

        {!isLoading &&
          filtered.length > 0 &&
          filtered.map((n) => <NotificationItem key={n.id} notification={n} />)}
      </div>
    </div>
  );
};

export default NotificationsPage;
