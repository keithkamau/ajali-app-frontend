import React from "react";
import { useSelector } from "react-redux";

// Mock activity data
const mockActivities = [
  {
    id: 1,
    title: "Road accident reported",
    status: "pending",
    description: "Multi-vehicle collision on Mombasa Road",
    created_at: "2024-01-15T10:30:00",
  },
  {
    id: 2,
    title: "Emergency response dispatched",
    status: "resolved",
    description: "Medical team dispatched to Nairobi CBD",
    created_at: "2024-01-14T14:20:00",
  },
  {
    id: 3,
    title: "Fire incident reported",
    status: "under_investigation",
    description: "Fire at industrial area, Nairobi",
    created_at: "2024-01-13T09:15:00",
  },
  {
    id: 4,
    title: "Accident reported",
    status: "pending",
    description: "Accident on Thika Road",
    created_at: "2024-01-12T16:45:00",
  },
  {
    id: 5,
    title: "Medical emergency",
    status: "resolved",
    description: "Medical emergency resolved",
    created_at: "2024-01-11T11:00:00",
  },
];

export const ActivityPage = () => {
  const { incidents } = useSelector(
    (state) => state.incidents || { incidents: [] },
  );

  const activities =
    incidents && incidents.length > 0 ? incidents : mockActivities;

  return (
    <div className='activity-page'>
      <div className='page-header'>
        <h1 className='heading-2'>Activity</h1>
        <p className='body-small text-muted'>Your incident history</p>
      </div>

      <div className='activity-list'>
        {activities.map((activity) => (
          <div key={activity.id} className='activity-item'>
            <div className='activity-item-header'>
              <span className='activity-item-title'>{activity.title}</span>
              <span className={`status-badge status-badge-${activity.status}`}>
                {activity.status?.replace("_", " ") || "pending"}
              </span>
            </div>
            <p className='activity-item-description'>{activity.description}</p>
            <span className='activity-item-date'>
              {activity.created_at
                ? new Date(activity.created_at).toLocaleDateString()
                : "Recently"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPage;
