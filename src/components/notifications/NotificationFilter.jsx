const FILTERS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

export default function NotificationFilter({ active, onChange }) {
  return (
    <div role="tablist" style={{ display: "flex", padding: "0 4px" }}>
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          role="tab"
          aria-selected={active === value}
          onClick={() => onChange(value)}
          style={{
            background: "none",
            border: "none",
            padding: "10px 12px",
            fontSize: "13px",
            cursor: "pointer",
            color: active === value ? "#e53935" : "#888",
            borderBottom: active === value ? "2px solid #e53935" : "2px solid transparent",
            fontWeight: active === value ? 600 : 400,
            transition: "color 0.15s",
            minHeight: "44px",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
