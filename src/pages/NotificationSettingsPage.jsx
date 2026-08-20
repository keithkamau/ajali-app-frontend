import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import NotificationPreferences from "../components/notifications/NotificationPreferences";

export default function NotificationSettingsPage() {
  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "24px 16px" }}>
      <Link
        to="/notifications"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          color: "#e53935",
          fontSize: "14px",
          textDecoration: "none",
          marginBottom: "24px",
          minHeight: "44px",
        }}
      >
        <FiArrowLeft size={16} aria-hidden="true" />
        Back to notifications
      </Link>
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          padding: "24px",
        }}
      >
        <NotificationPreferences />
      </div>
    </div>
  );
}
