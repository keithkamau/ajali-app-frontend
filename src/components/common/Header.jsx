import { Header } from "./components/common/Header";
import "./components/common/Header.css";
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  // Don't show header on auth pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <header className='header'>
      <div className='header-container'>
        {/* Logo - always links to dashboard when logged in */}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className='header-logo'>
          <span className='header-logo-icon'>🚨</span>
          Ajali!
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

              {/* User section - separate from logout */}
              <div className='header-user-section'>
                {/* User Avatar - click goes to profile */}
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
                    <span className='avatar-icon'>👤</span>
                  )}
                </Link>

                {/* User Name - click goes to profile */}
                <Link to='/profile' className='header-user-name'>
                  {user?.full_name || "User"}
                </Link>

                {/* Logout button - separate */}
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
