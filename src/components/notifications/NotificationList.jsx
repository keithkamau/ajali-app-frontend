import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAllNotifications,
  fetchNotifications,
  markAllAsRead,
} from "../../redux/slices/notificationSlice";
import NotificationFilter from "./NotificationFilter";
import NotificationItem from "./NotificationItem";

export default function NotificationList({ onClose }) {
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
      role="dialog"
      aria-label="Notifications panel"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        width: "360px",
        maxHeight: "480px",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.13)",
        zIndex: 1000,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: "15px" }}>Notifications</span>
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={() => dispatch(markAllAsRead())}
            style={{
              fontSize: "12px",
              color: "#e53935",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 8px",
              borderRadius: "4px",
              minHeight: "32px",
            }}
          >
            Mark all read
          </button>
          <button
            onClick={() => dispatch(clearAllNotifications())}
            style={{
              fontSize: "12px",
              color: "#aaa",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 8px",
              borderRadius: "4px",
              minHeight: "32px",
            }}
          >
            Clear all
          </button>
        </div>
      </div>

      <div style={{ borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
        <NotificationFilter active={filter} onChange={setFilter} />
      </div>

      <div style={{ overflowY: "auto", flex: 1 }}>
        {loading && (
          <p style={{ padding: "24px", color: "#bbb", textAlign: "center", fontSize: "14px" }}>
            Loading…
          </p>
        )}
        {!loading && filtered.length === 0 && (
          <p style={{ padding: "32px 16px", color: "#bbb", textAlign: "center", fontSize: "14px" }}>
            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
          </p>
        )}
        {filtered.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>
    </div>
  );
}
