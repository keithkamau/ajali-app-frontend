import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchIncidentStatusHistory,
} from "../../redux/slices/adminSlice";

function StatusHistory({ incidentId }) {
  const dispatch = useDispatch();

  const {
    statusHistory,
    loading,
    error,
  } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    if (incidentId) {
      dispatch(
        fetchIncidentStatusHistory(
          incidentId
        )
      );
    }
  }, [dispatch, incidentId]);

  if (loading) {
    return <p>Loading status history...</p>;
  }

  if (error) {
    return (
      <p className="error-message">
        {error}
      </p>
    );
  }

  if (!statusHistory.length) {
    return (
      <p>
        No status history available.
      </p>
    );
  }

  return (
    <div className="status-history">

      <h2>Status History</h2>

      {statusHistory.map((item) => (
        <div
          className="status-history-item"
          key={item.id}
        >

          <div>
            <strong>
              {item.old_status
                ? `${item.old_status} → `
                : ""}
              {item.new_status}
            </strong>

            {item.comment && (
              <p>{item.comment}</p>
            )}

            <small>
              {new Date(
                item.changed_at
              ).toLocaleString()}
            </small>
          </div>

        </div>
      ))}

    </div>
  );
}

export default StatusHistory;