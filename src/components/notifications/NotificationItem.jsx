import { formatDistanceToNow, parseISO } from "date-fns";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiTrash2 } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { markAsRead, removeNotification } from "../../redux/slices/notificationSlice";

const TYPE_ICON = {
  status_change: FiAlertCircle,
  resolved: FiCheckCircle,
  rejected: FiAlertCircle,
};

function timeAgo(isoString) {
  try {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
  } catch {
    return "";
  }
}

export default function NotificationItem({ notification }) {
  const dispatch = useDispatch();
  const Icon = TYPE_ICON[notification.type] || FiInfo;

  function handleClick() {
    if (!notification.read) dispatch(markAsRead(notification.id));
  }

  function handleDelete(e) {
    e.stopPropagation();
    dispatch(removeNotification(notification.id));
  }

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      role="button"
      tabIndex={0}
      aria-label={`${notification.read ? "" : "Unread: "}${notification.title}`}
      style={{
        display: "flex",
        gap: "12px",
        padding: "12px 16px",
        cursor: "pointer",
        background: notification.read ? "white" : "#fff8f8",
        borderBottom: "1px solid #f0f0f0",
        position: "relative",
        alignItems: "flex-start",
      }}
    >
      {!notification.read && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "6px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#e53935",
            flexShrink: 0,
          }}
        />
      )}
      <Icon size={20} style={{ color: "#e53935", flexShrink: 0, marginTop: "2px" }} aria-hidden="true" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: "0 0 2px", fontWeight: notification.read ? 400 : 600, fontSize: "14px" }}>
          {notification.title}
        </p>
        <p
          style={{
            margin: "0 0 4px",
            fontSize: "13px",
            color: "#555",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {notification.message}
        </p>
        <span style={{ fontSize: "11px", color: "#bbb" }}>{timeAgo(notification.created_at)}</span>
      </div>
      <button
        onClick={handleDelete}
        aria-label="Delete notification"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#ccc",
          padding: "4px",
          flexShrink: 0,
          minWidth: "44px",
          minHeight: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
        }}
      >
        <FiTrash2 size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
