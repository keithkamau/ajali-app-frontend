import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import "./Header.css";

const Header = ({ onToggleSidebar, sidebarExpanded }) => {
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

    // Determine dashboard route based on role
    const getDashboardRoute = () => {
        if (!isAuthenticated) return "/";
        if (user?.role === "admin") return "/admin";
        return "/dashboard";
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-left">
                    {isAuthenticated && (
                        <button 
                            className="header-hamburger" 
                            onClick={onToggleSidebar}
                            aria-label="Toggle sidebar"
                        >
                            {sidebarExpanded ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="12" x2="21" y2="12"/>
                                    <line x1="3" y1="6" x2="21" y2="6"/>
                                    <line x1="3" y1="18" x2="21" y2="18"/>
                                </svg>
                            )}
                        </button>
                    )}
                    <Link to={getDashboardRoute()} className="header-logo">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            <polyline points="9 12 11 14 15 10"/>
                        </svg>
                        <span>AJALI</span>
                    </Link>
                </div>

                <nav className="header-nav">
                    {isAuthenticated ? (
                        <div className="header-user-section">
                            <Link to="/profile" className="header-user-avatar" title={user?.full_name}>
                                {user?.full_name ? (
                                    <span className="avatar-initials">
                                        {user.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                    </span>
                                ) : (
                                    <span className="avatar-icon">U</span>
                                )}
                            </Link>
                            
                            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="header-nav-link">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;