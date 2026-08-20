<<<<<<< HEAD
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../components/admin/AdminDashboard";
import React from "react";
function AdminPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}
=======
import React from "react";

export const AdminPage = () => {
  return (
    <div className='admin-page'>
      <div className='page-header'>
        <h1 className='heading-2'>Admin Dashboard</h1>
        <p className='body-small text-muted'>Manage incidents and users</p>
      </div>
>>>>>>> abb89dfc09a27713adf698d71d498578d6892537

      <div className='admin-stats'>
        <div className='stat-card'>
          <div className='stat-number'>0</div>
          <div className='stat-label'>Total Reports</div>
        </div>
        <div className='stat-card'>
          <div className='stat-number'>0</div>
          <div className='stat-label'>In Progress</div>
        </div>
        <div className='stat-card'>
          <div className='stat-number'>0</div>
          <div className='stat-label'>Resolved</div>
        </div>
        <div className='stat-card'>
          <div className='stat-number'>0</div>
          <div className='stat-label'>SOS Alerts</div>
        </div>
      </div>

      <div className='admin-table-wrapper'>
        <div className='card'>
          <h3 className='heading-4'>All Incidents</h3>
          <div className='empty-state'>
            <p className='body-small text-muted'>No incidents to display</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
