import { useEffect, useRef, useState } from "react";
import { FiBell } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnreadCount } from "../../redux/slices/notificationSlice";
import NotificationList from "./NotificationList";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const unread_count = useSelector((s) => s.notifications.unread_count);
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

  return (
    <div ref={panelRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Notifications${unread_count > 0 ? `, ${unread_count} unread` : ""}`}
        aria-expanded={open}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          position: "relative",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "44px",
          minHeight: "44px",
          borderRadius: "50%",
        }}
      >
        <FiBell size={22} />
        {unread_count > 0 && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              background: "#e53935",
              color: "white",
              borderRadius: "50%",
              minWidth: "16px",
              height: "16px",
              fontSize: "10px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 3px",
              lineHeight: 1,
            }}
          >
            {unread_count > 99 ? "99+" : unread_count}
          </span>
        )}
      </button>
      {open && <NotificationList onClose={() => setOpen(false)} />}
    </div>
  );
}
