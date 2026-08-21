// src/pages/AdminUsersPage.jsx
import React from "react";

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    joined: "2024-01-10",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    status: "active",
    joined: "2024-01-05",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "user",
    status: "active",
    joined: "2024-01-12",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "user",
    status: "inactive",
    joined: "2024-01-08",
  },
];

export const AdminUsersPage = () => {
  return (
    <div className='admin-page'>
      <div className='page-header'>
        <h1 className='heading-2'>Manage Users</h1>
        <p className='body-small text-muted'>View and manage user accounts</p>
      </div>

      <div className='admin-table-wrapper'>
        <div className='card'>
          <div className='admin-toolbar'>
            <div className='admin-toolbar-left'>
              <input
                type='text'
                className='input'
                placeholder='Search users...'
                style={{ maxWidth: "300px" }}
              />
            </div>
            <div className='admin-toolbar-right'>
              <button className='btn btn-primary'>Add User</button>
            </div>
          </div>

          <div className='admin-table'>
            <div className='admin-table-header'>
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Status</span>
              <span>Joined</span>
              <span>Actions</span>
            </div>
            {mockUsers.map((user) => (
              <div key={user.id} className='admin-table-row'>
                <span data-label='Name'>{user.name}</span>
                <span data-label='Email'>{user.email}</span>
                <span data-label='Role'>
                  <span
                    className={`status-badge ${user.role === "admin" ? "status-badge-resolved" : "status-badge-pending"}`}
                  >
                    {user.role}
                  </span>
                </span>
                <span data-label='Status'>
                  <span
                    className={`status-badge ${user.status === "active" ? "status-badge-resolved" : "status-badge-rejected"}`}
                  >
                    {user.status}
                  </span>
                </span>
                <span data-label='Joined'>
                  {new Date(user.joined).toLocaleDateString()}
                </span>
                <span data-label='Actions'>
                  <button className='btn btn-sm btn-secondary'>Edit</button>
                  <button
                    className='btn btn-sm btn-danger'
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
