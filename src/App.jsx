import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import BottomNav from "./components/common/BottomNav";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreateIncidentPage from "./pages/CreateIncidentPage";
import EditIncidentPage from "./pages/EditIncidentPage";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import AdminIncidents from "./pages/AdminIncidents";
import AdminUsers from "./pages/AdminUsers";
import AdminStats from "./pages/AdminStats";
import NotificationsPage from "./pages/NotificationsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { getCurrentUser } from "./redux/slices/authSlice";
import "./App.css";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to='/dashboard' replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(getCurrentUser()).finally(() => {
        setIsAppLoading(false);
      });
    } else {
      setIsAppLoading(false);
    }
  }, [dispatch]);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  if (isAppLoading) {
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
        <main className='main-content'>
          <Routes>
            <Route path='/' element={<Navigate to='/dashboard' replace />} />
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

            {/* Admin Routes */}
            <Route
              path='/admin'
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
            <Route
              path='/admin/incidents'
              element={
                <AdminRoute>
                  <AdminIncidents />
                </AdminRoute>
              }
            />
            <Route
              path='/admin/users'
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route
              path='/admin/stats'
              element={
                <AdminRoute>
                  <AdminStats />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </div>
      {isAuthenticated && <BottomNav />}
    </BrowserRouter>
  );
}

export default App;
