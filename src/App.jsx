// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route ,useLocation } from "react-router-dom";
import { Header } from "./components/common/Header";
import { Footer } from "./components/common/Footer";
// import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import DashboardPage from "./pages/DashboardPage";
import CreateIncidentPage from "./pages/CreateIncidentPage";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import AdminPage from "./pages/AdminPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminIncidentsPage from "./pages/AdminIncidentsPage";
import AdminIncidentDetailPage from "./pages/AdminIncidentDetailPage";
import UserManagement from "./components/admin/UserManagement";

function AppContent() {
  const location = useLocation();

  const showNav = !["/login", "/register", "/"].includes(
    location.pathname
  );

  return (
    <div className="app-container">
      {showNav && <Header />}

      <main className="main-content">
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* <Route path="/register" element={<RegisterPage />} /> */}

          {/* <Route path="/dashboard" element={<DashboardPage />} /> */}

          <Route
            path="/incidents/create"
            element={<CreateIncidentPage />}
          />

          {/* <Route
            path="/incidents/:id"
            element={<IncidentDetailPage />}
          /> */}

          {/* <Route
            path="/incidents/:id/edit"
            element={<EditIncidentPage />}
          /> */}

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="incidents" element={<AdminIncidentsPage />} />
            <Route path="incidents/:id" element={<AdminIncidentDetailPage />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Routes>
      </main>

      <Footer />
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
