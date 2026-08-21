import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnreadCount } from "../../redux/slices/notificationSlice";
import NotificationList from "./NotificationList";
import { BellIcon } from "../icons";

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const unread_count = useSelector((s) => s.notifications?.unread_count || 0);
  const panelRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUnreadCount());
    const interval = setInterval(() => dispatch(fetchUnreadCount()), 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div ref={panelRef} className='notification-bell-wrapper'>
      <button
        onClick={toggleOpen}
        aria-label={`Notifications${unread_count > 0 ? `, ${unread_count} unread` : ""}`}
        aria-expanded={open}
        className='notification-bell-btn'
      >
        <BellIcon color='#ffffff' size={22} />
        {unread_count > 0 && (
          <span className='notification-badge' aria-hidden='true'>
            {unread_count > 99 ? "99+" : unread_count}
          </span>
        )}
      </button>
      {open && <NotificationList onClose={() => setOpen(false)} />}
    </div>
  );
};

export default NotificationBell;
