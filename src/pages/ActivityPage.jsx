import React from "react";
import { useSelector } from "react-redux";

export const ActivityPage = () => {
  const { incidents } = useSelector(
    (state) => state.incidents || { incidents: [] },
  );

  return (
    <div className='activity-page'>
      <div className='page-header'>
        <h1 className='heading-2'>Activity</h1>
        <p className='body-small text-muted'>Your incident history</p>
      </div>

      <div className='activity-list'>
        {incidents && incidents.length > 0 ? (
          incidents.map((incident) => (
            <div key={incident.id} className='activity-item'>
              <div className='activity-item-header'>
                <span className='activity-item-title'>{incident.title}</span>
                <span
                  className={`status-badge status-badge-${incident.status}`}
                >
                  {incident.status}
                </span>
              </div>
              <p className='activity-item-description'>
                {incident.description}
              </p>
              <span className='activity-item-date'>{incident.created_at}</span>
            </div>
          ))
        ) : (
          <div className='empty-state'>
            <p className='body-text text-muted'>No activity yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;
