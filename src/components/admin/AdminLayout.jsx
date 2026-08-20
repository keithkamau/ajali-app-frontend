import { Outlet } from "react-router-dom";
import React from "react";
import AdminSidebar from "./AdminSidebar";
import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Ajali Admin</h1>
            <p>Emergency management dashboard</p>
          </div>

          <div className="admin-profile">
            <div className="admin-welcome">
              <span>Welcome, Admin</span>
              <small>Administrator</small>
            </div>

            <div className="admin-avatar">A</div>
          </div>
        </header>

        <div className="admin-page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;