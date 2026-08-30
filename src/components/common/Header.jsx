import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <header className='header'>
      <div className='header-container'>
        <Link to={isAuthenticated ? "/dashboard" : "/"} className='header-logo'>
          <svg
            width='28'
            height='28'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#0f172a'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
            <polyline points='9 12 11 14 15 10' />
          </svg>
          <span>AJALI</span>
        </Link>

        <nav className='header-nav'>
          {isAuthenticated ? (
            <>
              <Link to='/dashboard' className='header-nav-link'>
                Dashboard
              </Link>
              <Link to='/incidents/create' className='header-nav-link'>
                Report
              </Link>
              {user?.role === "admin" && (
                <Link to='/admin' className='header-nav-link'>
                  Admin
                </Link>
              )}

              <div className='header-user-section'>
                <Link
                  to='/profile'
                  className='header-user-avatar'
                  title={user?.full_name}
                >
                  {user?.full_name ? (
                    <span className='avatar-initials'>
                      {user.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  ) : (
                    <span className='avatar-icon'>U</span>
                  )}
                </Link>

                <Link to='/profile' className='header-user-name'>
                  {user?.full_name || "User"}
                </Link>

                <button
                  onClick={handleLogout}
                  className='btn btn-secondary btn-sm'
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to='/login' className='header-nav-link'>
                Login
              </Link>
              <Link to='/register' className='btn btn-primary btn-sm'>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
