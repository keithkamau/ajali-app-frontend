// src/components/common/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import { NotificationBell } from "../notifications/NotificationBell";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className='header'>
      <div className='header-container'>
        <Link to='/home' className='header-logo'>
          <span className='header-logo-icon'>🚨</span>
          <span>Ajali</span>
        </Link>

        <div className='header-actions'>
          <NotificationBell />
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.25rem",
              padding: "0.25rem",
            }}
            title='Logout'
          >
            🚪
          </button>
        </div>
      </div>
    </header>
  );
};
