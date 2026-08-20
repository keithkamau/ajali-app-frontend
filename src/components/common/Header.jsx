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
          <span className='header-logo-text'>Ajali</span>
        </Link>

        <div className='header-actions'>
          <NotificationBell />
          <button
            onClick={handleLogout}
            className='header-logout-btn'
            title='Logout'
            aria-label='Logout'
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
