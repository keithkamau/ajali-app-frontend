import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Components
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Sidebar } from './components/common/Sidebar';

// Auth Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// App Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import CreateIncidentPage from './pages/CreateIncidentPage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import ActivityPage from './pages/ActivityPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import AdminIncidentsPage from './pages/AdminIncidentsPage'; // NEW
import AdminUsersPage from './pages/AdminUsersPage'; // NEW

// Protected Route Wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  
  if (!isAuthenticated) {
    window.location.href = `/login?redirect=${encodeURIComponent(location.pathname)}`;
    return null;
  }
  
  if (adminOnly && user?.role !== 'admin') {
    window.location.href = '/home';
    return null;
  }
  
  return children;
};

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const authPages = [
    '/', 
    '/login', 
    '/register', 
    '/forgot-password', 
    '/reset-password'
  ];
  
  const showNav = isAuthenticated && !authPages.includes(location.pathname);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-container">
      {showNav && <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />}
      {showNav && <Sidebar isOpen={sidebarOpen} />}
      <main className={`main-content ${showNav ? 'with-nav' : ''} ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/incidents/create" 
            element={
              <ProtectedRoute>
                <CreateIncidentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/incidents/:id" 
            element={
              <ProtectedRoute>
                <IncidentDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/activity" 
            element={
              <ProtectedRoute>
                <ActivityPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes - Admin Only */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/incidents" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminIncidentsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminUsersPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;