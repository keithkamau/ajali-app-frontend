import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationFilter from "../components/notifications/NotificationFilter";
import NotificationItem from "../components/notifications/NotificationItem";
import {
  clearAllNotifications,
  fetchNotifications,
  markAllAsRead,
} from "../redux/slices/notificationSlice";

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { notifications, unread_count, loading } = useSelector((s) => s.notifications);
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
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: "24px" }}>Notifications</h1>
          {unread_count > 0 && (
            <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
              {unread_count} unread
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => dispatch(markAllAsRead())}
            disabled={unread_count === 0}
            style={{
              padding: "10px 16px",
              borderRadius: "6px",
              border: "1px solid #e53935",
              background: "white",
              color: "#e53935",
              cursor: unread_count === 0 ? "not-allowed" : "pointer",
              fontSize: "13px",
              fontWeight: 500,
              opacity: unread_count === 0 ? 0.4 : 1,
              minHeight: "44px",
            }}
          >
            Mark all read
          </button>
          <button
            onClick={() => dispatch(clearAllNotifications())}
            disabled={notifications.length === 0}
            style={{
              padding: "10px 16px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              background: "white",
              color: "#888",
              cursor: notifications.length === 0 ? "not-allowed" : "pointer",
              fontSize: "13px",
              minHeight: "44px",
              opacity: notifications.length === 0 ? 0.4 : 1,
            }}
          >
            Clear all
          </button>
        </div>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <div style={{ borderBottom: "1px solid #f0f0f0", padding: "0 4px" }}>
          <NotificationFilter active={filter} onChange={setFilter} />
        </div>

        {loading && (
          <p style={{ padding: "48px", textAlign: "center", color: "#bbb", fontSize: "14px" }}>
            Loading…
          </p>
        )}
        {!loading && filtered.length === 0 && (
          <p style={{ padding: "48px", textAlign: "center", color: "#bbb", fontSize: "14px" }}>
            {filter === "unread" ? "No unread notifications" : "You have no notifications yet"}
          </p>
        )}
        {filtered.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>
    </div>
  );
}
