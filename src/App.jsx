import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
import "./App.css";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to='/login' />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to='/login' />;
  if (user?.role !== "admin") return <Navigate to='/dashboard' />;
  return children;
};

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

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
