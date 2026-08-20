import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import { NotificationBell } from "../notifications/NotificationBell";
import { LogoutIcon } from "../icons";

export const Header = ({ onToggleSidebar, sidebarOpen }) => {
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
        <div className='header-left'>
          <button
            onClick={onToggleSidebar}
            className='sidebar-toggle-btn'
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='24'
              height='24'
              fill='none'
              stroke='white'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              {sidebarOpen ? (
                <path d='M18 6L6 18M6 6l12 12' />
              ) : (
                <path d='M3 12h18M3 6h18M3 18h18' />
              )}
            </svg>
          </button>
          <Link to='/home' className='header-logo-text'>
            Ajali
          </Link>
        </div>

        <div className='header-actions'>
          <NotificationBell />
          <button
            onClick={handleLogout}
            className='header-logout-btn'
            title='Logout'
            aria-label='Logout'
          >
            <LogoutIcon color='#ffffff' size={18} />
            <span className='logout-label'>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
