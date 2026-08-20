import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CreateIcon, EmergencyIcon } from "../components/icons";

export const HomePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className='home-page'>
      <div className='home-welcome'>
        <h1 className='heading-2'>
          Welcome back, {user?.full_name || "User"}!
        </h1>
        <p className='body-small text-muted'>
          What would you like to do today?
        </p>
      </div>

      <div className='home-quick-actions'>
        <Link to='/incidents/create' className='quick-action-btn primary'>
          <span className='action-icon'>
            <CreateIcon color='#ffffff' size={28} />
          </span>
          <span>Report Incident</span>
        </Link>
        <Link to='/dashboard' className='quick-action-btn'>
          <span className='action-icon'>📋</span>
          <span>My Reports</span>
        </Link>
        <Link to='/activity' className='quick-action-btn'>
          <span className='action-icon'>✅</span>
          <span>Resolved</span>
        </Link>
        <button className='quick-action-btn danger'>
          <span className='action-icon'>
            <EmergencyIcon color='#ffffff' size={28} />
          </span>
          <span>Emergency</span>
        </button>
      </div>

      <div className='home-recent'>
        <div className='card'>
          <h2 className='heading-4' style={{ marginBottom: "0.5rem" }}>
            Recent Activity
          </h2>
          <p
            className='body-small text-muted'
            style={{ marginBottom: "1.5rem" }}
          >
            Your recent incident reports
          </p>
          <div className='empty-state'>
            <p className='body-text text-muted'>
              No recent activity to display
            </p>
            <Link
              to='/incidents/create'
              className='btn btn-primary'
              style={{ marginTop: "1rem" }}
            >
              Create your first report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
