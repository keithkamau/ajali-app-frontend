import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { changeIncidentStatus } from "../../redux/slices/adminSlice";
import "./StatusUpdateForm.css"

function StatusUpdateForm({
  incident,
  onClose,
  onUpdated,
}) {
  const dispatch = useDispatch();

  const { loading, error } = useSelector(
    (state) => state.admin
  );

  const [status, setStatus] = useState(
    incident?.status || "reported"
  );

  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await dispatch(
        changeIncidentStatus({
          id: incident.id,
          status,
          comment,
        })
      ).unwrap();

    setMessage("Incident status updated successfully.");

      if (onUpdated) {
        onUpdated(result);
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error(
        "Failed to update status:",
        error
      );
    }
  };
// function StatusUpdateForm({
//   incident,
//   onClose,
// }) {
//   const dispatch = useDispatch();

//   const [status, setStatus] = useState(
//     incident?.status || "Reported"
//   );

//   const [comment, setComment] = useState("");

//   const [message, setMessage] = useState("");

  
//   function handleSubmit(event) {
//     event.preventDefault();

//     if (!incident) {
//       return;
//     }

//     dispatch(
//       changeIncidentStatus({
//         id: incident.id,
//         status,
//       })
//     );

//     setMessage("Incident status updated successfully.");

//     setTimeout(() => {
//       if (onClose) {
//         onClose();
//       }
//     }, 1000);
//   }

  return (
    <div className="status-modal-overlay">

      <div className="status-modal">

        <div className="status-modal-header">

          <div>
            <h2>Update Incident Status</h2>

            <p>
              Incident #{incident?.id}
            </p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="status-form-group">

            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option value="Reported">
                Reported
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Resolved">
                Resolved
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>

          </div>

          <div className="status-form-group">

            <label htmlFor="comment">
              Comment
            </label>

            <textarea
              id="comment"
              value={comment}
              onChange={(event) =>
                setComment(event.target.value)
              }
              placeholder="Add a comment about this status change..."
              rows="4"
            />

          </div>

          {message && (
            <div className="status-success">
              {message}
            </div>
          )}

          <div className="status-modal-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="update-button"
            >
              Update Status
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default StatusUpdateForm;