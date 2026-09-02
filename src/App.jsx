import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreateIncidentPage from "./pages/CreateIncidentPage";
import EditIncidentPage from "./pages/EditIncidentPage";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import NotificationsPage from "./pages/NotificationsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { getCurrentUser } from "./redux/slices/authSlice";
import "./App.css";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div
        className='loading-container'
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className='spinner'></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to='/login' />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth,
  );

  if (isLoading) {
    return (
      <div
        className='loading-container'
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className='spinner'></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to='/login' />;
  if (user?.role !== "admin") return <Navigate to='/dashboard' />;
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-ground)",
        }}
      >
        <div className='spinner'></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Header
        onToggleSidebar={toggleSidebar}
        sidebarExpanded={sidebarExpanded}
      />
      <div className='app-layout'>
        {isAuthenticated && <Sidebar collapsed={!sidebarExpanded} />}
        <main
          className={`main-content ${isAuthenticated ? (sidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed") : ""}`}
        >
          <Routes>
            <Route path='/' element={<Navigate to='/dashboard' />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/forgot-password' element={<ForgotPasswordPage />} />
            <Route
              path='/reset-password/:token'
              element={<ResetPasswordPage />}
            />

            <Route
              path='/dashboard'
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path='/incidents/create'
              element={
                <PrivateRoute>
                  <CreateIncidentPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/incidents/:id'
              element={
                <PrivateRoute>
                  <IncidentDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/incidents/:id/edit'
              element={
                <PrivateRoute>
                  <EditIncidentPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/notifications'
              element={
                <PrivateRoute>
                  <NotificationsPage />
                </PrivateRoute>
              }
            />

            <Route
              path='/admin'
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
