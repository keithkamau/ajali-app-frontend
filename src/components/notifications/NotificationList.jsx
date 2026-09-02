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
  const { notifications, isLoading } = useSelector(
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

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };

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
            onClick={handleMarkAllRead}
            className='btn btn-sm btn-secondary'
          >
            Mark all read
          </button>
          <button
            onClick={handleClearAll}
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
              width='48'
              height='48'
              fill='currentColor'
              opacity='0.5'
            >
              <path d='M576 480C576 515.3 547.5 544 512.1 544L128 544C92.6 544 64 515.3 64 480L64 228C64.1 212.5 71.8 198 84.5 189.2L270 61.3C300.1 40.6 339.8 40.6 369.9 61.3L555.5 189.2C568.3 198 575.9 212.5 576 228L576 480zM128 496L512.1 496C520.9 496 528 488.9 528 480L528 288.3L373.2 405.7C341.8 429.6 298.3 429.6 266.8 405.7L112 288.3L112 480C112 488.9 119.2 496 128 496zM527.6 228.4L342.7 100.8C329 91.4 311 91.4 297.3 100.8L112.4 228.4L295.8 367.5C310.1 378.3 329.9 378.3 344.2 367.5L527.6 228.4z' />
            </svg>
            <p className='body-small text-muted'>
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
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

export default NotificationList;
