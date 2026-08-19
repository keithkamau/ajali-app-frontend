// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CreateIncidentPage from "./pages/CreateIncidentPage";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import EditIncidentPage from "./pages/EditIncidentPage";
import AdminPage from "./pages/AdminPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className='app-container'>
        <main className='main-content'>
          <Routes>
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='/incidents/create' element={<CreateIncidentPage />} />
            <Route path='/incidents/:id' element={<IncidentDetailPage />} />
            <Route path='/incidents/:id/edit' element={<EditIncidentPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
