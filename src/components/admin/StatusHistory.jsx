import React from "react";
import "./StatusHistory.css"

function StatusHistory({ history = [] }) {
  if (!history.length) {
    return (
      <div className="status-history-empty">
        No status changes have been recorded yet.
      </div>
    );
  }

  return (
    <div className="status-history">

      {history.map((item, index) => (
        <div
          className="status-history-item"
          key={item.id || index}
        >

          <div className="status-history-dot" />

          <div className="status-history-content">

            <div className="status-history-top">

              <strong>
                {item.new_status}
              </strong>

              <span>
                {item.changed_at}
              </span>

            </div>

            <p>
              Changed from{" "}
              <strong>{item.old_status}</strong>{" "}
              by {item.changed_by}
            </p>

            {item.comment && (
              <div className="status-history-comment">
                "{item.comment}"
              </div>
            )}

          </div>

        </div>
      ))}

    </div>
  );
}

export default StatusHistory;