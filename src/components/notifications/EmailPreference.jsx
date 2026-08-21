export default function EmailPreference({ email, enabled, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 0",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div>
        <p style={{ margin: "0 0 4px", fontWeight: 500, fontSize: "15px" }}>Email Notifications</p>
        <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
          {email || "Your registered email address"}
        </p>
      </div>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          minHeight: "44px",
        }}
      >
        <span style={{ fontSize: "13px", color: "#888" }}>{enabled ? "On" : "Off"}</span>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
          style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#e53935" }}
        />
      </label>
    </div>
  );
}
